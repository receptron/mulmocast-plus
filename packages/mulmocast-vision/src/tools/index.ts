import { OpenAITool } from "../type.js";
import { toolsBase } from "./tools_base.js";
export * from "./tools_base.js";

export const tools = toolsBase.map((tool: OpenAITool) => {
  const { type, function: func } = tool;
  const { name, description, parameters } = func;
  return {
    type,
    function: {
      name: `create${name}Slide`,
      description: `Create or update ${description}`,
      parameters,
    },
  };
});

export const toolsForBeat = toolsBase.map((tool: OpenAITool) => {
  const { type, function: func } = tool;
  const { name, description, parameters } = func;
  return {
    type,
    function: {
      name: `updateBeatStyleTo${name}`,
      description: `Change the beat image to ${description}`,
      parameters,
    },
  };
});

// updateBeatImageForXXStyle
// Change the beat image to

export const mcp_tools: OpenAITool[] = [
  {
    type: "function",
    function: {
      name: "setDirectory",
      description:
        "Specify a directory for each session and output the content to that directory. Call it once before creating a slide, and again when creating the next new slide.",
      parameters: {
        type: "object",
        properties: {
          directoryName: { type: "string", description: "Directory name" },
        },
        required: ["directoryName"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "createPDF",
      description: "combine images to create a PDF.",
      parameters: {
        type: "object",
        properties: {
          filename: { type: "string", description: "a file name including the .pdf extension" },
          images: {
            type: "array",
            description:
              "Optional. If provided, combine exactly these image file name in the given order. those image file name should be the basename (including the .pdf extension) without any directory path, corresponding to the slides that were created. If omitted, images will be discovered in dir, sorted by filename ascending, and combined.",
            items: { type: "string" },
          },
        },
        required: ["filename"],
      },
    },
  },
];
