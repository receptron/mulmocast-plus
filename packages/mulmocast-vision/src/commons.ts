// utils for browser and node.
import { type OpenAITool } from "./type.js";

export const functionNameToTemplateName = (functionName: string) => {
  const tmpName = functionName.replace(/^create/, "");
  const fileName = tmpName.charAt(0).toLowerCase() + tmpName.slice(1);
  return fileName;
};

export const templateNameTofunctionName = (templateName: string) => {
  return "create" + templateName.charAt(0).toUpperCase() + templateName.slice(1);
};

export const toolsToTemplateNames = (tools: OpenAITool[]) => {
  return tools.map((tool) => {
    return functionNameToTemplateName(tool.function.name);
  });
};

export const openAIToolsToAnthropicTools = (tools: OpenAITool[]) => {
  return {
    tools: tools.map((tool) => {
      const { name, description, parameters } = tool.function;
      return { name, description, inputSchema: parameters };
    }),
  };
};

export const convertTools = (tools: OpenAITool[]) => {
  return tools.map((tool: OpenAITool) => {
    const { name, description, parameters } = tool.function;

    const { type, properties, required } = parameters;
    const newProperties = {
      ...properties,
      talkTrack: {
        type: "string",
        description: "What the presenter will say for this slide (1–3 sentences).",
      },
    };

    return {
      type: "function",
      function: {
        name: "mulmoVisionAgent--" + name,
        description,
        parameters: {
          type,
          properties: newProperties,
          required,
        },
      },
    };
  });
};

export const generateUniqueId = (): string => {
  const now = Date.now();
  const random = Math.random().toString(36).slice(-10);
  return `${now}-${random}`;
};

export const formattedDate = () => {
  const now = new Date();

  const formatted = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("-");
  return formatted;
};
