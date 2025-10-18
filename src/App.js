import React, { useState, useEffect } from 'react';
import PromptCraft from './PromptCraft';

export default function App() {
  const [theme, setTheme] = useState('auto'); // 'light' | 'dark' | 'auto'
  const [lang, setLang] = useState('bilingual'); // 'english' | 'indonesia' | 'bilingual'

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.removeAttribute('data-theme');
    } else {
      // auto: follow prefers-color-scheme
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
    }
  }, [theme]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold">PromptCraft</h1>
            <p className="text-sm text-gray-500">AI Prompt Generator — bilingual, light/dark switch</p>
          </div>
          <div className="flex gap-3 items-center">
            <label className="text-sm">Theme</label>
            <select value={theme} onChange={e => setTheme(e.target.value)} className="rounded p-2 border">
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>

            <label className="text-sm ml-2">Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)} className="rounded p-2 border">
              <option value="bilingual">Bilingual</option>
              <option value="english">English</option>
              <option value="indonesia">Bahasa Indonesia</option>
            </select>
          </div>
        </div>

        <PromptCraft appLang={lang} />
      </div>
    </div>
  );
}
