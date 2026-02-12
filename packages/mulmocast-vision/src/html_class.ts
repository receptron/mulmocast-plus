import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

import { createPage, getOutDir, getRootDir, mkdir } from "./utils.js";
import { functionNameToTemplateName } from "./commons.js";
import nunjucks from "nunjucks";
import { type PluginOptionParams, type ToolArgs, type CreatePageOptions } from "./type.js";
import { getLogger } from "./logger.js";

export class htmlPlugin {
  protected outputDir: string;
  protected rootDir: string; // for read html template
  protected htmlDir: string;
  protected templateDir: string;
  protected sessionDir: string;
  protected templateOptions: CreatePageOptions;
  protected nunjucksEnv: nunjucks.Environment;

  constructor({
    outputDir,
    rootDir,
    templateOptions,
    // for html template. If templateDir exists, it takes precedence over htmlDir.
    htmlDir, // relative path
    templateDir, // absolute path
  }: {
    outputDir?: string;
    rootDir?: string;
    templateOptions?: CreatePageOptions;
    htmlDir?: string;
    templateDir?: string;
  }) {
    this.outputDir = outputDir ?? getOutDir();
    this.rootDir = rootDir ?? getRootDir();
    this.sessionDir = "";
    this.htmlDir = htmlDir ?? "html2";
    this.templateDir = templateDir ?? "";
    this.templateOptions = templateOptions ?? {};

    // Configure Nunjucks environment with FileSystemLoader
    const templatePath = this.templateDir ? this.templateDir : path.resolve(this.rootDir, "html", this.htmlDir);
    const loader = new nunjucks.FileSystemLoader(templatePath, {
      noCache: true, // Disable cache to ensure fresh templates
    });
    this.nunjucksEnv = new nunjucks.Environment(loader, {
      autoescape: false, // Don't escape HTML
      throwOnUndefined: false, // Don't throw on undefined variables
    });
  }

  // api for mcp
  public callNamedFunction = async (functionName: string, args: ToolArgs, options: PluginOptionParams) => {
    const logger = getLogger();
    logger.debug(`callNamedFunction: ${functionName}`, { args, options });
    const member = (this as Record<string, unknown>)[functionName];
    if (member && typeof member === "function") {
      return member(args, { ...options, functionName });
    }
    return this.generateHtml(args, { ...options, functionName });
  };

  private generateHtml = async (args: ToolArgs, options: PluginOptionParams) => {
    const logger = getLogger();
    const { outputFileName, functionName, imageFilePath, htmlFilePath } = options ?? {};
    if (!functionName) {
      throw new Error("functionName is required");
    }
    logger.info("Generating HTML", { functionName, outputFileName });

    try {
      const html = this.getHtml(functionName, args);
      const outfile = imageFilePath ?? path.resolve(this.outputDir, this.sessionDir, `${outputFileName}.png`);
      const htmlFile = htmlFilePath ?? path.resolve(this.outputDir, this.sessionDir, `${outputFileName}.html`);

      // Ensure the output directory exists
      const outputDir = path.dirname(outfile);
      if (!fs.existsSync(outputDir)) {
        logger.info("Creating output directory", { outputDir });
        mkdir(outputDir);
      }

      await createPage(this.rootDir, outfile, html, { htmlFile, ...this.templateOptions });

      logger.fileWrite(outfile);
      logger.fileWrite(htmlFile);
      logger.info("HTML generated successfully", { outfile, htmlFile });

      return {
        text: `html generated successfully to: ${outfile}`,
      };
    } catch (error) {
      logger.error("Failed to generate HTML", error, {
        functionName,
        outputFileName,
        args,
        outputDir: this.outputDir,
        sessionDir: this.sessionDir,
      });
      throw error;
    }
  };

  // for electron
  public getHtml = (functionName: string, args: ToolArgs) => {
    const logger = getLogger();
    const templateFileName = functionNameToTemplateName(functionName);
    const templateFilePath = path.resolve(this.templateDir ? this.templateDir : path.resolve(this.rootDir, "html", this.htmlDir), `${templateFileName}.html`);

    if (!fs.existsSync(templateFilePath)) {
      const error = new Error(`getHtml: file ${templateFilePath} not exists.`);
      logger.error("Template file not found", error, {
        templateFilePath,
        functionName,
        templateFileName,
        templateDir: this.templateDir,
        htmlDir: this.htmlDir,
        rootDir: this.rootDir,
      });
      throw error;
    }
    logger.fileRead(templateFilePath);
    logger.debug("Rendering template", { templateFileName, args });

    try {
      // Use the configured Nunjucks environment instead of the default
      // This ensures the FileSystemLoader can find the template
      return this.nunjucksEnv.render(`${templateFileName}.html`, args);
    } catch (error) {
      logger.error("Template rendering failed", error, { templateFilePath, templateFileName, args });
      throw error;
    }
  };

  // for mcp
  public setDirectory = async (args: ToolArgs, __options: PluginOptionParams) => {
    const logger = getLogger();
    this.sessionDir = args.directoryName as string;
    const outputDir = path.resolve(this.outputDir, this.sessionDir);
    logger.info("Setting directory", { sessionDir: this.sessionDir, outputDir });
    mkdir(outputDir);

    return {
      text: `set directory: ${this.sessionDir}`,
    };
  };

  public createPDF = async (args: { filename: string; images?: string[] }, __options: PluginOptionParams) => {
    const logger = getLogger();
    const { filename, images } = args ?? {};
    logger.info("Creating PDF", { filename, imagesCount: images?.length });

    try {
      const imageWidth = 1536;
      const imageHeight = 1024;

      const pageWidth = imageWidth * 0.75; // 1152pt
      const pageHeight = imageHeight * 0.75; // 768pt

      const outputDir = path.resolve(this.outputDir, this.sessionDir);

      const files =
        images ??
        fs
          .readdirSync(outputDir)
          .filter((f) => f.toLowerCase().endsWith(".png"))
          .sort(new Intl.Collator("ja", { numeric: true }).compare);

      if (files.length === 0) {
        const error = new Error("No PNG files found");
        logger.error("No PNG files found", error, { outputDir });
        console.error("no PNG file");
        return;
      }

      logger.debug("PNG files found", { count: files.length, files });

      const doc = new PDFDocument({
        size: [pageWidth, pageHeight],
        margins: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      });

      const pdfPath = path.resolve(outputDir, filename as string);
      doc.pipe(fs.createWriteStream(pdfPath));

      files.forEach((f, i) => {
        const imagePath = path.join(outputDir, f);
        logger.fileRead(imagePath);
        if (i > 0) {
          doc.addPage({
            size: [pageWidth, pageHeight],
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
          });
        }
        doc.image(imagePath, 0, 0, {
          width: pageWidth,
          height: pageHeight,
        });
      });

      doc.end();
      logger.fileWrite(pdfPath);
      logger.info("PDF created successfully", { pdfPath, pageCount: files.length });

      return {
        text: `pdf created: ${outputDir}`,
      };
    } catch (error) {
      logger.error("Failed to create PDF", error, {
        filename,
        images,
        outputDir: this.outputDir,
        sessionDir: this.sessionDir,
      });
      throw error;
    }
  };

  public dumpMulmoScript = () => {};
}
