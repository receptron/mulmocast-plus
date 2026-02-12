#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, CallToolRequest, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { tools, mcp_tools } from "./tools/index.js";
import { htmlPlugin } from "./html_class.js";
import { openAIToolsToAnthropicTools, generateUniqueId } from "./commons.js";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { getRootDir, getOutDir } from "./utils.js";
import { getLogger } from "./logger.js";

export const getServer = (handler: htmlPlugin) => {
  const logger = getLogger();
  const server = new Server(
    {
      name: "mulmocast-vision",
      version: "1.0.2",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  logger.info("MCP Server initialized", { name: "mulmocast-vision", version: "1.0.2" });

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.debug("List tools requested");
    return openAIToolsToAnthropicTools([...tools, ...mcp_tools]);
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;
    logger.toolCall(name, args);
    console.error([...tools, ...mcp_tools]);
    try {
      if (args) {
        const fileName = generateUniqueId();
        const result = await handler.callNamedFunction(name, args, { outputFileName: fileName });
        logger.toolResult(name, true, result);
        return {
          content: [
            {
              type: "text",
              text: result?.text ?? "success",
            },
          ],
        };
      }
      throw new Error(`No args: ${name}.`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.toolResult(name, false, { error: errorMessage });
      logger.error(`Tool call failed: ${name}`, error, { toolName: name, args });
      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });
  return server;
};

const main = async () => {
  const logger = getLogger();
  try {
    logger.info("Starting MCP server");
    const rootDir = getRootDir();
    const outputDir = getOutDir();
    const htmlDir = "html2";
    logger.info("Configuration loaded", { rootDir, outputDir, htmlDir });

    const handler = new htmlPlugin({ outputDir, rootDir, htmlDir });

    const server = getServer(handler);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info("MCP server connected and ready");
  } catch (error) {
    logger.error("Failed to start MCP server", error);
    throw error;
  }
};

main();
