# FlowLens Demo Script (2 Minutes)

> **Purpose**: Walk judges through the FlowLens AI Ops Copilot capabilities

## Pre-Demo Checklist

- [ ] Dashboard running at http://localhost:3000 or Vercel URL
- [ ] Screen recording software ready (OBS/Loom)
- [ ] Browser at 1920x1080 or similar
- [ ] Microphone ready for voiceover

---

## Script Timeline

### 🎬 0:00 - 0:15 | Introduction

**[Show dashboard homepage]**

> "This is FlowLens - an AI Ops Copilot that autonomously monitors systems, analyzes incidents, and takes safe actions. It integrates Kestra for workflows, Oumi for RL training, and open-source LLMs for analysis."

**Key visuals**:
- FlowLens logo with tagline
- System health panel (show healthy/degraded status)
- Integration badges (Kestra, Oumi, Cline, CodeRabbit)

---

### 🔍 0:15 - 0:30 | System Overview

**[Point to left panel - System Health]**

> "The dashboard shows real-time system health. We have 2 active incidents, 7 resolved today. The Policy AI powered by Oumi has 94% decision accuracy."

**Scroll through**:
- Service health cards
- Oumi policy metrics
- Connected integrations

---

### ⚡ 0:30 - 0:50 | Trigger Simulated Incident

**[Click "Simulate Incident" button]**

> "Let's simulate a production incident. I'll click this button which triggers a Kestra workflow."

**[Wait 2-3 seconds for incident to appear]**

> "Immediately the system detects a CPU spike on the API Gateway. Notice it appears at the top of the timeline with HIGH severity."

**Point to**:
- New incident card
- Severity badge
- Affected services

---

### 🧠 0:50 - 1:20 | AI Analysis & Proposed Actions

**[Click on the new incident]**

> "Clicking the incident shows the AI analysis. The LLM - Qwen 2.5 - has analyzed the metrics and logs."

**[Show Analysis tab]**

> "It identified a 3x traffic surge, suggested scaling horizontally, and calculated 91% confidence for the scale action."

**Point to**:
- LLM Analysis section
- Root cause identification
- Confidence percentage

**[Scroll to Proposed Actions]**

> "Two actions are proposed: Scale up with 91% confidence is PENDING approval, while the notification was AUTO-APPROVED by the policy because it's low risk."

---

### ✅ 1:20 - 1:40 | Action Approval Workflow

**[Click "Approve" on scale action]**

> "I can expand the AI reasoning to see why it recommended this. Now I'll approve the scale action."

**[Show approval confirmation]**

> "In production, this would trigger Kestra to scale the service. The Oumi policy model learns from my approval to improve future decisions."

---

### 🔧 1:40 - 1:55 | Kestra & Oumi Integration

**[Switch to show Kestra flow YAML or mention it]**

> "Behind the scenes, three Kestra flows handle data collection, LLM summarization, and decision-making. Oumi continuously trains the policy model on labeled decisions to reduce false alarms."

**Optional: Show**:
- Kestra flow diagram
- Oumi training data sample

---

### 🎯 1:55 - 2:00 | Closing

**[Return to dashboard]**

> "FlowLens transforms reactive incident response into proactive automation. It's the AI Ops Copilot for data-driven teams."

**End on**:
- Dashboard with resolved incident
- FlowLens logo

---

## Recording Tips

1. **Speak slowly and clearly** - 2 minutes is tight
2. **Pause on key visuals** - let viewers absorb
3. **Use cursor to point** - guide attention
4. **Edit out mistakes** - keep it polished
5. **Add captions** - helps accessibility

## Quick Demo Commands

```bash
# Start dashboard
cd packages/ui && npm run dev

# Or use Vercel preview
vercel dev
```
