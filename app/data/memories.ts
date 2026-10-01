/**
 * OUR STORY TIMELINE + MEMORY WALL.
 * Add as many memories as you like. Copy a block, change the words.
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
  { id: "m1", title: "[ADD YOUR MEMORY HERE]", date: "[DATE]", image: "/media/images/memories/memory-01.jpg", description: "[ADD YOUR MEMORY HERE — what happened, how it felt]", quote: "[ADD YOUR PERSONAL QUOTE HERE]" },
  { id: "m2", title: "[ADD YOUR MEMORY HERE]", date: "[DATE]", image: "/media/images/memories/memory-02.jpg", description: "[ADD YOUR MEMORY HERE]" },
  { id: "m3", title: "[ADD YOUR MEMORY HERE]", date: "[DATE]", image: "/media/images/memories/memory-03.jpg", description: "[ADD YOUR MEMORY HERE]", quote: "[ADD YOUR PERSONAL QUOTE HERE]" },
  { id: "m4", title: "[ADD YOUR MEMORY HERE]", date: "[DATE]", image: "/media/images/memories/memory-04.jpg", description: "[ADD YOUR MEMORY HERE]" },
  { id: "m5", title: "[ADD YOUR MEMORY HERE]", date: "[DATE]", image: "/media/images/memories/memory-05.jpg", description: "[ADD YOUR MEMORY HERE]" },
  { id: "m6", title: "[ADD YOUR MEMORY HERE]", date: "[DATE]", image: "/media/images/memories/memory-06.jpg", description: "[ADD YOUR MEMORY HERE]" },
];
