import { htmlPlugin } from "../src/presentationHandlers/html_class";

import { toolsRunner } from "./runner";
import { data } from "./ai_referencing_80_tool_calls";
import { mkdir, getRootDir, getOutDir } from "../src/utils";

const rootDir = getRootDir();
const outputDir = getOutDir();

export const darkStyle = `
  <style type="text/tailwindcss">
    @layer base {
      body {
        @apply text-white bg-black bg-center;
      }
    }
  </style>
`;

const __defaultStyle = `
  <style type="text/tailwindcss">
    @layer base {
      body {
        @apply bg-white text-gray-800;
      }
    }
  </style>
`;

const main = () => {
  mkdir(outputDir);
  // use tailwind-sea html layout template in html/templates and apply darkStyle in header.
  // The html used in each slide is specified in the ${htmlDir} directory.
  const handler = new htmlPlugin({ outputDir, rootDir, templateOptions: { htmlTemplateFile: "tailwind-sea", headerStyle: darkStyle }, htmlDir: "html" });
  // const handler = new htmlPlugin({ outputDir, rootDir, templateOptions: { headerStyle: defaultStyle } });
  // const handler = new htmlPlugin({ outputDir, rootDir, templateOptions: {headerStyle: darkStyle}});
  // toolsRunner(presentationHandlers, toolsResponses);
  toolsRunner(handler, data.items);
  console.log(outputDir);
};

main();
