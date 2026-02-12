export type ToolParametersSchema = {
  type: string;
  required: string[];
  properties: Record<string, unknown>;
};

export type ToolFunction = {
  name: string;
  description: string;
  parameters: ToolParametersSchema;
};

export type OpenAITool = {
  type: "function";
  function: ToolFunction;
};

export type PluginOptionParams = {
  functionName?: string; // functionName tools called
  outputFileName?: number | string; // output png html file name. A file with this name will be written to outputDir.
  imageFilePath?: string; // The full path to the output image, including the dir and extent. This setting causes outputFileName to be ignored.
  htmlFilePath?: string; // The full path to the output html, including the dir and extent. This setting causes outputFileName to be ignored.
};

export type ToolArgs = Record<string, unknown>;

export type CreatePageOptions = { htmlTemplateFile?: string; headerStyle?: string; htmlFile?: string };
