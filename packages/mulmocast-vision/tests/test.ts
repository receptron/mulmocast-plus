import { htmlPlugin } from "../src/html_class";

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

const defaultStyle = `
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
  const handler = new htmlPlugin({ outputDir, rootDir, templateOptions: { headerStyle: defaultStyle } });
  // const handler = new htmlPlugin({ outputDir, rootDir, templateOptions: {htmlTemplateFile: "tailwind-sea"}});
  // const handler = new htmlPlugin({ outputDir, rootDir, templateOptions: {headerStyle: darkStyle}});
  toolsRunner(handler, data.items);
  // toolsRunner(presentationHandlers, toolsResponses);
};

main();
