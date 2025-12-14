## FlowLens — Hackathon Award Eligibility Statement

### The Infinity Build Award ($5,000) — Cline CLI

**Qualification**: FlowLens includes three complete Cline CLI task templates that automate software development workflows:

1. **add-metric.json** — Automates adding new monitoring metrics across the entire pipeline (Kestra flows, TypeScript types, UI components, and documentation)

2. **sync-flows.json** — Synchronizes Kestra workflow definitions with TypeScript interfaces, runs validation, and creates PRs automatically

3. **add-action-type.json** — Adds new action types to the decision system, updating all relevant files including safety constraints and Oumi training configs

**Evidence**: `packages/cline-tools/tasks/*.json`

---

### The Wakanda Data Award ($4,000) — Kestra AI Agent

**Qualification**: FlowLens implements three Kestra flows that form a complete AI agent pipeline:

1. **collect-snapshot.yaml** — Aggregates metrics, logs, and deployment data from multiple sources into structured snapshots

2. **summarize-incident.yaml** — Uses open-source LLMs (Qwen 2.5) to analyze snapshot data, detect anomalies, identify root causes, and generate natural language summaries

3. **decision-flow.yaml** — Makes autonomous decisions based on summarized data, scoring proposed actions with the Oumi-trained policy model and auto-executing low-risk actions while escalating high-risk decisions to humans

**Evidence**: `packages/kestra-flows/flows/*.yaml`

---

### The Iron Intelligence Award ($3,000) — Oumi RL Fine-tuning

**Qualification**: FlowLens includes complete Oumi reinforcement learning configuration:

1. **policy_sft.yaml** — Supervised fine-tuning configuration for the base policy model using Qwen2.5-1.5B-Instruct

2. **policy_rl.yaml** — DPO (Direct Preference Optimization) configuration for reinforcement learning fine-tuning, including safety constraints, human preference learning, and LLM-as-a-Judge evaluation

3. **labeled_decisions.jsonl** — Training dataset with 10 labeled decision examples (good/bad) demonstrating correct and incorrect policy behavior

Includes optional features: Data Synthesis and LLM-as-a-Judge.

**Evidence**: `packages/oumi-training/configs/*.yaml`, `packages/oumi-training/data/labeled_decisions.jsonl`

---

### The Stormbreaker Deployment Award ($2,000) — Vercel Deployment

**Qualification**: FlowLens is deployed and live on Vercel.

**Live URL**: https://ui-bifdbx27s-yashvanthskernels-projects.vercel.app

**Evidence**: Live deployment accessible at the URL above

---

### The Captain Code Award ($1,000) — CodeRabbit

**Qualification**: The FlowLens repository is configured for CodeRabbit integration:

1. **GitHub Actions CI** (`.github/workflows/ci.yaml`) — Automated workflow that triggers on PRs
2. **Cline + CodeRabbit Integration** — Task templates include `auto_pr` configuration for CodeRabbit review
3. **Repository Best Practices**: README, MIT License, TypeScript, ESLint

**Evidence**: `.github/workflows/ci.yaml`, GitHub repository

---

**Repository**: https://github.com/YashvanthsKernel/Flowlens
**Live Demo**: https://ui-bifdbx27s-yashvanthskernels-projects.vercel.app
