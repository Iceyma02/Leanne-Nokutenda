/**
 * PHOTO GALLERY — two collections: HER and OUR MOMENTS.
 * Put photos in /public/media/images/leanne/ and /public/media/images/us/
 * then list them here. Missing photos show an elegant placeholder.
 */
export type Photo = { src: string; caption: string; date?: string; alt: string };

const make = (folder: string, prefix: string, n: number, alt: string): Photo[] =>
  Array.from({ length: n }, (_, i) => {
    const id = String(i + 1).padStart(2, "0");
    return { src: `/media/images/${folder}/${prefix}-${id}.jpg`, caption: "", alt: `${alt} ${i + 1}` };
  });

// Quick way: photos named leanne-01.jpg … leanne-08.jpg are picked up automatically.
// To customise a caption, replace the line with your own list, e.g.
//   { src: "/media/images/leanne/leanne-01.jpg", caption: "Sunday smiles", date: "March 2026", alt: "Leanne smiling" }
export const herPhotos: Photo[] = make("leanne", "leanne", 8, "Photo of Leanne");
export const usPhotos: Photo[] = make("us", "us", 8, "Photo of us");

// The big full-bleed editorial photos in "Your Light" (use your best 3).
export const lightPhotos: Photo[] = [
  { src: "/media/images/leanne/leanne-01.jpg", caption: "", alt: "Leanne" },
  { src: "/media/images/leanne/leanne-02.jpg", caption: "", alt: "Leanne" },
  { src: "/media/images/leanne/leanne-03.jpg", caption: "", alt: "Leanne" },
];
