#!/usr/bin/env node

import { setupFfmpeg } from "../setup.js";
import { cliMain } from "mulmocast";

// Setup ffmpeg paths before running CLI
setupFfmpeg();

// Run the mulmocast CLI
cliMain();
