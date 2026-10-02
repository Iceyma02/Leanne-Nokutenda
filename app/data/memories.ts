/**
 * OUR STORY TIMELINE + MEMORY WALL.
 * Add as many memories as you like. Leave title/date/description as "" to show just the photo. Copy a block, change the words.
 * Images go in /public/media/images/memories/ (see README there).
 * `video` and `quote` are optional — delete the lines you do not need.
 */
export type Memory = {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
  video?: string;
  quote?: string;
};

export const memories: Memory[] = [
  { id: "m1", title: "", date: "", image: "/media/images/memories/memory-01.jpg", description: "" },
  { id: "m2", title: "", date: "", image: "/media/images/memories/memory-02.jpg", description: "" },
  { id: "m3", title: "", date: "", image: "/media/images/memories/memory-03.jpg", description: "" },
  { id: "m4", title: "", date: "", image: "/media/images/memories/memory-04.jpg", description: "" },
  { id: "m5", title: "", date: "", image: "/media/images/memories/memory-05.jpg", description: "" },
  { id: "m6", title: "", date: "", image: "/media/images/memories/memory-06.jpg", description: "" },
];
