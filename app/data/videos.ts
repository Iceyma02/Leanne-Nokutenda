/**
 * VIDEOS — they autoplay (muted, looping) when she scrolls to them. No posters needed.
 * Put MP4 files in /public/media/videos/leanne/ or /us/ and list them here.
 */
export type Video = { src: string; title?: string };

export const videos: Video[] = [
  { src: "/media/videos/leanne/leanne-01.mp4" },
  { src: "/media/videos/us/us-01.mp4" },
  { src: "/media/videos/leanne/leanne-02.mp4" },
  { src: "/media/videos/us/us-02.mp4" },
];
