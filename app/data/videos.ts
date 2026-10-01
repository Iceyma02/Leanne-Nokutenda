/**
 * VIDEOS — put MP4 files in /public/media/videos/leanne/ or /us/
 * and a poster image (JPG) in /public/media/posters/ with a matching name.
 */
export type Video = { src: string; poster: string; title: string; group: "leanne" | "us" };

export const videos: Video[] = [
  { src: "/media/videos/leanne/leanne-01.mp4", poster: "/media/posters/leanne-01.jpg", title: "[ADD YOUR VIDEO HERE]", group: "leanne" },
  { src: "/media/videos/leanne/leanne-02.mp4", poster: "/media/posters/leanne-02.jpg", title: "[ADD YOUR VIDEO HERE]", group: "leanne" },
  { src: "/media/videos/us/us-01.mp4", poster: "/media/posters/us-01.jpg", title: "[ADD YOUR VIDEO HERE]", group: "us" },
  { src: "/media/videos/us/us-02.mp4", poster: "/media/posters/us-02.jpg", title: "[ADD YOUR VIDEO HERE]", group: "us" },
];
