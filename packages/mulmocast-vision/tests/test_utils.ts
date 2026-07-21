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

test("test toolsToTemplateNames", async () => {
  const res = toolsToTemplateNames(tools);
  assert.equal(res.length, tools.length);
  res.forEach((templateName, index) => {
    assert.equal(templateNameTofunctionName(templateName).toLowerCase(), tools[index].function.name.toLowerCase());
  });
});

test("test convertTools", async () => {
  const res = convertTools(tools);
  assert.equal(res.length, tools.length);
  res.forEach((tool, index) => {
    assert.equal(tool.function.name, "mulmoVisionAgent--" + tools[index].function.name);
    assert.ok(tool.function.parameters.properties.talkTrack);
  });
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
  assert.ok(html.includes("Agenda"));
  assert.ok(html.includes("Executive summary"));
});
