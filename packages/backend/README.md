# FlowLens Backend API

Python FastAPI backend for the FlowLens AI Ops Copilot.

## Setup

```bash
cd packages/backend
pip install -r requirements.txt
python main.py
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | System health status |
| `/api/incidents` | GET | List all incidents |
| `/api/incidents/{id}` | GET | Get incident details |
| `/api/incidents/simulate` | POST | Simulate a new incident |
| `/api/actions/{id}/approve` | POST | Approve an action |
| `/api/actions/{id}/deny` | POST | Deny an action |
| `/api/metrics` | GET | Policy metrics |
| `/api/narrative` | GET | AI-generated narrative |

## Environment Variables

```
OLLAMA_URL=http://localhost:11434
KESTRA_URL=http://localhost:8080
```
