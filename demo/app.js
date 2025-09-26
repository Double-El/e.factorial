const state = {
  scenarioId: null,
  history: [],
  pipeline: null,
  explanation: null,
};

const conversationEl = document.getElementById('conversation');
const scenarioSelectEl = document.getElementById('scenarioSelect');
const chatFormEl = document.getElementById('chatForm');
const messageInputEl = document.getElementById('messageInput');
const explanationEl = document.getElementById('explanation');
const approveButtonEl = document.getElementById('approveButton');
const requestChangesButtonEl = document.getElementById('requestChangesButton');
const toastEl = document.getElementById('toast');

const pipelineSvg = d3.select('#pipelineGraph');
const svgGroup = pipelineSvg.append('g');
const zoom = d3.zoom().on('zoom', (event) => {
  svgGroup.attr('transform', event.transform);
});
pipelineSvg.call(zoom);

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text}`);
  }
  return response.json();
}

function renderMessage({ role, content }) {
  const messageEl = document.createElement('div');
  messageEl.className = `message ${role}`;
  messageEl.textContent = content;
  conversationEl.appendChild(messageEl);
  conversationEl.scrollTop = conversationEl.scrollHeight;
}

function resetConversation(script) {
  conversationEl.innerHTML = '';
  state.history = [];
  script.forEach((message) => {
    state.history.push(message);
    renderMessage(message);
  });
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function renderExplanation(explanation) {
  explanationEl.innerHTML = '';

  const summary = document.createElement('p');
  summary.textContent = explanation.summary;
  explanationEl.appendChild(summary);

  if (explanation.decisions?.length) {
    const decisionsHeading = document.createElement('h3');
    decisionsHeading.textContent = 'Key Decisions';
    explanationEl.appendChild(decisionsHeading);

    const list = document.createElement('ul');
    explanation.decisions.forEach((decision) => {
      const item = document.createElement('li');
      item.textContent = decision;
      list.appendChild(item);
    });
    explanationEl.appendChild(list);
  }

  if (explanation.risks?.length) {
    const risksHeading = document.createElement('h3');
    risksHeading.textContent = 'Risks & Mitigations';
    explanationEl.appendChild(risksHeading);

    const list = document.createElement('ul');
    explanation.risks.forEach((risk) => {
      const item = document.createElement('li');
      item.textContent = risk;
      list.appendChild(item);
    });
    explanationEl.appendChild(list);
  }
}

function renderPipeline(pipeline) {
  const width = pipelineSvg.node().clientWidth || 600;
  const height = pipelineSvg.node().clientHeight || 400;

  pipelineSvg.attr('viewBox', `0 0 ${width} ${height}`);

  svgGroup.selectAll('*').remove();

  const simulation = d3
    .forceSimulation(pipeline.nodes)
    .force('link', d3.forceLink(pipeline.edges).id((d) => d.id).distance(160))
    .force('charge', d3.forceManyBody().strength(-320))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .stop();

  for (let i = 0; i < 120; i += 1) {
    simulation.tick();
  }

  const link = svgGroup
    .selectAll('line')
    .data(pipeline.edges)
    .enter()
    .append('line')
    .attr('stroke', '#64748b')
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)');

  const node = svgGroup
    .selectAll('g.node')
    .data(pipeline.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.x},${d.y})`);

  node
    .append('rect')
    .attr('width', 160)
    .attr('height', 60)
    .attr('x', -80)
    .attr('y', -30)
    .attr('rx', 14)
    .attr('fill', (d) => d.color || '#1d4ed8')
    .attr('opacity', 0.85)
    .attr('stroke', '#e2e8f0')
    .attr('stroke-width', 1.5);

  node
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#f8fafc')
    .attr('font-weight', 600)
    .text((d) => d.label);

  const defs = svgGroup.append('defs');
  defs
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 28)
    .attr('refY', 0)
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#64748b');

  link
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);
}

function disableInput(disabled) {
  messageInputEl.disabled = disabled;
  messageInputEl.placeholder = disabled ? 'Waiting for agent response…' : 'Ask the agent…';
}

async function loadScenarios() {
  try {
    const data = await fetchJSON('/api/scenarios');
    scenarioSelectEl.innerHTML = '';
    data.scenarios.forEach((scenario) => {
      const option = document.createElement('option');
      option.value = scenario.id;
      option.textContent = scenario.title;
      scenarioSelectEl.appendChild(option);
    });
    if (data.scenarios.length > 0) {
      scenarioSelectEl.value = data.scenarios[0].id;
      selectScenario(data.scenarios[0].id);
    }
  } catch (error) {
    console.error(error);
    showToast('Unable to load scenarios. Start the dev server?');
  }
}

async function selectScenario(scenarioId) {
  try {
    const data = await fetchJSON(`/api/scenarios/${scenarioId}`);
    state.scenarioId = scenarioId;
    resetConversation(data.script);
    renderPipeline(data.pipeline);
    renderExplanation(data.explanation);
  } catch (error) {
    console.error(error);
    showToast('Failed to load the scenario.');
  }
}

async function handleChatSubmit(event) {
  event.preventDefault();
  if (!state.scenarioId) return;

  const message = messageInputEl.value.trim();
  if (!message) return;

  const userMessage = { role: 'user', content: message };
  state.history.push(userMessage);
  renderMessage(userMessage);

  disableInput(true);
  messageInputEl.value = '';

  try {
    const intentResponse = await fetchJSON('/api/intent', {
      method: 'POST',
      body: JSON.stringify({ scenarioId: state.scenarioId, message }),
    });
    const agentMessage = { role: 'agent', content: intentResponse.reply };
    state.history.push(agentMessage);
    renderMessage(agentMessage);

    const [pipelineResponse, explanationResponse] = await Promise.all([
      fetchJSON('/api/pipeline', {
        method: 'POST',
        body: JSON.stringify({ scenarioId: state.scenarioId, intent: intentResponse.intent }),
      }),
      fetchJSON('/api/explanation', {
        method: 'POST',
        body: JSON.stringify({ scenarioId: state.scenarioId, intent: intentResponse.intent }),
      }),
    ]);

    renderPipeline(pipelineResponse.pipeline);
    renderExplanation(explanationResponse.explanation);
  } catch (error) {
    console.error(error);
    showToast('Agent service is unavailable.');
  } finally {
    disableInput(false);
  }
}

function notifyDecision(decision) {
  if (!state.scenarioId) return;
  fetchJSON('/api/decision', {
    method: 'POST',
    body: JSON.stringify({ scenarioId: state.scenarioId, decision }),
  })
    .then((response) => {
      showToast(response.message);
    })
    .catch((error) => {
      console.error(error);
      showToast('Failed to record decision.');
    });
}

scenarioSelectEl.addEventListener('change', (event) => {
  selectScenario(event.target.value);
});

chatFormEl.addEventListener('submit', handleChatSubmit);
approveButtonEl.addEventListener('click', () => notifyDecision('approve'));
requestChangesButtonEl.addEventListener('click', () => notifyDecision('request_changes'));

disableInput(true);
loadScenarios().finally(() => disableInput(false));
