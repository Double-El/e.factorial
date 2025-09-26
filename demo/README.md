# E.Factorial Agent Demo

This directory contains a lightweight, static demo that showcases how the E.Factorial agent surfaces LangGraph pipeline recommendations. The mock frontend renders a chatbot UI, visual pipeline DAG, and the explanation panel for three scripted scenarios.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A modern browser (Chrome, Edge, Firefox, or Safari)

## Available scenarios

| ID | Title | Description |
| --- | --- | --- |
| `data_cleanup` | Marketing Ops: Clean Campaign Responses | Deduplicates and standardizes campaign data before QA. |
| `research_brief` | Analyst: Compile AI Policy Brief | Aggregates recent coverage into a summarized policy brief. |
| `customer_support` | Support: Resolve Escalated Ticket | Walks through an escalation runbook with human approval. |

## Run the mock backend

The mock backend exposes the same endpoints expected from the real agent service: `/api/intent`, `/api/pipeline`, `/api/explanation`, and `/api/decision`.

```bash
node server.js
```

By default, the server listens on <http://localhost:4173>. You can override the port with `PORT=5000 node server.js` if desired.

## Launch the demo UI

Open a new terminal tab and use any static file server to serve `index.html`. Two easy options:

### Option 1: Node HTTP server (no install)

```bash
npx serve@14 .
```

### Option 2: Python (built-in)

```bash
python -m http.server 4172
```

Then visit the URL printed by the static server (for example <http://localhost:4172/demo/index.html>). Make sure the `server.js` mock backend continues running so the UI can fetch responses.

## How the demo works

1. Select one of the scripted scenarios from the dropdown.
2. The conversation panel displays the opening agent message.
3. Type a prompt and press **Send**. The frontend calls `/api/intent` to mock intent parsing, then requests `/api/pipeline` and `/api/explanation` based on that intent.
4. The returned LangGraph pipeline is rendered as a DAG using D3.js, while the explanation section summarizes key decisions and risks.
5. Use **Approve Pipeline** or **Request Changes** to notify the mock backend of your decision.

The demo is intentionally simple so that product teams can iterate on UI flows before connecting to the live agent service.
