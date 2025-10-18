import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCcw, Image, Type, Video, Code, Megaphone } from "lucide-react";

const CATEGORIES = [
  { id: "image", labelEn: "Image", labelId: "Gambar", icon: <Image className="w-5 h-5" /> },
  { id: "text", labelEn: "Text", labelId: "Teks", icon: <Type className="w-5 h-5" /> },
  { id: "video", labelEn: "Video", labelId: "Video", icon: <Video className="w-5 h-5" /> },
  { id: "code", labelEn: "Code", labelId: "Coding", icon: <Code className="w-5 h-5" /> },
  { id: "marketing", labelEn: "Marketing", labelId: "Marketing", icon: <Megaphone className="w-5 h-5" /> },
];

const STYLES = ["Professional", "Funny", "Realistic", "Cinematic", "Minimal", "Artistic"];

const TEMPLATES = {
  image: (desc, style, opts = {}) =>
    `Generate a highly detailed, photorealistic image of ${desc}, in ${style.toLowerCase()} style, with perfect lighting, composition, and atmosphere. ${opts.detail ? `Detail level: ${opts.detail}.` : ""}`,
  text: (desc, style) =>
    `Write a ${style.toLowerCase()} text about ${desc}. Make it engaging, creative, and clear. Include hooks and a concise conclusion.`,
  video: (desc, style) =>
    `Create a cinematic storytelling concept about ${desc}, written in ${style.toLowerCase()} tone. Provide scene descriptions, shot types, and emotional pacing suitable for short-form vertical video.`,
  code: (desc, style, opts = {}) =>
    `Write a ${opts.lang || "Python"} code that ${desc}. Follow clean coding principles and include brief comments and usage examples.`,
  marketing: (desc, style) =>
    `Generate a ${style.toLowerCase()} marketing prompt for promoting ${desc}, including catchy headline, engaging body, and strong call-to-action. Mention target audience and ideal platform.`,
};

function sampleVariations(text) {
  const modifiers = ["with soft natural lighting", "with cinematic color grading", "with high contrast details", "with a friendly tone", "with minimalist composition"];
  const pick = modifiers[Math.floor(Math.random() * modifiers.length)];
  return text.endsWith(".") ? `${text.slice(0, -1)}, ${pick}.` : `${text} ${pick}`;
}

export default function PromptCraft({ appLang = 'bilingual' }) {
  const [category, setCategory] = useState("image");
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState("Realistic");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLevel, setDetailLevel] = useState("Medium");
  const [advanced, setAdvanced] = useState(false);
  const [langChoice, setLangChoice] = useState("English");

  function t(en, id) {
    if (appLang === 'english') return en;
    if (appLang === 'indonesia') return id;
    // bilingual: prefer Indonesian in UI labels but keep English prompts
    return `${id} / ${en}`;
  }

  function buildInterpretation(cat, ideaText, styleText) {
    if (!ideaText) return appLang === 'indonesia' ? "Mengubah ide sederhana menjadi prompt AI terstruktur." : "Transform a simple idea into a structured AI prompt.";
    switch (cat) {
      case "image":
        return appLang === 'indonesia' ? `Membuat gambar ${ideaText} dengan gaya ${styleText.toLowerCase()} dan pencahayaan yang sesuai.` : `Create an image of ${ideaText} in ${styleText.toLowerCase()} style.`;
      case "text":
        return appLang === 'indonesia' ? `Menulis teks bertema ${ideaText} dalam gaya ${styleText.toLowerCase()}.` : `Write a text about ${ideaText} in ${styleText.toLowerCase()} style.`;
      case "video":
        return appLang === 'indonesia' ? `Konsep video singkat tentang ${ideaText} yang dikemas secara ${styleText.toLowerCase()}.` : `Short video concept about ${ideaText} presented in ${styleText.toLowerCase()} style.`;
      case "code":
        return appLang === 'indonesia' ? `Membuat kode yang berfungsi untuk ${ideaText} (contoh: implementasi, automasi, atau utility).` : `Create code that accomplishes ${ideaText}.`;
      case "marketing":
        return appLang === 'indonesia' ? `Membuat materi pemasaran untuk ${ideaText} yang menarik perhatian target audiens.` : `Create marketing material for ${ideaText} that grabs attention.`;
      default:
        return appLang === 'indonesia' ? "Mengubah ide menjadi prompt AI." : "Transform idea into AI prompt.";
    }
  }

  function generatePrompt({ regen = false } = {}) {
    setLoading(true);
    setTimeout(() => {
      const template = TEMPLATES[category];
      const opts = { detail: detailLevel, lang: langChoice === "English" ? "English" : "Python" };
      let raw = template(idea || "[user description]", style, opts);
      if (regen) raw = sampleVariations(raw);
      const finalPrompt = langChoice === "Indonesian" ? raw.replace(/\bGenerate\b/i, "Buat").replace(/\bWrite\b/i, "Tulis") : raw;
      setOutput({ interpretation: buildInterpretation(category, idea, style), prompt: finalPrompt });
      setLoading(false);
    }, 350);
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output.prompt).then(() => {
      alert(appLang === 'indonesia' ? 'Prompt disalin ke clipboard!' : 'Prompt copied to clipboard!');
    });
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-white rounded-2xl shadow-md p-6" style={{backgroundColor: 'var(--card)'}}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">PromptCraft</h2>
          <p className="text-sm text-gray-500">{t('AI Prompt Generator — create prompts quickly', 'Generator Prompt AI — buat prompt dengan cepat')}</p>
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-600">{t('Advanced','Lanjutan')}</label>
          <input type="checkbox" checked={advanced} onChange={() => setAdvanced(!advanced)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-2">{t('Category','Kategori')}</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`flex items-center gap-2 p-2 rounded-xl border ${category === c.id ? "border-indigo-400 bg-indigo-50" : "border-gray-200"}`}
              >
                {c.icon}
                <span className="text-sm">{appLang === 'indonesia' ? c.labelId : c.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-2">{t('Idea / Description','Ide / Deskripsi')}</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={3}
            placeholder={t('Enter your idea or topic here...','Masukkan ide atau topikmu di sini...')}
            className="w-full rounded-xl border-gray-200 shadow-sm p-3"
          />

          <div className="flex gap-3 items-center mt-3">
            <div>
              <label className="block text-xs text-gray-600">{t('Style','Gaya')}</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="rounded-lg p-2 border">
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {advanced && (
              <div>
                <label className="block text-xs text-gray-600">{t('Detail','Detail')}</label>
                <select value={detailLevel} onChange={(e) => setDetailLevel(e.target.value)} className="rounded-lg p-2 border">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-600">{t('Output Language','Bahasa Output')}</label>
              <select value={langChoice} onChange={(e) => setLangChoice(e.target.value)} className="rounded-lg p-2 border">
                <option>English</option>
                <option>Indonesian</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => generatePrompt({ regen: false })}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
        >
          Generate Prompt
        </button>

        <button
          onClick={() => generatePrompt({ regen: true })}
          className="px-3 py-2 rounded-lg border hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" /> Regenerate
        </button>

        <button onClick={handleCopy} className="px-3 py-2 rounded-lg border flex items-center gap-2">
          <Copy className="w-4 h-4" /> {appLang === 'indonesia' ? 'Salin' : 'Copy'}
        </button>
      </div>

      <div className="mt-6">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="bg-gray-50 p-4 rounded-xl border">
          {loading ? (
            <div className="text-gray-500">✨ {appLang === 'indonesia' ? 'Menyusun prompt terbaik untukmu...' : 'Crafting the best prompt for you...'}</div>
          ) : output ? (
            <div>
              <h3 className="text-sm text-gray-600">🎯 {appLang === 'indonesia' ? 'Tujuan' : 'Goal'}</h3>
              <p className="text-sm mb-3">{output.interpretation}</p>

              <h3 className="text-sm text-gray-600">🧩 {appLang === 'indonesia' ? 'Prompt AI' : 'AI Prompt'}</h3>
              <pre className="whitespace-pre-wrap bg-white p-3 rounded-md border mt-2">{output.prompt}</pre>
            </div>
          ) : (
            <div className="text-gray-400">{appLang === 'indonesia' ? 'Hasil prompt akan muncul di sini setelah kamu tekan Generate Prompt.' : 'Prompt output will appear here after you press Generate Prompt.'}</div>
          )}
        </motion.div>
      </div>

      <div className="text-xs text-gray-500 mt-3">Tip: {appLang === 'indonesia' ? 'gunakan tombol Regenerate untuk variasi prompt.' : 'use the Regenerate button for variations.'}</div>
    </motion.div>
  );
}
