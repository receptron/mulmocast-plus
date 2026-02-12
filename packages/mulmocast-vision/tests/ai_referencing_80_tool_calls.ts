export const data = {
  theme: "AI's impact on referencing, citations, and information trust",
  generated_on: "2025-08-21",
  items: [
    {
      name: "createSectionDividerSlide",
      arguments: {
        heading: "How AI Is Reshaping Referencing",
        subheading: "From sources to systems: reliability, traceability, and credit in the age of models",
      },
    },
    {
      name: "createAgendaSlide",
      arguments: {
        title: "Agenda",
        items: [
          "Executive summary",
          "Reference reliability and hallucinations",
          "Attribution and credit in AI workflows",
          "Standards & compliance (academia, journalism, law)",
          "Roadmap & recommendations",
        ],
      },
    },
    {
      name: "createExecutiveSummarySlide",
      arguments: {
        title: "Executive Summary",
        bullets: [
          "AI accelerates discovery but introduces novel risks in citation accuracy and provenance.",
          "RAG and structured retrieval reduce hallucinations when sources are governed and auditable.",
          "Attribution standards are emerging; early adoption lowers legal and reputational exposure.",
          "Watermarking and signed citations enable verifiable chains of reference.",
          "Organizations need policy, training, and tooling to ensure traceable, compliant referencing.",
        ],
      },
    },
    {
      name: "createKeyMessageWithSupportsSlide",
      arguments: {
        headline: "Trustworthy referencing is a prerequisite for AI at scale.",
        supports: [
          "Stakeholders require verifiable provenance for critical decisions.",
          "Standards (e.g., citations, licensing) are uneven across industries.",
          "Tooling gaps persist between LLM outputs and enterprise compliance systems.",
        ],
      },
    },
    {
      name: "createHypothesisSlide",
      arguments: {
        hypothesis: "Firms that implement verifiable AI referencing will reduce risk and accelerate adoption.",
        implications: [
          "Lower legal exposure on copyright and misinformation claims.",
          "Faster audit cycles through machine-readable provenance.",
          "Higher user confidence and usage in knowledge-heavy workflows.",
        ],
        nextSteps: [
          "Deploy governed retrieval with source whitelists.",
          "Adopt signed citations and immutable logs for high-stakes outputs.",
          "Train users on prompt patterns that preserve attribution.",
        ],
      },
    },
    {
      name: "createIssueTreeSlide",
      arguments: {
        rootIssue: "How to ensure accurate, compliant AI referencing?",
        branches: [
          ["Provenance capture", "Source governance", "Traceability"],
          ["Legal & licensing", "Attribution norms", "Fair use boundaries"],
          ["User behavior", "Training & prompts", "Review workflows"],
        ],
      },
    },
    {
      name: "createDriverTreeSlide",
      arguments: {
        metric: "Reference accuracy rate (%)",
        drivers: [
          ["Governed corpus coverage", "Retriever quality", "Index freshness"],
          ["Citation rendering logic", "Signed-source support", "Reviewer adherence"],
          ["User prompt hygiene", "Auto-evidence insertion", "UI nudges"],
        ],
      },
    },
    {
      name: "createMeceListSlide",
      arguments: {
        title: "MECE: Reference Risk Areas",
        groups: [
          {
            label: "Technical",
            items: ["Hallucinations", "Retriever gaps", "Version drift"],
          },
          {
            label: "Legal",
            items: ["Copyright", "Licensing", "Privacy & PII"],
          },
          {
            label: "Operational",
            items: ["Review latency", "Policy ambiguity", "Training gaps"],
          },
        ],
      },
    },
    {
      name: "createPyramidPrincipleSlide",
      arguments: {
        keyMessage: "Verifiable references unlock safe, scalable AI adoption.",
        supports: ["Reduces legal and reputational risk", "Improves stakeholder confidence", "Shortens audit cycles"],
        details: [
          ["Use source whitelists", "Track doc versions", "Sign evidence blobs"],
          ["Expose citations in UI", "Link to canonical sources", "Store prompts & context"],
          ["Automate QA sampling", "Monitor reference KPIs", "Escalate anomalies"],
        ],
      },
    },
    {
      name: "createScqaSlide",
      arguments: {
        situation: "Teams increasingly rely on AI to synthesize knowledge and draft outputs.",
        complication: "AI can misattribute or fabricate sources, risking credibility and compliance.",
        question: "How can we ensure references are accurate, traceable, and compliant?",
        answer: "Standardize governed retrieval, signed citations, and review workflows integrated into authoring tools.",
      },
    },
    {
      name: "createSwotSlide",
      arguments: {
        strengths: ["Speed of synthesis", "Scalable drafting", "Broad corpus reach"],
        weaknesses: ["Hallucinations", "Opaque provenance", "Reviewer overload"],
        opportunities: ["New evidence UX", "Standardized attribution", "Automated audits"],
        threats: ["Regulatory fines", "Misinformation", "IP disputes"],
      },
    },
    {
      name: "createThreeCSlide",
      arguments: {
        company: ["Commit to verifiable AI outputs", "Invest in governed retrieval"],
        customer: ["Needs trustworthy citations", "Wants explorable sources"],
        competitor: ["Adopting reference-safe workflows", "Marketing 'trust' as a differentiator"],
      },
    },
    {
      name: "createFourPSlide",
      arguments: {
        product: ["Reference-safe AI assistant", "Evidence panel", "Citation export"],
        price: ["Tiered by audit features", "Enterprise compliance add-ons"],
        place: ["Browser extension", "Docs add-in", "APIs"],
        promotion: ["Risk reduction ROI", "Case studies", "Compliance partnerships"],
      },
    },
    {
      name: "createSevenSSlide",
      arguments: {
        strategy: "Make 'trustworthy references' a core AI value prop",
        structure: "Central knowledge governance with federated champions",
        systems: "RAG, signing, audit logs integrated in content tools",
        sharedValues: "Truth, transparency, accountability",
        skills: "Prompting, retrieval tuning, compliance literacy",
        style: "Evidence-first culture",
        staff: "Knowledge stewards, AI librarians, compliance reviewers",
      },
    },
    {
      name: "createValueChainSlide",
      arguments: {
        primary: ["Ingestion", "Indexing", "Retrieval", "Generation", "Review", "Publication"],
        support: ["Governance", "Security", "Compliance", "Training", "Monitoring"],
      },
    },
    {
      name: "createPorterFiveForcesSlide",
      arguments: {
        newEntrants: ["AI-first doc tools", "Verification startups"],
        suppliers: ["Model providers", "Content licensors"],
        buyers: ["Enterprises", "Universities", "Newsrooms"],
        substitutes: ["Manual research", "Traditional search-only"],
        rivalry: ["Platform ecosystems", "Vertical specialists"],
      },
    },
    {
      name: "createBusinessModelCanvasSlide",
      arguments: {
        blocks: {
          "Key Partners": ["Model vendors", "Content platforms", "Auditors"],
          "Key Activities": ["Indexing", "Retrieval", "Signing", "QA"],
          "Key Resources": ["Curated corpora", "Embeddings index", "Audit logs"],
          "Value Propositions": ["Trustworthy AI outputs", "Time saved", "Reduced risk"],
          "Customer Relationships": ["Embedded in workflows", "SLAs"],
          Channels: ["Add-ins", "APIs", "Marketplace"],
          "Customer Segments": ["Legal", "Research", "Editorial"],
          "Cost Structure": ["Compute", "Licenses", "Review ops"],
          "Revenue Streams": ["Seats", "Usage", "Compliance tier"],
        },
      },
    },
    {
      name: "createCustomerJourneySlide",
      arguments: {
        stages: ["Discover", "Draft", "Verify", "Publish", "Audit"],
        touchpoints: [
          ["Search UI", "Corpus filters"],
          ["Editor plugin", "Reference panel"],
          ["Reviewer queue", "Signed citations"],
          ["Export formats", "Permalinks"],
          ["Randomized QA", "Dashboards"],
        ],
      },
    },
    {
      name: "createStakeholderMapSlide",
      arguments: {
        stakeholders: [
          {
            name: "Legal",
            influence: 9,
            interest: 8,
            notes: "Reduce liability",
          },
          {
            name: "Editorial",
            influence: 7,
            interest: 9,
            notes: "Protect credibility",
          },
          {
            name: "Engineering",
            influence: 8,
            interest: 7,
            notes: "Build RAG & signing",
          },
          {
            name: "End users",
            influence: 6,
            interest: 10,
            notes: "Need clarity & speed",
          },
        ],
      },
    },
    {
      name: "createRaciSlide",
      arguments: {
        tasks: ["Define policy", "Implement RAG", "Roll out training", "Monitor KPIs"],
        roles: ["Legal", "Engineering", "L&D", "Ops"],
        assignments: [
          ["A", "R", "C", "I"],
          ["C", "A/R", "I", "I"],
          ["I", "C", "A/R", "I"],
          ["C", "R", "I", "A"],
        ],
      },
    },
    {
      name: "createOkrKpiDashboardSlide",
      arguments: {
        title: "Reference Quality KPIs",
        metrics: [
          {
            label: "Reference accuracy",
            value: "97%",
            target: "\u226595%",
            status: "On track",
          },
          {
            label: "Signed citation coverage",
            value: "82%",
            target: "\u226580%",
            status: "On track",
          },
          {
            label: "Reviewer SLA",
            value: "4h",
            target: "\u22646h",
            status: "On track",
          },
        ],
      },
    },
    {
      name: "createBalancedScorecardSlide",
      arguments: {
        perspectives: [
          {
            name: "Financial",
            items: ["Reduce rework costs", "Avoid penalties"],
          },
          {
            name: "Customer",
            items: ["Trust score \u2191", "NPS \u2191"],
          },
          {
            name: "Internal",
            items: ["QA automation", "Corpus governance"],
          },
          {
            name: "Learning & Growth",
            items: ["Reviewer upskilling", "Prompt playbooks"],
          },
        ],
      },
    },
    {
      name: "createQuarterlyRoadmapSlide",
      arguments: {
        quarters: ["Q1", "Q2", "Q3", "Q4"],
        items: [
          {
            quarter: "Q1",
            label: "Policy & baseline KPIs",
          },
          {
            quarter: "Q2",
            label: "Signed citations rollout",
          },
          {
            quarter: "Q3",
            label: "Reviewer workflow automation",
          },
          {
            quarter: "Q4",
            label: "External audits & certification",
          },
        ],
      },
    },
    {
      name: "createMilestoneTimelineSlide",
      arguments: {
        title: "Implementation Timeline",
        milestones: [
          {
            label: "Policy approved",
            date: "2025-02-01",
            notes: "Exec sign-off",
          },
          {
            label: "RAG MVP live",
            date: "2025-04-15",
            notes: "Limited corpus",
          },
          {
            label: "Signed citations",
            date: "2025-06-30",
            notes: "Tier-1 content",
          },
          {
            label: "Audit-ready",
            date: "2025-09-30",
            notes: "Dashboards & sampling",
          },
        ],
      },
    },
    {
      name: "createGanttSimpleSlide",
      arguments: {
        tasks: [
          {
            name: "Policy drafting",
            start: "2025-01-05",
            end: "2025-02-01",
          },
          {
            name: "RAG build",
            start: "2025-02-05",
            end: "2025-04-15",
          },
          {
            name: "Signing & logs",
            start: "2025-04-01",
            end: "2025-06-30",
          },
          {
            name: "Reviewer ops",
            start: "2025-05-15",
            end: "2025-08-01",
          },
        ],
      },
    },
    {
      name: "createWaterfallSlide",
      arguments: {
        title: "Time Savings from AI Referencing (hrs/month)",
        steps: [
          {
            label: "Baseline (manual search)",
            value: 0,
          },
          {
            label: "RAG-enabled drafting",
            value: 120,
          },
          {
            label: "Signed citations",
            value: 160,
          },
          {
            label: "Automated QA",
            value: 190,
          },
        ],
      },
    },
    {
      name: "createFunnelSlide",
      arguments: {
        stages: [
          {
            label: "Drafts created",
            value: 1000,
          },
          {
            label: "Drafts with citations",
            value: 850,
          },
          {
            label: "Signed citations",
            value: 700,
          },
          {
            label: "Approved & published",
            value: 630,
          },
        ],
      },
    },
    {
      name: "createTwoByTwoMatrixSlide",
      arguments: {
        xAxis: "Evidence depth",
        yAxis: "Ease of use",
        quadrants: [["Scholarly databases"], ["AI assistants with signing"], ["Raw web search"], ["Legacy manual workflows"]],
      },
    },
    {
      name: "createBcgMatrixSlide",
      arguments: {
        stars: ["Signed-citation AI editors"],
        cashCows: ["Governed enterprise search"],
        questionMarks: ["Generative browsers"],
        dogs: ["Unverified copy-paste tools"],
      },
    },
    {
      name: "createGeMcKinseyMatrixSlide",
      arguments: {
        industryAttractiveness: ["Regulatory clarity", "IP-safe corpora", "Audit tooling"],
        competitiveStrength: ["Corpus quality", "Model integration", "Compliance features"],
        placements: [
          {
            name: "Signed AI editor",
            row: 0,
            col: 2,
          },
          {
            name: "Generic chatbot",
            row: 1,
            col: 1,
          },
          {
            name: "Manual search",
            row: 2,
            col: 0,
          },
        ],
      },
    },
    {
      name: "createMarimekkoPlaceholderSlide",
      arguments: {
        title: "Content Types by Share & Effort",
        categories: ["Academic", "News", "Internal docs", "Web"],
      },
    },
    {
      name: "createBubbleChartPlaceholderSlide",
      arguments: {
        title: "Risk vs Impact vs Adoption",
        points: [
          {
            label: "Legal memos",
            x: 8,
            y: 9,
            r: 20,
          },
          {
            label: "Blog posts",
            x: 4,
            y: 5,
            r: 15,
          },
          {
            label: "Research briefs",
            x: 7,
            y: 7,
            r: 18,
          },
        ],
      },
    },
    {
      name: "createHeatmapPlaceholderSlide",
      arguments: {
        rows: ["Teams"],
        cols: ["Accuracy", "Provenance", "Speed", "Compliance"],
        values: [[8, 7, 9, 6]],
      },
    },
    {
      name: "createKpiHighlightSlide",
      arguments: {
        title: "KPI Highlights",
        kpis: [
          {
            label: "Reference Accuracy",
            value: "97%",
            delta: "+2pp",
          },
          {
            label: "Signed Coverage",
            value: "82%",
            delta: "+5pp",
          },
          {
            label: "Audit Exceptions",
            value: "1.2%",
            delta: "-0.4pp",
          },
        ],
      },
    },
    {
      name: "createBeforeAfterSlide",
      arguments: {
        title: "Before vs After AI Referencing",
        before: ["Manual searches", "Inconsistent citations", "Slow audits"],
        after: ["Governed retrieval", "Standardized citations", "Signed evidence"],
      },
    },
    {
      name: "createOptionEvaluationSlide",
      arguments: {
        criteria: ["Accuracy", "Latency", "Compliance", "Cost"],
        options: ["Generic chatbot", "RAG + signing", "Manual review"],
        scores: [
          [5, 7, 9, 6],
          [8, 7, 9, 7],
          [9, 3, 10, 4],
        ],
      },
    },
    {
      name: "createRiskMitigationSlide",
      arguments: {
        risks: [
          {
            risk: "Misattribution",
            impact: "High",
            likelihood: "Medium",
            mitigation: "Signed citations + review",
          },
          {
            risk: "Copyright claims",
            impact: "High",
            likelihood: "Low",
            mitigation: "Licensed corpora + filters",
          },
          {
            risk: "PII leakage",
            impact: "High",
            likelihood: "Low",
            mitigation: "Redaction + policy",
          },
        ],
      },
    },
    {
      name: "createPositioningMapSlide",
      arguments: {
        xAxis: "Compliance readiness",
        yAxis: "User adoption",
        players: [
          {
            name: "AI Editor (signed)",
            x: 8,
            y: 8,
          },
          {
            name: "Generic chatbot",
            x: 4,
            y: 7,
          },
          {
            name: "Manual research",
            x: 9,
            y: 4,
          },
        ],
      },
    },
    {
      name: "createTamSamSomSlide",
      arguments: {
        tam: 50000000000,
        sam: 12000000000,
        som: 3000000000,
        notes: "Knowledge-heavy enterprises, academia, and media markets.",
      },
    },
    {
      name: "createMarketDriversSlide",
      arguments: {
        title: "Market Growth Drivers",
        drivers: ["Regulatory push for provenance", "Enterprise AI adoption", "Cost pressure to automate reviews"],
      },
    },
    {
      name: "createRevenueModelSlide",
      arguments: {
        streams: ["Seats", "Usage", "Compliance add-on"],
        pricingNotes: "Discounts for academic & nonprofit segments with strict compliance needs.",
      },
    },
    {
      name: "createCostStructureSlide",
      arguments: {
        buckets: ["Compute", "Licenses", "Storage", "Review ops"],
        fixedVsVariable: ["Fixed: platform & storage", "Variable: compute & review time"],
      },
    },
    {
      name: "createOrgChartSlide",
      arguments: {
        nodes: [
          {
            id: "1",
            label: "Head of Knowledge Governance",
            parentId: "",
          },
          {
            id: "2",
            label: "AI Librarian",
            parentId: "1",
          },
          {
            id: "3",
            label: "Compliance Reviewer",
            parentId: "1",
          },
        ],
      },
    },
    {
      name: "createCapabilityMaturitySlide",
      arguments: {
        capabilities: [
          {
            name: "Provenance capture",
            level: 3,
          },
          {
            name: "Signing & verification",
            level: 2,
          },
          {
            name: "Reviewer workflow",
            level: 4,
          },
        ],
      },
    },
    {
      name: "createTechRoadmapSlide",
      arguments: {
        phases: ["MVP", "Scale", "Certify"],
        items: [
          {
            phase: "MVP",
            label: "Governed RAG",
          },
          {
            phase: "Scale",
            label: "Signed citations",
          },
          {
            phase: "Certify",
            label: "External audits",
          },
        ],
      },
    },
    {
      name: "createDigitalMaturitySlide",
      arguments: {
        dimensions: ["Data", "Process", "People", "Tech"],
        levels: [3, 3, 2, 4],
        notes: "Prioritize training and governance backlog.",
      },
    },
    {
      name: "createEcosystemMapSlide",
      arguments: {
        categories: ["Models", "Content", "Tooling", "Auditors"],
        entities: [
          {
            category: "Models",
            name: "General LLMs",
          },
          {
            category: "Content",
            name: "Licensed databases",
          },
          {
            category: "Tooling",
            name: "Signing libraries",
          },
          {
            category: "Auditors",
            name: "External firms",
          },
        ],
      },
    },
    {
      name: "createChangeCurveSlide",
      arguments: {
        stages: ["Awareness", "Understanding", "Adoption", "Advocacy"],
        notes: "Evidence-first culture requires incentives and leadership modeling.",
      },
    },
    {
      name: "createCommunicationPlanSlide",
      arguments: {
        audiences: ["Executives", "Managers", "Contributors"],
        channels: ["Town halls", "Docs add-in tips", "Slack nudges"],
        cadence: "Bi-weekly updates for first two quarters",
      },
    },
    {
      name: "createIntegrationPlanSlide",
      arguments: {
        workstreams: ["Tech", "Policy", "Training", "Ops"],
        milestones: ["MVP live", "Org-wide training", "Audit pilot"],
      },
    },
    {
      name: "createBenchmarkingTableSlide",
      arguments: {
        metrics: ["Accuracy", "Provenance", "Latency", "Cost"],
        competitors: ["Manual", "Generic chatbot", "Signed AI editor"],
      },
    },
    {
      name: "createSurveyResultsSlide",
      arguments: {
        questions: ["Do you trust AI references?", "Is evidence easy to review?"],
        summaries: ["Trust increased post-signing rollout.", "Review time dropped by 35%."],
      },
    },
    {
      name: "createPersonasSlide",
      arguments: {
        personas: [
          {
            name: "Researcher",
            bio: "Synthesizes reports daily",
            needs: ["Accurate citations", "Deep sources"],
          },
          {
            name: "Editor",
            bio: "Approves publications",
            needs: ["Fast verification", "Audit trail"],
          },
        ],
      },
    },
    {
      name: "createSegmentationSlide",
      arguments: {
        segments: ["Academic", "Enterprise", "Media"],
        descriptors: ["Risk tolerance", "Compliance needs", "Speed expectations"],
      },
    },
    {
      name: "createPricingWaterfallSlide",
      arguments: {
        steps: [
          {
            label: "List price",
            value: 100,
          },
          {
            label: "Compliance discount",
            value: -15,
          },
          {
            label: "Volume discount",
            value: -10,
          },
          {
            label: "Final",
            value: 75,
          },
        ],
      },
    },
    {
      name: "createSensitivityAnalysisSlide",
      arguments: {
        variables: ["Corpus coverage", "Reviewer time", "Compute cost"],
        scenarios: ["Best case", "Expected", "Stress"],
      },
    },
    {
      name: "createPLBreakdownSlide",
      arguments: {
        categories: ["Revenue", "COGS", "Opex"],
        values: [20, 8, 6],
      },
    },
    {
      name: "createCashFlowSlide",
      arguments: {
        inflows: [8, 10, 12, 14],
        outflows: [6, 7, 8, 9],
      },
    },
    {
      name: "createBalanceSheetSlide",
      arguments: {
        assets: ["Cash", "Intangibles", "Receivables"],
        liabilities: ["Deferred revenue", "Accounts payable"],
        equity: ["Paid-in capital", "Retained earnings"],
      },
    },
    {
      name: "createShareholderValueTreeSlide",
      arguments: {
        drivers: ["Adoption", "Retention", "Compliance premium"],
      },
    },
    {
      name: "createNpvSummarySlide",
      arguments: {
        npv: 12500000,
        assumptions: ["3-year horizon", "10% discount rate", "Compliance uplift included"],
      },
    },
    {
      name: "createScenarioPlanningSlide",
      arguments: {
        scenarios: ["Tight regulation", "Moderate", "Self-regulation"],
        impacts: ["Higher audit cost", "Balanced investment", "Faster rollout"],
      },
    },
    {
      name: "createComplianceHeatmapSlide",
      arguments: {
        areas: ["Copyright", "Privacy", "Disclosure"],
        levels: ["Green", "Amber", "Red"],
      },
    },
    {
      name: "createEsgFrameworkSlide",
      arguments: {
        environmental: ["Efficient compute", "Green datacenters"],
        social: ["Source credit", "Anti-bias reviews"],
        governance: ["Audit logs", "Policy oversight"],
      },
    },
    {
      name: "createCsrInitiativesSlide",
      arguments: {
        initiatives: ["Open citations to public research", "Academic partnerships"],
      },
    },
    {
      name: "createSustainabilityRoadmapSlide",
      arguments: {
        phases: ["Measure", "Reduce", "Offset"],
        actions: ["Track energy per query", "Optimize inference", "Offset remaining"],
      },
    },
    {
      name: "createCircularEconomyMapSlide",
      arguments: {
        loops: ["Data ingestion", "Use", "Feedback", "Curation"],
      },
    },
    {
      name: "createInnovationFunnelSlide",
      arguments: {
        stages: ["Ideas", "Prototypes", "Pilots", "Scale"],
        counts: [120, 24, 8, 3],
      },
    },
    {
      name: "createProductRoadmapSlide",
      arguments: {
        releases: ["R1", "R2", "R3"],
        items: [
          {
            release: "R1",
            label: "Evidence panel",
          },
          {
            release: "R2",
            label: "Signed citations",
          },
          {
            release: "R3",
            label: "Reviewer automation",
          },
        ],
      },
    },
    {
      name: "createLaunchPlanSlide",
      arguments: {
        workstreams: ["Marketing", "Sales", "Success"],
        milestones: ["Beta cohort", "GA", "Case studies"],
        risks: ["Overpromise", "Adoption lag", "Change resistance"],
      },
    },
    {
      name: "createPipelineFunnelSlide",
      arguments: {
        stages: ["Leads", "Qualified", "Trials", "Paid"],
        values: [400, 220, 120, 60],
      },
    },
    {
      name: "createSalesDashboardSlide",
      arguments: {
        metrics: ["Win rate 32%", "Cycle time 48d", "Avg deal $85k"],
        notes: "Education on value of signed references shortens cycles.",
      },
    },
    {
      name: "createMarketingMixSlide",
      arguments: {
        levers: ["Content marketing", "Compliance webinars", "Partner co-sell", "Analyst briefings"],
        notes: "Lead with risk reduction and measurable trust.",
      },
    },
    {
      name: "createCustomerSuccessJourneySlide",
      arguments: {
        stages: ["Onboard", "Adopt", "Expand", "Renew"],
        metrics: ["Time-to-value", "Feature usage", "CSAT", "Renewal rate"],
      },
    },
    {
      name: "createSupportOrgModelSlide",
      arguments: {
        tiers: ["Tier 1", "Tier 2", "Tier 3"],
        roles: ["Agent", "Specialist", "Engineer"],
      },
    },
    {
      name: "createPartnershipMapSlide",
      arguments: {
        categories: ["Licensing", "Technology", "Audit"],
        partners: [
          {
            name: "Content provider A",
            category: "Licensing",
          },
          {
            name: "Signing toolkit B",
            category: "Technology",
          },
          {
            name: "Audit firm C",
            category: "Audit",
          },
        ],
      },
    },
    {
      name: "createMAPipelineSlide",
      arguments: {
        stages: ["Identify", "Evaluate", "Negotiate", "Integrate"],
        targets: ["Evidence startup X", "Audit SaaS Y"],
      },
    },
    {
      name: "createSynergyCaptureSlide",
      arguments: {
        sources: ["Cross-sell", "Shared infra", "Joint R&D"],
        values: [4.0, 1.5, 2.0],
      },
    },
    {
      name: "createCultureValuesSlide",
      arguments: {
        values: ["Truth", "Transparency", "Accountability"],
        behaviors: ["Cite sources", "Log context", "Flag uncertainty"],
      },
    },
    {
      name: "createThankYouContactSlide",
      arguments: {
        message: "Thank you!",
        name: "AI Referencing Taskforce",
        email: "references@company.example",
        url: "https://example.com/ai-references",
        qrImageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com/ai-references",
      },
    },
  ],
};
