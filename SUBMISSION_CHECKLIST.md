# FlowLens Submission Checklist

## 📋 Hackathon Requirements

### Required Components ✅

- [x] **Kestra AI Agent** - 3 flows in `packages/kestra-flows/`
  - `collect-snapshot.yaml` - Data ingestion
  - `summarize-incident.yaml` - LLM analysis
  - `decision-flow.yaml` - Autonomous actions

- [x] **Cline CLI Integration** - Task templates in `packages/cline-tools/`
  - `add-metric.json`
  - `sync-flows.json`
  - `add-action-type.json`

- [x] **Oumi RL Training** - Configs in `packages/oumi-training/`
  - SFT configuration
  - DPO/RL configuration
  - Labeled training data (10 examples)

- [x] **Open-source LLMs** - Configured for Qwen 2.5
  - Summarization prompts
  - Policy model stubs

- [x] **Vercel Deployment** - Next.js app ready
  - Dashboard UI
  - Responsive design
  - Production build tested

- [x] **CodeRabbit** - GitHub Actions configured
  - CI workflow
  - PR review ready

---

## 🚀 Deployment Steps

### 1. Push to GitHub

```bash
cd g:\Projects\Personal\FlowLens

# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "feat: FlowLens AI Ops Copilot - Assemble Hack 2025"

# Add remote (replace with your repo)
git remote add origin https://github.com/YOUR_USERNAME/flowlens.git

# Push
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm i -g vercel
vercel login
cd packages/ui
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repo
3. Set root directory: `packages/ui`
4. Deploy

### 3. Enable CodeRabbit

1. Go to [coderabbit.ai](https://coderabbit.ai)
2. Install GitHub App
3. Enable for `flowlens` repo
4. Create a test PR to show review

---

## 📹 Demo Video

### Recording
- Use OBS Studio or Loom
- 1920x1080 resolution
- Clear microphone audio
- Follow `DEMO_SCRIPT.md`

### Upload Options
- YouTube (unlisted)
- Loom share link
- Google Drive

---

## 📝 Submission Materials

### Required Links
- [ ] GitHub Repo: `https://github.com/YOUR_USERNAME/flowlens`
- [ ] Vercel URL: `https://flowlens.vercel.app`
- [ ] Demo Video: `[YouTube/Loom link]`

### README Highlights to Mention
- Architecture diagram (Mermaid)
- Quick start guide
- Tool integration explanations
- License (MIT)

---

## ✨ Polish Checklist

- [x] README with badges
- [x] Architecture diagram
- [x] Clear project structure
- [x] Package READMEs
- [x] Docker Compose setup
- [x] GitHub Actions CI
- [ ] Vercel deployment
- [ ] Demo video recorded
- [ ] Test CodeRabbit on a PR
