import ffmpegFfprobeStatic from "ffmpeg-ffprobe-static";
import { setFfmpegPath, setFfprobePath } from "mulmocast";

/**
 * Setup ffmpeg paths from bundled static binaries.
 * Must be called before using mulmocast CLI or any ffmpeg operations.
 */
export const setupFfmpeg = () => {
  if (ffmpegFfprobeStatic.ffmpegPath) {
    setFfmpegPath(ffmpegFfprobeStatic.ffmpegPath);
  }
  if (ffmpegFfprobeStatic.ffprobePath) {
    setFfprobePath(ffmpegFfprobeStatic.ffprobePath);
  }
};

export const ffmpegPath = ffmpegFfprobeStatic.ffmpegPath;
export const ffprobePath = ffmpegFfprobeStatic.ffprobePath;
