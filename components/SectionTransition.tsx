/** A soft gradient seam between two moods. from/to are tailwind colour names. */
const map: Record<string, string> = {
  night: "#0a0408", plum: "#1d0b17", wine: "#3a0f24", ivory: "#f8f0e6", blush: "#f6d3da",
};
export default function SectionTransition({ from, to, h = 160 }: { from: keyof typeof map; to: keyof typeof map; h?: number }) {
  return <div aria-hidden style={{ height: h, background: `linear-gradient(to bottom, ${map[from]}, ${map[to]})` }} />;
}
