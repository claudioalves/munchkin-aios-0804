import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RuleFile {
  id: string;
  title: string;
  filename: string;
}

interface Manifest {
  files: RuleFile[];
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type TextPart = { text: string; highlight: boolean };

function splitHighlight(line: string, query: string): TextPart[] {
  if (!query.trim()) return [{ text: line, highlight: false }];
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts: TextPart[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) parts.push({ text: line.slice(last, m.index), highlight: false });
    parts.push({ text: m[1]!, highlight: true });
    last = m.index + m[1]!.length;
  }
  if (last < line.length) parts.push({ text: line.slice(last), highlight: false });
  return parts;
}

export default function RulesPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [matchIndex, setMatchIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/regras-munchkin/manifest.json')
      .then((r) => r.json())
      .then(async (manifest: Manifest) => {
        const texts = await Promise.all(
          manifest.files.map((f) =>
            fetch(`/regras-munchkin/${f.filename}`)
              .then((r) => r.text())
              .then((text) => `# ${f.title}\n\n${text}`),
          ),
        );
        setContent(texts.join('\n\n---\n\n'));
      })
      .catch(() => {
        setContent(
          '# Erro ao carregar regras\n\nNão foi possível carregar os arquivos de regras.\n\nVerifique se a pasta `apps/web/public/regras-munchkin/` existe e contém um `manifest.json` válido.',
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim()) { setMatchCount(0); setMatchIndex(0); return; }
    const matches = content.match(new RegExp(escapeRegex(query), 'gi'));
    setMatchCount(matches?.length ?? 0);
    setMatchIndex(0);
  }, [query, content]);

  useEffect(() => {
    if (!containerRef.current || !query.trim() || matchCount === 0) return;
    const marks = Array.from(containerRef.current.querySelectorAll('mark'));
    marks.forEach((el, i) => {
      const base = 'bg-brand-gold text-surface-base rounded px-0.5';
      el.className = i === matchIndex ? `${base} ring-2 ring-white` : base;
    });
    marks[matchIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [matchIndex, matchCount, query]);

  const prevMatch = () => setMatchIndex((i) => (i - 1 + matchCount) % matchCount);
  const nextMatch = () => setMatchIndex((i) => (i + 1) % matchCount);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); if (e.shiftKey) prevMatch(); else nextMatch(); }
  };

  const renderContent = () => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.trim() === '---') {
        return <hr key={idx} className="border-parchment-dim/30 my-4" />;
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      const isH1 = line.startsWith('# ');
      const isH2 = line.startsWith('## ');
      const isH3 = line.startsWith('### ');
      const rawText = line.replace(/^#{1,3}\s/, '');
      const parts = splitHighlight(rawText, query);

      const renderParts = (key: string) =>
        parts.map((p, i) =>
          p.highlight ? (
            <mark key={`${key}-${i}`} className="bg-brand-gold text-surface-base rounded px-0.5">
              {p.text}
            </mark>
          ) : (
            p.text
          ),
        );

      if (isH1) {
        return (
          <h2 key={idx} className="font-heading text-brand-gold text-xl mt-6 mb-2 leading-snug">
            {renderParts(String(idx))}
          </h2>
        );
      }
      if (isH2) {
        return (
          <h3 key={idx} className="font-heading text-parchment text-base mt-4 mb-1 leading-snug">
            {renderParts(String(idx))}
          </h3>
        );
      }
      if (isH3) {
        return (
          <h4 key={idx} className="font-heading text-parchment-muted text-sm mt-3 mb-1 leading-snug">
            {renderParts(String(idx))}
          </h4>
        );
      }

      const isList = line.startsWith('- ') || line.startsWith('* ');
      const listText = isList ? line.slice(2) : line;
      const listParts = splitHighlight(listText, query);
      const renderListParts = () =>
        listParts.map((p, i) =>
          p.highlight ? (
            <mark key={i} className="bg-brand-gold text-surface-base rounded px-0.5">
              {p.text}
            </mark>
          ) : (
            p.text
          ),
        );

      if (isList) {
        return (
          <p key={idx} className="font-body text-parchment leading-relaxed pl-4 before:content-['•'] before:mr-2 before:text-brand-gold-dark">
            {renderListParts()}
          </p>
        );
      }

      return (
        <p key={idx} className="font-body text-parchment leading-relaxed">
          {renderParts(String(idx))}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col max-w-2xl mx-auto">
      <header className="sticky top-0 z-10 bg-surface-base/95 backdrop-blur border-b border-parchment-dim/20 px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="font-heading text-parchment-muted hover:text-parchment transition-colors text-sm shrink-0"
          >
            ← Voltar
          </button>
          <h1 className="font-heading text-brand-gold flex-1 text-center text-lg">
            Regras Munchkin
          </h1>
          <div className="w-12 shrink-0" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-surface-card border border-parchment-dim/30 rounded-lg px-3 py-2 focus-within:border-brand-gold/60 transition-colors">
            <span className="text-parchment-dim text-sm" aria-hidden>🔍</span>
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar nas regras... (Enter para navegar)"
              className="flex-1 bg-transparent font-body text-parchment placeholder-parchment-dim outline-none text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Limpar busca"
                className="text-parchment-dim hover:text-parchment text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          {query.trim() && (
            <div className="flex items-center gap-1 shrink-0">
              {matchCount > 0 ? (
                <>
                  <span className="font-heading text-xs text-parchment-muted tabular-nums">
                    {matchIndex + 1}/{matchCount}
                  </span>
                  <button
                    onClick={prevMatch}
                    aria-label="Resultado anterior"
                    className="p-1 rounded text-parchment-muted hover:text-parchment hover:bg-surface-card transition-colors"
                  >
                    ↑
                  </button>
                  <button
                    onClick={nextMatch}
                    aria-label="Próximo resultado"
                    className="p-1 rounded text-parchment-muted hover:text-parchment hover:bg-surface-card transition-colors"
                  >
                    ↓
                  </button>
                </>
              ) : (
                <span className="font-heading text-xs text-parchment-dim">Nenhum resultado</span>
              )}
            </div>
          )}
        </div>
      </header>

      <div ref={containerRef} className="flex-1 px-4 py-4 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
