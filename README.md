# For My Queen, Leanne ❤️
A cinematic birthday experience: an interactive love letter, photo album, memory wall, prayer and a final heart storm.
Built with **Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Lenis** (smooth scroll) · HTML5 audio/video · a custom Canvas particle engine.

---

## 1. Run it
```bash
npm install
npm run dev        # http://localhost:3000
npm run lint && npm run typecheck && npm run build   # before you deploy
```
Needs Node 18.17+ (Node 20+ recommended).

---

## 2. WHERE EVERYTHING GOES (the checklist)

| What | Put the file here | Name it | Format |
|---|---|---|---|
| 🎵 **Birthday song** | `public/media/audio/` | **`birthday-song.mp3`** (exactly) | MP3, 128–192 kbps, under ~8 MB |
| 📸 **Photos of her** | `public/media/images/leanne/` | `leanne-01.jpg` … `leanne-08.jpg` | JPG/WebP, long edge 2000px, under 600 KB |
| 📸 **Photos of you two** | `public/media/images/us/` | `us-01.jpg` … `us-08.jpg` | same |
| 🧷 **Timeline + memory wall photos** | `public/media/images/memories/` | `memory-01.jpg` … `memory-06.jpg` | same |
| 🎬 **Videos of her** | `public/media/videos/leanne/` | `leanne-01.mp4`, `leanne-02.mp4` | MP4 (H.264), 720p/1080p, under 25 MB each |
| 🎬 **Videos of you two** | `public/media/videos/us/` | `us-01.mp4`, `us-02.mp4` | same |
| 🖼️ **Video poster images** | `public/media/posters/` | same name as the video: `leanne-01.jpg`, `us-01.jpg` | JPG, 1280×720 |

**The 3 best photos of her** go first in `leanne/` — `leanne-01`, `-02`, `-03` are the big full-screen editorial photos in the "Your Light" section.

Missing files never break the site: you'll see a soft "Add your photo here" placeholder instead.
Want more photos than 8? Change the number in `app/data/gallery.ts` (`make("leanne", "leanne", 8, ...)`) and add the files.

> Tip: phone photos are huge. Resize them first (e.g. squoosh.app) — the site loads far faster and plays smoothly on iPhone.

---

## 3. WHERE TO EDIT THE WORDS (no React needed)

| To change… | Open this file |
|---|---|
| Names, birthday, opening lines, hero, **final heart-storm messages**, footer, easter-egg texts, music volume | `app/data/site.ts` |
| **The love letter**, "Why my Queen is special", encouragement, future list, **the prayer** | `app/data/messages.ts` |
| **Memories** (timeline + memory wall): title, date, image, description, optional video, optional quote | `app/data/memories.ts` |
| Photo gallery captions/dates | `app/data/gallery.ts` |
| Video list/titles | `app/data/videos.ts` |
| Colours | `tailwind.config.ts` (`colors`) |

Everything in **[SQUARE BRACKETS]** is a placeholder for you to replace. While developing, it is highlighted in pink with a dashed underline so you can see what is left. **Search the project for `[` before you send it to her.**

### Add a memory
Copy a block in `app/data/memories.ts`:
```ts
{ id: "m7", title: "Our first trip", date: "June 2025", image: "/media/images/memories/memory-07.jpg",
  description: "What happened, how it felt.", quote: "Optional line", video: "/media/videos/us/us-03.mp4" }
```
Then drop `memory-07.jpg` into `public/media/images/memories/`.

### Add your name at the end
`app/data/site.ts` → `finale.signature: "— Anesu"` (shown in the footer and under the letter). Empty by default.

---

## 4. The experience (in order)
Opening gift → Hero → "Before anything else…" → Your Light → Why My Queen Is Special (tap the words) → Then there's us (timeline + film strip) → Gallery (Her / Our Moments, tap for the lightbox) → Little Moments, Big Memories (physical photo wall) → Videos → Letter → "I Hope You Never Forget…" → More Chapters To Write → Prayer → One last thing… → **tap the heart** → Heart storm.

The storm runs ~38 seconds: first hearts → they multiply → explosion → screen fills & piles up → 1.2s freeze → hearts part → final message.

**Hidden things for her to find** (don't tell her): a tiny faint heart in "Why My Queen Is Special", another near the memory wall, tap "I LOVE YOU, LEANNE" five times at the end, and a rare "I love you" that drifts in while she scrolls.

---

## 5. Deploy to Vercel
1. Push this repo to GitHub (already done if you can read this there).
2. Go to **vercel.com → Add New → Project → import `Leanne-Nokutenda`**.
3. Framework is auto-detected (Next.js). Click **Deploy**. No environment variables needed.
4. Every `git push` redeploys automatically.
5. Open the link **on your phone first**, tap the opening button, and check sound.

⚠️ Vercel's free plan has size limits per file/deployment — keep photos compressed and videos short. For many large videos, host them on a CDN (e.g. Cloudflare R2) and paste the full `https://…` URL as the video `src`.

Private link? The site has `noindex` set so search engines will skip it. Share the URL only with her.

---

## 6. Performance & accessibility notes
- Images use `next/image` (responsive sizes, lazy loading). Videos use `preload="metadata"`/lazy: nothing downloads until she taps.
- The heart storm is a single `<canvas>` with pre-rendered sprites, 3 depth layers, capped counts (lower on phones), adaptive quality, and pauses when off-screen.
- Music starts only after the first tap (browsers block autoplay). If the MP3 is missing the player hides itself.
- `prefers-reduced-motion` is respected: parallax and heavy motion are reduced, the storm runs shorter and lighter.
- Full keyboard support (Esc closes viewers, ←/→ in the gallery, Space in video).

## 7. Project structure
```
app/            page.tsx · layout.tsx · globals.css · data/ (all editable content)
components/     one file per scene + shared pieces (HeartStormCanvas, MusicPlayer, CustomCursor…)
lib/            audio context + helpers
public/media/   audio · images (leanne, us, memories) · videos (leanne, us) · posters
```
