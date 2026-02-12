import fs from "fs";
import path from "path";
import os from "os";
import puppeteer from "puppeteer";

import { formattedDate } from "./commons.js";
import { type CreatePageOptions, type OpenAITool } from "./type.js";

const isCI = process.env.CI === "true";

export const renderHTMLToImage = async (html: string, outputPath: string, width: number, height: number) => {
  // Use Puppeteer to render HTML to an image
  const browser = await puppeteer.launch({
    args: isCI ? ["--no-sandbox"] : [],
  });
  const page = await browser.newPage();

  // Set the page content to the HTML generated from the Markdown
  await page.setContent(html);

  // Adjust page settings if needed (like width, height, etc.)
  await page.setViewport({ width, height });

  await page.addStyleTag({ content: "html,body{margin:0;padding:0;overflow:hidden}" });

  await page.evaluate(
    ({ vw, vh }) => {
      const de = document.documentElement;
      const sw = Math.max(de.scrollWidth, document.body.scrollWidth || 0);
      const sh = Math.max(de.scrollHeight, document.body.scrollHeight || 0);
      const scale = Math.min(vw / (sw || vw), vh / (sh || vh), 1); // <=1 で縮小のみ
      de.style.overflow = "hidden";
      (document.body as HTMLElement).style.zoom = String(scale);
    },
    { vw: width, vh: height },
  );

  // Step 3: Capture screenshot of the page (which contains the Markdown-rendered HTML)
  await page.screenshot({
    path: outputPath as `${string}.png` | `${string}.jpeg` | `${string}.webp`,
    fullPage: false,
  });

  await browser.close();
};

export const interpolate = (template: string, data: Record<string, string | undefined>): string => {
  return template.replace(/\$\{(.*?)\}/g, (_, key) => data[key.trim()] ?? "");
};

export const getHTMLFile = (rootDir: string, filename: string) => {
  return fs.readFileSync(path.resolve(rootDir, `./html/templates/${filename}.html`), "utf-8");
};

export const createPage = async (rootDir: string, outputFile: string, htmlBody: string, options?: CreatePageOptions) => {
  const canvasSize = { width: 1536, height: 1024 };
  const { htmlTemplateFile, headerStyle, htmlFile } = options ?? {};

  const template = getHTMLFile(rootDir, htmlTemplateFile ?? "tailwind");
  const htmlData = interpolate(template, { htmlBody, headerStyle });

  await renderHTMLToImage(htmlData, outputFile, canvasSize.width, canvasSize.height);
  if (htmlFile) {
    fs.writeFileSync(htmlFile, htmlData, "utf8");
  }
  return htmlData;
};

export const mkdir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const writeJSONData = (baseDir: string, tools: OpenAITool[]) => {
  fs.writeFileSync(path.resolve(baseDir, "tools.json"), JSON.stringify(tools, null, 2), "utf8");
};

const findPackageRoot = (startPath: string): string => {
  let dir = startPath;
  while (true) {
    const pkg = path.resolve(dir, "package.json");
    if (fs.existsSync(pkg)) return dir;

    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error("package root not found");
    }
    dir = parent;
  }
};

export const getRootDir = () => {
  return findPackageRoot(__dirname);
  // return path.resolve(__dirname, "../");
};
export const getOutDir = () => {
  const documentsDir = path.join(os.homedir(), "Documents");
  return path.join(documentsDir, "mulmocast-vision", formattedDate());
};

export const debugLogger = (data: unknown) => {
  const logFile = path.resolve("/tmp/mcp.log");

  try {
    const json = JSON.stringify(data, null, 2); // pretty print
    fs.appendFileSync(logFile, json + "\n", { encoding: "utf8" });
  } catch (err) {
    console.error("Failed to write debug log:", err);
  }
};
