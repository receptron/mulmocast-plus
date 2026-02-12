import { OpenAITool } from "../type.js";

const indexDescription = "If 0 <= _index < slides.length, update that position. Omit or -1/out-of-range to append to the end (default -1).";

export const toolsBase: OpenAITool[] = [
  // 01 Section divider
  {
    type: "function",
    function: {
      name: "SectionDivider",
      description:
        "a new slide in the presentation that serves as a section divider. This slide must include both a large main heading and a subtitle. Use this when the user wants to create a single slide that clearly introduces or separates a new section in their presentation.",
      parameters: {
        type: "object",
        properties: {
          heading: { type: "string", description: "Main section title, shown prominently on the slide" },
          subheading: { type: "string", description: "Subtitle that provides context or explanation for the section" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["heading", "subheading"],
      },
    },
  },

  // 02 Agenda
  {
    type: "function",
    function: {
      name: "Agenda",
      description:
        "one slide in the presentation that shows the agenda. This slide lists the main topics as bullet points under a clear title, giving the audience an overview of what will be covered.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Heading shown at the top of the agenda slide" },
          items: { type: "array", items: { type: "string" }, minItems: 1, description: "Agenda bullet points" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["title", "items"],
      },
    },
  },

  // 03 Executive summary
  {
    type: "function",
    function: {
      name: "ExecutiveSummary",
      description:
        "one slide in the presentation that provides an executive summary. This slide should include a clear title and 3–7 concise bullet points highlighting the key takeaways.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Slide title for the executive summary" },
          bullets: {
            type: "array",
            items: { type: "string" },
            minItems: 3,
            maxItems: 7,
            description: "Key takeaway points to summarize",
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["title", "bullets"],
      },
    },
  },

  // 04 Key message + supports
  {
    type: "function",
    function: {
      name: "KeyMessageWithSupports",
      description:
        "one slide in the presentation that emphasizes a single key message. The headline should state the main message, supported by at least two bullet points.",
      parameters: {
        type: "object",
        properties: {
          headline: { type: "string", description: "Main key message shown as the headline" },
          supports: { type: "array", items: { type: "string" }, minItems: 2, description: "Supporting points or evidence" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["headline", "supports"],
      },
    },
  },

  // 05 Hypothesis
  {
    type: "function",
    function: {
      name: "Hypothesis",
      description:
        "one slide in the presentation that presents a hypothesis. This slide states the hypothesis clearly and may also outline implications and suggested next steps.",
      parameters: {
        type: "object",
        properties: {
          hypothesis: { type: "string", description: "The main hypothesis statement" },
          implications: { type: "array", items: { type: "string" }, description: "Possible implications if the hypothesis is true" },
          nextSteps: { type: "array", items: { type: "string" }, description: "Recommended next actions" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["hypothesis"],
      },
    },
  },

  // 06 Issue tree
  {
    type: "function",
    function: {
      name: "IssueTree",
      description:
        "one slide in the presentation that visualizes an issue tree. This slide shows the root issue at the top and branches into MECE sub-issues to structure the problem.",
      parameters: {
        type: "object",
        properties: {
          rootIssue: { type: "string", description: "Main issue or problem statement" },
          branches: {
            type: "array",
            items: { type: "array", items: { type: "string" } },
            minItems: 2,
            description: "Sub-issues or branches grouped under the root issue",
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["rootIssue", "branches"],
      },
    },
  },

  // 07 Driver tree
  {
    type: "function",
    function: {
      name: "DriverTree",
      description:
        "one slide in the presentation that visualizes a driver tree. This slide shows a key business metric at the top and the drivers that influence it branching below.",
      parameters: {
        type: "object",
        properties: {
          metric: { type: "string", description: "The main business metric being analyzed" },
          drivers: {
            type: "array",
            items: { type: "array", items: { type: "string" } },
            minItems: 1,
            description: "Driver branches that affect the main metric",
            _index: { type: "integer", description: indexDescription },
          },
        },
        required: ["metric", "drivers"],
      },
    },
  },

  // 08 MECE list
  {
    type: "function",
    function: {
      name: "MeceList",
      description:
        "one slide in the presentation that organizes items into MECE (Mutually Exclusive, Collectively Exhaustive) groups. Each group has a label and its own bullet list.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the MECE slide" },
          groups: {
            type: "array",
            minItems: 2,
            items: {
              type: "object",
              properties: {
                label: { type: "string", description: "Group label" },
                items: {
                  type: "array",
                  items: { type: "string" },
                  minItems: 1,
                  description: "Bullet points within this group",
                },
              },
              required: ["label", "items"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["title", "groups"],
      },
    },
  },

  // 09 Pyramid principle
  {
    type: "function",
    function: {
      name: "PyramidPrinciple",
      description:
        "one slide in the presentation that follows the pyramid principle. The slide starts with the key message, followed by supporting reasons, and optional detailed breakdowns.",
      parameters: {
        type: "object",
        properties: {
          keyMessage: { type: "string", description: "Top-level conclusion or main message" },
          supports: { type: "array", items: { type: "string" }, minItems: 2, description: "Supporting reasons for the key message" },
          details: {
            type: "array",
            items: { type: "array", items: { type: "string" } },
            description: "Optional deeper details for each supporting reason",
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["keyMessage", "supports"],
      },
    },
  },

  // 10 SCQA
  {
    type: "function",
    function: {
      name: "Scqa",
      description: "one slide in the presentation that explains a storyline using the SCQA framework: Situation, Complication, Question, and Answer.",
      parameters: {
        type: "object",
        properties: {
          situation: { type: "string", description: "The initial situation or context" },
          complication: { type: "string", description: "The complication or challenge" },
          question: { type: "string", description: "The key question that arises" },
          answer: { type: "string", description: "The answer or proposed resolution" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["situation", "complication", "question", "answer"],
      },
    },
  },

  // 11 SWOT
  {
    type: "function",
    function: {
      name: "Swot",
      description: "a SWOT matrix.",
      parameters: {
        type: "object",
        properties: {
          strengths: { type: "array", items: { type: "string" } },
          weaknesses: { type: "array", items: { type: "string" } },
          opportunities: { type: "array", items: { type: "string" } },
          threats: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["strengths", "weaknesses", "opportunities", "threats"],
      },
    },
  },

  // 12 3C
  {
    type: "function",
    function: {
      name: "ThreeC",
      description: "a 3C (Company, Customer, Competitor) slide.",
      parameters: {
        type: "object",
        properties: {
          company: { type: "array", items: { type: "string" } },
          customer: { type: "array", items: { type: "string" } },
          competitor: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["company", "customer", "competitor"],
      },
    },
  },

  // 13 4P
  {
    type: "function",
    function: {
      name: "FourP",
      description: "a marketing 4P slide.",
      parameters: {
        type: "object",
        properties: {
          product: { type: "array", items: { type: "string" } },
          price: { type: "array", items: { type: "string" } },
          place: { type: "array", items: { type: "string" } },
          promotion: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["product", "price", "place", "promotion"],
      },
    },
  },

  // 14 7S
  {
    type: "function",
    function: {
      name: "SevenS",
      description: "a McKinsey 7S slide.",
      parameters: {
        type: "object",
        properties: {
          strategy: { type: "string" },
          structure: { type: "string" },
          systems: { type: "string" },
          sharedValues: { type: "string" },
          skills: { type: "string" },
          style: { type: "string" },
          staff: { type: "string" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["strategy", "structure", "systems", "sharedValues", "skills", "style", "staff"],
      },
    },
  },

  // 15 Value chain
  {
    type: "function",
    function: {
      name: "ValueChain",
      description: "a value chain with primary and support activities.",
      parameters: {
        type: "object",
        properties: {
          primary: { type: "array", items: { type: "string" }, minItems: 3 },
          support: { type: "array", items: { type: "string" }, minItems: 3 },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["primary", "support"],
      },
    },
  },

  // 16 Five forces
  {
    type: "function",
    function: {
      name: "PorterFiveForces",
      description: "a Porter’s Five Forces slide.",
      parameters: {
        type: "object",
        properties: {
          newEntrants: { type: "array", items: { type: "string" } },
          suppliers: { type: "array", items: { type: "string" } },
          buyers: { type: "array", items: { type: "string" } },
          substitutes: { type: "array", items: { type: "string" } },
          rivalry: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["newEntrants", "suppliers", "buyers", "substitutes", "rivalry"],
      },
    },
  },

  // 17 Business model canvas
  {
    type: "function",
    function: {
      name: "BusinessModelCanvas",
      description: "a Business Model Canvas (9 blocks).",
      parameters: {
        type: "object",
        properties: {
          blocks: {
            type: "object",
            additionalProperties: { type: "array", items: { type: "string" } },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["blocks"],
      },
    },
  },

  // 18 Customer journey
  {
    type: "function",
    function: {
      name: "CustomerJourney",
      description: "a customer journey with stages and touchpoints.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 3 },
          touchpoints: {
            type: "array",
            items: { type: "array", items: { type: "string" } },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["stages"],
      },
    },
  },

  // 19 Stakeholder map
  {
    type: "function",
    function: {
      name: "StakeholderMap",
      description: "a stakeholder influence-interest map.",
      parameters: {
        type: "object",
        properties: {
          stakeholders: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                influence: { type: "number" },
                interest: { type: "number" },
                notes: { type: "string" },
              },
              required: ["name", "influence", "interest"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["stakeholders"],
      },
    },
  },

  // 20 RACI
  {
    type: "function",
    function: {
      name: "Raci",
      description: "a RACI matrix.",
      parameters: {
        type: "object",
        properties: {
          tasks: { type: "array", items: { type: "string" }, minItems: 1 },
          roles: { type: "array", items: { type: "string" }, minItems: 1 },
          assignments: {
            type: "array",
            items: { type: "array", items: { type: "string" } },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["tasks", "roles"],
      },
    },
  },

  // 21 OKR/KPI dashboard
  {
    type: "function",
    function: {
      name: "OkrKpiDashboard",
      description: "an OKR/KPI dashboard with tiles.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          metrics: {
            type: "array",
            minItems: 3,
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "string" },
                target: { type: "string" },
                status: { type: "string" },
              },
              required: ["label", "value"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["metrics"],
      },
    },
  },

  // 22 Balanced scorecard
  {
    type: "function",
    function: {
      name: "BalancedScorecard",
      description: "a balanced scorecard slide.",
      parameters: {
        type: "object",
        properties: {
          perspectives: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                items: { type: "array", items: { type: "string" } },
              },
              required: ["name", "items"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["perspectives"],
      },
    },
  },

  // 23 Quarterly roadmap
  {
    type: "function",
    function: {
      name: "QuarterlyRoadmap",
      description: "a quarterly roadmap.",
      parameters: {
        type: "object",
        properties: {
          quarters: { type: "array", items: { type: "string" }, minItems: 2 },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                quarter: { type: "string" },
                label: { type: "string" },
              },
              required: ["quarter", "label"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["quarters", "items"],
      },
    },
  },

  // 24 Milestone timeline
  {
    type: "function",
    function: {
      name: "MilestoneTimeline",
      description: "a milestone timeline.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          milestones: {
            type: "array",
            minItems: 2,
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                date: { type: "string" },
                notes: { type: "string" },
              },
              required: ["label"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["milestones"],
      },
    },
  },

  // 25 Gantt (simple)
  {
    type: "function",
    function: {
      name: "GanttSimple",
      description: "a simple Gantt placeholder.",
      parameters: {
        type: "object",
        properties: {
          tasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                start: { type: "string" },
                end: { type: "string" },
              },
              required: ["name", "start", "end"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["tasks"],
      },
    },
  },

  // 26 Waterfall (numeric decomposition)
  {
    type: "function",
    function: {
      name: "Waterfall",
      description: "a numeric waterfall steps placeholder.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "number" },
              },
              required: ["label", "value"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["steps"],
      },
    },
  },

  // 27 Funnel
  {
    type: "function",
    function: {
      name: "Funnel",
      description: "a funnel stages placeholder.",
      parameters: {
        type: "object",
        properties: {
          stages: {
            type: "array",
            minItems: 3,
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "number" },
              },
              required: ["label", "value"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["stages"],
      },
    },
  },

  // 28 2x2 matrix
  {
    type: "function",
    function: {
      name: "TwoByTwoMatrix",
      description: "a 2x2 matrix with quadrant items.",
      parameters: {
        type: "object",
        properties: {
          xAxis: { type: "string" },
          yAxis: { type: "string" },
          quadrants: {
            type: "array",
            minItems: 4,
            maxItems: 4,
            items: { type: "array", items: { type: "string" } },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["xAxis", "yAxis", "quadrants"],
      },
    },
  },

  // 29 BCG matrix
  {
    type: "function",
    function: {
      name: "BcgMatrix",
      description: "a BCG matrix placeholder.",
      parameters: {
        type: "object",
        properties: {
          stars: { type: "array", items: { type: "string" } },
          cashCows: { type: "array", items: { type: "string" } },
          questionMarks: { type: "array", items: { type: "string" } },
          dogs: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["stars", "cashCows", "questionMarks", "dogs"],
      },
    },
  },

  // 30 GE-McKinsey matrix
  {
    type: "function",
    function: {
      name: "GeMcKinseyMatrix",
      description: "a GE-McKinsey 3x3 matrix placeholder.",
      parameters: {
        type: "object",
        properties: {
          industryAttractiveness: { type: "array", items: { type: "string" } },
          competitiveStrength: { type: "array", items: { type: "string" } },
          placements: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                row: { type: "number" },
                col: { type: "number" },
              },
              required: ["name", "row", "col"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["placements"],
      },
    },
  },

  // 31 Marimekko (placeholder)
  {
    type: "function",
    function: {
      name: "MarimekkoPlaceholder",
      description: "a Marimekko chart placeholder.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          categories: { type: "array", items: { type: "string" }, minItems: 2 },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["categories"],
      },
    },
  },

  // 32 Bubble chart (placeholder)
  {
    type: "function",
    function: {
      name: "BubbleChartPlaceholder",
      description: "a bubble chart placeholder.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          points: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                x: { type: "number" },
                y: { type: "number" },
                r: { type: "number" },
              },
              required: ["label", "x", "y", "r"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["points"],
      },
    },
  },

  // 33 Heatmap (placeholder)
  {
    type: "function",
    function: {
      name: "HeatmapPlaceholder",
      description: "a heatmap placeholder.",
      parameters: {
        type: "object",
        properties: {
          rows: { type: "array", items: { type: "string" }, minItems: 1 },
          cols: { type: "array", items: { type: "string" }, minItems: 1 },
          values: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["rows", "cols", "values"],
      },
    },
  },

  // 34 KPI highlight
  {
    type: "function",
    function: {
      name: "KpiHighlight",
      description: "a slide highlighting key KPIs.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          kpis: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "string" },
                delta: { type: "string" },
              },
              required: ["label", "value"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["kpis"],
      },
    },
  },

  // 35 Before/After
  {
    type: "function",
    function: {
      name: "BeforeAfter",
      description: "a before vs after comparison slide.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          before: { type: "array", items: { type: "string" }, minItems: 1 },
          after: { type: "array", items: { type: "string" }, minItems: 1 },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["before", "after"],
      },
    },
  },

  // 36 Option evaluation (criteria x options)
  {
    type: "function",
    function: {
      name: "OptionEvaluation",
      description: "an options vs criteria evaluation matrix.",
      parameters: {
        type: "object",
        properties: {
          criteria: { type: "array", items: { type: "string" }, minItems: 3 },
          options: { type: "array", items: { type: "string" }, minItems: 2 },
          scores: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["criteria", "options"],
      },
    },
  },

  // 37 Risk & mitigation
  {
    type: "function",
    function: {
      name: "RiskMitigation",
      description: "a risk register with mitigations.",
      parameters: {
        type: "object",
        properties: {
          risks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                risk: { type: "string" },
                impact: { type: "string" },
                likelihood: { type: "string" },
                mitigation: { type: "string" },
              },
              required: ["risk"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["risks"],
      },
    },
  },

  // 38 Positioning map
  {
    type: "function",
    function: {
      name: "PositioningMap",
      description: "a competitive positioning map.",
      parameters: {
        type: "object",
        properties: {
          xAxis: { type: "string" },
          yAxis: { type: "string" },
          players: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                x: { type: "number" },
                y: { type: "number" },
              },
              required: ["name", "x", "y"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["xAxis", "yAxis", "players"],
      },
    },
  },

  // 39 TAM/SAM/SOM
  {
    type: "function",
    function: {
      name: "TamSamSom",
      description: "a market size (TAM/SAM/SOM) slide.",
      parameters: {
        type: "object",
        properties: {
          tam: { type: "number" },
          sam: { type: "number" },
          som: { type: "number" },
          notes: { type: "string" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["tam", "sam", "som"],
      },
    },
  },

  // 40 Market drivers
  {
    type: "function",
    function: {
      name: "MarketDrivers",
      description: "a list of market growth drivers.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          drivers: { type: "array", items: { type: "string" }, minItems: 1 },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["drivers"],
      },
    },
  },

  // 41 Revenue model
  {
    type: "function",
    function: {
      name: "RevenueModel",
      description: "revenue streams and pricing notes.",
      parameters: {
        type: "object",
        properties: {
          streams: { type: "array", items: { type: "string" }, minItems: 1 },
          pricingNotes: { type: "string" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["streams"],
      },
    },
  },

  // 42 Cost structure
  {
    type: "function",
    function: {
      name: "CostStructure",
      description: "a cost structure with buckets and notes.",
      parameters: {
        type: "object",
        properties: {
          buckets: { type: "array", items: { type: "string" }, minItems: 1 },
          fixedVsVariable: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["buckets"],
      },
    },
  },

  // 43 Org chart
  {
    type: "function",
    function: {
      name: "OrgChart",
      description: "a simple org chart placeholder.",
      parameters: {
        type: "object",
        properties: {
          nodes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                label: { type: "string" },
                parentId: { type: "string" },
              },
              required: ["id", "label"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["nodes"],
      },
    },
  },

  // 44 Capability maturity
  {
    type: "function",
    function: {
      name: "CapabilityMaturity",
      description: "a capability maturity model (1–5).",
      parameters: {
        type: "object",
        properties: {
          capabilities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                level: { type: "number" },
              },
              required: ["name", "level"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["capabilities"],
      },
    },
  },

  // 45 Technology roadmap
  {
    type: "function",
    function: {
      name: "TechRoadmap",
      description: "a technology roadmap with phases.",
      parameters: {
        type: "object",
        properties: {
          phases: { type: "array", items: { type: "string" }, minItems: 2 },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                phase: { type: "string" },
                label: { type: "string" },
              },
              required: ["phase", "label"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["phases"],
      },
    },
  },

  // 46 Digital maturity
  {
    type: "function",
    function: {
      name: "DigitalMaturity",
      description: "a digital maturity assessment.",
      parameters: {
        type: "object",
        properties: {
          dimensions: { type: "array", items: { type: "string" } },
          levels: { type: "array", items: { type: "number" } },
          notes: { type: "string" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["dimensions"],
      },
    },
  },

  // 47 Ecosystem map
  {
    type: "function",
    function: {
      name: "EcosystemMap",
      description: "an ecosystem or partner map.",
      parameters: {
        type: "object",
        properties: {
          categories: { type: "array", items: { type: "string" } },
          entities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: { type: "string" },
                name: { type: "string" },
              },
              required: ["category", "name"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["entities"],
      },
    },
  },

  // 48 Change curve
  {
    type: "function",
    function: {
      name: "ChangeCurve",
      description: "a change curve with stages.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 4 },
          notes: { type: "string" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["stages"],
      },
    },
  },

  // 49 Communication plan
  {
    type: "function",
    function: {
      name: "CommunicationPlan",
      description: "a communication plan matrix.",
      parameters: {
        type: "object",
        properties: {
          audiences: { type: "array", items: { type: "string" } },
          channels: { type: "array", items: { type: "string" } },
          cadence: { type: "string" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["audiences", "channels"],
      },
    },
  },

  // 50 Integration plan (PMI)
  {
    type: "function",
    function: {
      name: "IntegrationPlan",
      description: "a post-merger integration (PMI) plan placeholder.",
      parameters: {
        type: "object",
        properties: {
          workstreams: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
          },
          milestones: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["workstreams"],
      },
    },
  },

  // 51 Benchmarking table
  {
    type: "function",
    function: {
      name: "BenchmarkingTable",
      description: "a benchmarking comparison table.",
      parameters: {
        type: "object",
        properties: {
          metrics: { type: "array", items: { type: "string" }, minItems: 1 },
          competitors: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["metrics", "competitors"],
      },
    },
  },

  // 52 Survey results
  {
    type: "function",
    function: {
      name: "SurveyResults",
      description: "a survey results summary.",
      parameters: {
        type: "object",
        properties: {
          questions: { type: "array", items: { type: "string" } },
          summaries: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["questions"],
      },
    },
  },

  // 53 Personas
  {
    type: "function",
    function: {
      name: "Personas",
      description: "customer persona cards.",
      parameters: {
        type: "object",
        properties: {
          personas: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                bio: { type: "string" },
                needs: { type: "array", items: { type: "string" } },
              },
              required: ["name"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["personas"],
      },
    },
  },

  // 54 Segmentation
  {
    type: "function",
    function: {
      name: "Segmentation",
      description: "a customer segmentation slide.",
      parameters: {
        type: "object",
        properties: {
          segments: { type: "array", items: { type: "string" }, minItems: 2 },
          descriptors: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["segments"],
      },
    },
  },

  // 55 Pricing waterfall
  {
    type: "function",
    function: {
      name: "PricingWaterfall",
      description: "a pricing waterfall placeholder.",
      parameters: {
        type: "object",
        properties: {
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "number" },
              },
              required: ["label", "value"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["steps"],
      },
    },
  },

  // 56 Sensitivity analysis
  {
    type: "function",
    function: {
      name: "SensitivityAnalysis",
      description: "a sensitivity analysis placeholder.",
      parameters: {
        type: "object",
        properties: {
          variables: { type: "array", items: { type: "string" }, minItems: 2 },
          scenarios: { type: "array", items: { type: "string" }, minItems: 2 },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["variables", "scenarios"],
      },
    },
  },

  // 57 P&L breakdown
  {
    type: "function",
    function: {
      name: "PLBreakdown",
      description: "a P&L breakdown placeholder.",
      parameters: {
        type: "object",
        properties: {
          categories: { type: "array", items: { type: "string" }, minItems: 3 },
          values: { type: "array", items: { type: "number" }, minItems: 3 },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["categories", "values"],
      },
    },
  },

  // 58 Cash flow
  {
    type: "function",
    function: {
      name: "CashFlow",
      description: "a cash flow summary placeholder.",
      parameters: {
        type: "object",
        properties: {
          inflows: { type: "array", items: { type: "number" } },
          outflows: { type: "array", items: { type: "number" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["inflows", "outflows"],
      },
    },
  },

  // 59 Balance sheet
  {
    type: "function",
    function: {
      name: "BalanceSheet",
      description: "a balance sheet summary placeholder.",
      parameters: {
        type: "object",
        properties: {
          assets: { type: "array", items: { type: "string" } },
          liabilities: { type: "array", items: { type: "string" } },
          equity: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["assets", "liabilities", "equity"],
      },
    },
  },

  // 60 Shareholder value tree
  {
    type: "function",
    function: {
      name: "ShareholderValueTree",
      description: "a shareholder value driver tree.",
      parameters: {
        type: "object",
        properties: {
          drivers: { type: "array", items: { type: "string" }, minItems: 3 },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["drivers"],
      },
    },
  },

  // 61 NPV summary
  {
    type: "function",
    function: {
      name: "NpvSummary",
      description: "an NPV summary placeholder.",
      parameters: {
        type: "object",
        properties: {
          npv: { type: "number" },
          assumptions: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["npv"],
      },
    },
  },

  // 62 Scenario planning
  {
    type: "function",
    function: {
      name: "ScenarioPlanning",
      description: "a scenario planning slide.",
      parameters: {
        type: "object",
        properties: {
          scenarios: { type: "array", items: { type: "string" }, minItems: 2 },
          impacts: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["scenarios"],
      },
    },
  },

  // 63 Compliance heatmap
  {
    type: "function",
    function: {
      name: "ComplianceHeatmap",
      description: "a compliance heatmap placeholder.",
      parameters: {
        type: "object",
        properties: {
          areas: { type: "array", items: { type: "string" } },
          levels: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["areas"],
      },
    },
  },

  // 64 ESG framework
  {
    type: "function",
    function: {
      name: "EsgFramework",
      description: "an ESG framework summary.",
      parameters: {
        type: "object",
        properties: {
          environmental: { type: "array", items: { type: "string" } },
          social: { type: "array", items: { type: "string" } },
          governance: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["environmental", "social", "governance"],
      },
    },
  },

  // 65 CSR initiatives
  {
    type: "function",
    function: {
      name: "CsrInitiatives",
      description: "a CSR initiatives slide.",
      parameters: {
        type: "object",
        properties: {
          initiatives: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["initiatives"],
      },
    },
  },

  // 66 Sustainability roadmap
  {
    type: "function",
    function: {
      name: "SustainabilityRoadmap",
      description: "a sustainability roadmap.",
      parameters: {
        type: "object",
        properties: {
          phases: { type: "array", items: { type: "string" }, minItems: 2 },
          actions: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["phases"],
      },
    },
  },

  // 67 Circular economy map
  {
    type: "function",
    function: {
      name: "CircularEconomyMap",
      description: "a circular economy loop map placeholder.",
      parameters: {
        type: "object",
        properties: {
          loops: { type: "array", items: { type: "string" }, minItems: 3 },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["loops"],
      },
    },
  },

  // 68 Innovation funnel
  {
    type: "function",
    function: {
      name: "InnovationFunnel",
      description: "an innovation funnel placeholder.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 3 },
          counts: { type: "array", items: { type: "number" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["stages"],
      },
    },
  },

  // 69 Product roadmap
  {
    type: "function",
    function: {
      name: "ProductRoadmap",
      description: "a product roadmap.",
      parameters: {
        type: "object",
        properties: {
          releases: { type: "array", items: { type: "string" }, minItems: 2 },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                release: { type: "string" },
                label: { type: "string" },
              },
              required: ["release", "label"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["releases"],
      },
    },
  },

  // 70 Launch plan
  {
    type: "function",
    function: {
      name: "LaunchPlan",
      description: "a go-to-market launch plan.",
      parameters: {
        type: "object",
        properties: {
          workstreams: { type: "array", items: { type: "string" } },
          milestones: { type: "array", items: { type: "string" } },
          risks: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["workstreams"],
      },
    },
  },

  // 71 Pipeline funnel
  {
    type: "function",
    function: {
      name: "PipelineFunnel",
      description: "a pipeline funnel placeholder.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 3 },
          values: { type: "array", items: { type: "number" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["stages"],
      },
    },
  },

  // 72 Sales dashboard
  {
    type: "function",
    function: {
      name: "SalesDashboard",
      description: "a sales dashboard placeholder.",
      parameters: {
        type: "object",
        properties: {
          metrics: { type: "array", items: { type: "string" }, minItems: 3 },
          notes: { type: "string" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["metrics"],
      },
    },
  },

  // 73 Marketing mix
  {
    type: "function",
    function: {
      name: "MarketingMix",
      description: "a marketing mix summary.",
      parameters: {
        type: "object",
        properties: {
          levers: { type: "array", items: { type: "string" }, minItems: 4 },
          notes: { type: "string" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["levers"],
      },
    },
  },

  // 74 Customer success journey
  {
    type: "function",
    function: {
      name: "CustomerSuccessJourney",
      description: "a customer success journey map.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 3 },
          metrics: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["stages"],
      },
    },
  },

  // 75 Support org model
  {
    type: "function",
    function: {
      name: "SupportOrgModel",
      description: "a support organization model placeholder.",
      parameters: {
        type: "object",
        properties: {
          tiers: { type: "array", items: { type: "string" }, minItems: 2 },
          roles: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["tiers"],
      },
    },
  },

  // 76 Partnership map
  {
    type: "function",
    function: {
      name: "PartnershipMap",
      description: "a partnership ecosystem map.",
      parameters: {
        type: "object",
        properties: {
          categories: { type: "array", items: { type: "string" } },
          partners: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                category: { type: "string" },
              },
              required: ["name"],
            },
          },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["partners"],
      },
    },
  },

  // 77 M&A pipeline
  {
    type: "function",
    function: {
      name: "MAPipeline",
      description: "an M&A pipeline placeholder.",
      parameters: {
        type: "object",
        properties: {
          stages: { type: "array", items: { type: "string" }, minItems: 3 },
          targets: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["stages"],
      },
    },
  },

  // 78 Synergy capture
  {
    type: "function",
    function: {
      name: "SynergyCapture",
      description: "a synergy capture plan placeholder.",
      parameters: {
        type: "object",
        properties: {
          sources: { type: "array", items: { type: "string" } },
          values: { type: "array", items: { type: "number" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["sources"],
      },
    },
  },

  // 79 Culture values
  {
    type: "function",
    function: {
      name: "CultureValues",
      description: "a culture and values slide.",
      parameters: {
        type: "object",
        properties: {
          values: { type: "array", items: { type: "string" }, minItems: 3 },
          behaviors: { type: "array", items: { type: "string" } },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["values"],
      },
    },
  },

  // 80 Thank-you / Contact
  {
    type: "function",
    function: {
      name: "ThankYouContact",
      description: "a closing slide with a thank-you message and contacts.",
      parameters: {
        type: "object",
        properties: {
          message: { type: "string", default: "Thank you!" },
          name: { type: "string" },
          email: { type: "string" },
          url: { type: "string" },
          qrImageUrl: { type: "string" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["message"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "image",
      description: "a closing slide with a thank-you message and contacts.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          imageUrl: { type: "string" },
          _index: { type: "integer", description: indexDescription },
        },
        required: ["imageUrl"],
      },
    },
  },
];
