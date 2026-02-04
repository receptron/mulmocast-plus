import ffmpegStatic from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";
import ffmpeg from "fluent-ffmpeg";

// ffmpeg-static exports the path directly as default
const ffmpegPath = ffmpegStatic as unknown as string;
// ffprobe-static exports an object with path property
const ffprobePath = (ffprobeStatic as { path: string }).path;

/**
 * Setup ffmpeg paths from bundled static binaries
 */
export const setupFfmpeg = () => {
  if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
  }
  if (ffprobePath) {
    ffmpeg.setFfprobePath(ffprobePath);
  }
};

export { ffmpegPath, ffprobePath };
