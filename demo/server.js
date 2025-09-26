#!/usr/bin/env node
const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 4173;

const scenarios = {
  data_cleanup: {
    id: 'data_cleanup',
    title: 'Marketing Ops: Clean Campaign Responses',
    script: [
      { role: 'agent', content: 'Hi! I can help plan the clean-up pipeline. What do you need?' },
    ],
    pipeline: {
      nodes: [
        { id: 'ingest', label: 'Load Raw Sheet', color: '#0ea5e9' },
        { id: 'dedupe', label: 'Deduplicate Leads', color: '#6366f1' },
        { id: 'standardize', label: 'Standardize Fields', color: '#7c3aed' },
        { id: 'qa', label: 'QA Summary', color: '#e11d48' },
      ],
      edges: [
        { source: 'ingest', target: 'dedupe' },
        { source: 'dedupe', target: 'standardize' },
        { source: 'standardize', target: 'qa' },
      ],
    },
    explanation: {
      summary: 'The agent recommends loading the sheet, removing duplicates, standardizing column formats, and summarizing QA findings.',
      decisions: [
        'Use spreadsheet loader for quick ingestion.',
        'Apply fuzzy match deduplication on email + company.',
        'Normalize country/state using locale tables.',
      ],
      risks: [
        'Manual overrides may be needed for edge-case locales.',
      ],
    },
  },
  research_brief: {
    id: 'research_brief',
    title: 'Analyst: Compile AI Policy Brief',
    script: [
      { role: 'agent', content: 'Hello researcher! Ready to assemble a policy brief when you are.' },
    ],
    pipeline: {
      nodes: [
        { id: 'ingest', label: 'Search Recent News', color: '#14b8a6' },
        { id: 'cluster', label: 'Cluster Findings', color: '#f97316' },
        { id: 'summarize', label: 'Summarize Themes', color: '#a855f7' },
        { id: 'brief', label: 'Draft Brief', color: '#f43f5e' },
      ],
      edges: [
        { source: 'ingest', target: 'cluster' },
        { source: 'cluster', target: 'summarize' },
        { source: 'summarize', target: 'brief' },
      ],
    },
    explanation: {
      summary: 'Recommended pipeline pulls recent coverage, groups similar stories, summarizes each cluster, and drafts the final brief.',
      decisions: [
        'Blend web search with knowledge base retrieval.',
        'Use embedding clustering for thematic grouping.',
        'Summaries feed into a structured brief template.',
      ],
      risks: [
        'Search API quota must be monitored during peak cycles.',
      ],
    },
  },
  customer_support: {
    id: 'customer_support',
    title: 'Support: Resolve Escalated Ticket',
    script: [
      { role: 'agent', content: 'Support engineer here—share the ticket details and I will design a runbook.' },
    ],
    pipeline: {
      nodes: [
        { id: 'triage', label: 'Intent Triage', color: '#0ea5e9' },
        { id: 'retrieve', label: 'Retrieve SOP', color: '#facc15' },
        { id: 'diagnose', label: 'Diagnose Failure', color: '#22c55e' },
        { id: 'handoff', label: 'Draft Customer Reply', color: '#f97316' },
      ],
      edges: [
        { source: 'triage', target: 'retrieve' },
        { source: 'retrieve', target: 'diagnose' },
        { source: 'diagnose', target: 'handoff' },
      ],
    },
    explanation: {
      summary: 'The runbook triages the issue, retrieves the relevant SOP, runs diagnostics, and drafts a message for the customer.',
      decisions: [
        'Intent classifier identifies whether the issue is account, billing, or technical.',
        'Diagnostic checklist prompts engineer inputs.',
        'Response generator provides a draft email for review.',
      ],
      risks: [
        'Escalations require human approval before sending.',
      ],
    },
  },
};

const scenarioList = Object.values(scenarios);

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function writeJSON(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
  });
  res.end(payload);
}

function handleIntent({ scenarioId, message }) {
  const scenario = scenarios[scenarioId];
  if (!scenario) return { status: 404, body: { error: 'Unknown scenario' } };

  const response = {
    intent: `${scenarioId}:analyzed`,
    reply: `I understand the request: "${message}". Here is how I would proceed...`,
  };

  return { status: 200, body: response };
}

function handlePipeline({ scenarioId }) {
  const scenario = scenarios[scenarioId];
  if (!scenario) return { status: 404, body: { error: 'Unknown scenario' } };

  const pipeline = JSON.parse(JSON.stringify(scenario.pipeline));
  return { status: 200, body: { pipeline } };
}

function handleExplanation({ scenarioId }) {
  const scenario = scenarios[scenarioId];
  if (!scenario) return { status: 404, body: { error: 'Unknown scenario' } };

  const explanation = JSON.parse(JSON.stringify(scenario.explanation));
  return { status: 200, body: { explanation } };
}

function handleDecision({ scenarioId, decision }) {
  const scenario = scenarios[scenarioId];
  if (!scenario) return { status: 404, body: { error: 'Unknown scenario' } };

  const verb = decision === 'approve' ? 'approved' : 'flagged for changes';
  return {
    status: 200,
    body: { message: `${scenario.title} ${verb}.` },
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/scenarios') {
    writeJSON(res, 200, { scenarios: scenarioList.map(({ id, title }) => ({ id, title })) });
    return;
  }

  const scenarioMatch = url.pathname.match(/^\/api\/scenarios\/([\w_-]+)$/);
  if (req.method === 'GET' && scenarioMatch) {
    const scenarioId = scenarioMatch[1];
    const scenario = scenarios[scenarioId];
    if (!scenario) {
      writeJSON(res, 404, { error: 'Unknown scenario' });
      return;
    }
    writeJSON(res, 200, scenario);
    return;
  }

  const requiresBody = ['/api/intent', '/api/pipeline', '/api/explanation', '/api/decision'];
  if (requiresBody.includes(url.pathname)) {
    try {
      const payload = await readRequestBody(req);
      let response;
      switch (url.pathname) {
        case '/api/intent':
          response = handleIntent(payload);
          break;
        case '/api/pipeline':
          response = handlePipeline(payload);
          break;
        case '/api/explanation':
          response = handleExplanation(payload);
          break;
        case '/api/decision':
          response = handleDecision(payload);
          break;
        default:
          response = { status: 404, body: { error: 'Not found' } };
      }
      writeJSON(res, response.status, response.body);
    } catch (error) {
      writeJSON(res, 400, { error: error.message });
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Mock agent backend running on http://localhost:${PORT}`);
});
