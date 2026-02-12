import test from "node:test";
import assert from "node:assert";
import { functionNameToTemplateName, templateNameTofunctionName, toolsToTemplateNames, convertTools } from "../src/commons";
import { tools } from "../src/tools";

import { htmlPlugin } from "../src/html_class";

// import assert from "node:assert";

test("test temp name", async () => {
  const tempName = functionNameToTemplateName("createThisIsAPen");
  assert.equal(tempName, "thisIsAPen");
  console.log(tempName);

  const funcName = templateNameTofunctionName("thisIsAPen");
  assert.equal(funcName, "createThisIsAPen");
});

test("test temp name", async () => {
  const res = toolsToTemplateNames(tools);
  console.log(res);
});

test("test temp name", async () => {
  const res = convertTools(tools);
  console.log(res);
});

test("test html", async () => {
  const handler = new htmlPlugin({ outputDir: "", rootDir: "", templateOptions: {} });
  const html = handler.getHtml("createAgendaSlide", {
    title: "Agenda",
    items: [
      "Executive summary",
      "Reference reliability and hallucinations",
      "Attribution and credit in AI workflows",
      "Standards & compliance (academia, journalism, law)",
      "Roadmap & recommendations",
    ],
  });
  console.log(html);
});
