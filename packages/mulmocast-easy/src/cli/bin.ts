#!/usr/bin/env node

import { setupFfmpeg } from "../setup.js";

// Setup ffmpeg before importing mulmocast
setupFfmpeg();

// TODO: Re-export mulmocast CLI with ffmpeg pre-configured
// import("mulmocast/cli");
