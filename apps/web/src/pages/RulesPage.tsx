import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RuleFile {
  id: string;
  number: string;
  title: string;
  filename: string;
}

interface Manifest {
  files: RuleFile[];
}

interface RuleDoc {
  number: string;
  title: string;
  text: string;
}

type ViewMode = 'list' | 'search';

const ACCENT_MAP: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o',
  ú: 'u', ù: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n',
  Á: 'A', À: 'A', Â: 'A', Ã: 'A', Ä: 'A',
  É: 'E', È: 'E', Ê: 'E', Ë: 'E',
  Í: 'I', Ì: 'I', Î: 'I', Ï: 'I',
  Ó: 'O', Ò: 'O', Ô: 'O', Õ: 'O', Ö: 'O',
  Ú: 'U', Ù: 'U', Û: 'U', Ü: 'U',
  Ç: 'C', Ñ: 'N',
};

const ACCENT_CHARS_REGEX = /[à-öø-ÿÀ-ÖØ-Þ]/g;

// Substitui cada caractere acentuado por seu equivalente sem acento, preservando o tamanho
// da string original -- os indices continuam validos para recortar o texto original.
function foldAccents(s: string): string {
  return s.replace(ACCENT_CHARS_REGEX, (c) => ACCENT_MAP[c] ?? c);
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pdfUrl(filename: string) {
  return `/regras-munchkin/${encodeURIComponent(filename)}`;
}

type TextPart = { text: string; highlight: boolean };

function splitHighlight(text: string, query: string, accentSensitive: boolean): TextPart[] {
  if (!query.trim()) return [{ text, highlight: false }];
  const haystack = accentSensitive ? text : foldAccents(text);
  const needle = accentSensitive ? query : foldAccents(query);
  const regex = new RegExp(`(${escapeRegex(needle)})`, 'gi');
  const parts: TextPart[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(haystack)) !== null) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), highlight: false });
    parts.push({ text: text.slice(m.index, m.index + m[1]!.length), highlight: true });
    last = m.index + m[1]!.length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), highlight: false });
  return parts;
}

function countMatches(text: string, query: string, accentSensitive: boolean): number {
  if (!query.trim()) return 0;
  const haystack = accentSensitive ? text : foldAccents(text);
  const needle = accentSensitive ? query : foldAccents(query);
  const matches = haystack.match(new RegExp(escapeRegex(needle), 'gi'));
  return matches?.length ?? 0;
}

export default function RulesPage() {
  const navigate = useNavigate();
  const [manifest, setManifest] = useState<RuleFile[]>([]);
  const [manifestLoading, setManifestLoading] = useState(true);
  const [manifestError, setManifestError] = useState(false);
  const [view, setView] = useState<ViewMode>('list');

  const [docs, setDocs] = useState<RuleDoc[] | null>(null);

  const [query, setQuery] = useState('');
  const [accentSensitive, setAccentSensitive] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [matchIndex, setMatchIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // O texto de cada PDF e pre-extraido em build-time (scripts/extract-pdf-text.mjs)
  // e servido como JSON estatico -- evita rodar o pdfjs (lento) no navegador.
  useEffect(() => {
    Promise.all([
      fetch('/regras-munchkin/manifest.json').then((r) => r.json() as Promise<Manifest>),
      fetch('/regras-munchkin/texts.json').then((r) => r.json() as Promise<Record<string, string>>),
    ])
      .then(([m, texts]) => {
        const sorted = [...m.files].sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
        setManifest(sorted);
        setDocs(sorted.map((f) => ({ number: f.number, title: f.title, text: texts[f.id] ?? '' })));
      })
      .catch(() => setManifestError(true))
      .finally(() => setManifestLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim() || !docs) {
      setMatchCount(0);
      setMatchIndex(0);
      return;
    }
    const total = docs.reduce(
      (sum, d) => sum + countMatches(d.title, query, accentSensitive) + countMatches(d.text, query, accentSensitive),
      0,
    );
    setMatchCount(total);
    setMatchIndex(0);
  }, [query, docs, accentSensitive]);

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
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) prevMatch();
      else nextMatch();
    }
  };

  const renderParts = (parts: TextPart[], key: string) =>
    parts.map((p, i) =>
      p.highlight ? (
        <mark key={`${key}-${i}`} className="bg-brand-gold text-surface-base rounded px-0.5">
          {p.text}
        </mark>
      ) : (
        <React.Fragment key={`${key}-${i}`}>{p.text}</React.Fragment>
      ),
    );

  const renderSearchContent = () => {
    if (!docs) return null;
    return docs.map((doc, docIdx) => (
      <section key={docIdx} className="mb-6">
        <h2 className="font-heading text-brand-gold text-xl mt-6 mb-2 leading-snug">
          {doc.number}. {renderParts(splitHighlight(doc.title, query, accentSensitive), `t-${docIdx}`)}
        </h2>
        {doc.text.split('\n\n').map((page, pageIdx) => (
          <p key={pageIdx} className="font-body text-parchment leading-relaxed mb-3 whitespace-pre-wrap">
            {renderParts(splitHighlight(page, query, accentSensitive), `p-${docIdx}-${pageIdx}`)}
          </p>
        ))}
      </section>
    ));
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col max-w-2xl mx-auto">
      <header className="sticky top-0 z-10 bg-surface-base/95 backdrop-blur border-b border-parchment-dim/20 px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="font-heading text-parchment-muted hover:text-parchment transition-colors text-sm shrink-0"
          >
            {'←'} Voltar
          </button>
          <h1 className="font-heading text-brand-gold flex-1 text-center text-lg">
            Regras Munchkin
          </h1>
          <div className="w-12 shrink-0" />
        </div>

        {/* Alternancia entre lista de PDFs e busca combinada */}
        <div className="flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`flex-1 font-heading text-xs py-2 rounded-lg transition-colors ${
              view === 'list'
                ? 'bg-brand-gold text-surface-base'
                : 'bg-surface-card text-parchment-muted hover:text-parchment'
            }`}
          >
            {'\u{1F4C4}'} Ver PDFs originais
          </button>
          <button
            onClick={() => setView('search')}
            className={`flex-1 font-heading text-xs py-2 rounded-lg transition-colors ${
              view === 'search'
                ? 'bg-brand-gold text-surface-base'
                : 'bg-surface-card text-parchment-muted hover:text-parchment'
            }`}
          >
            {'\u{1F50D}'} Buscar em todas
          </button>
        </div>

        {view === 'search' && (
          <>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-surface-card border border-parchment-dim/30 rounded-lg px-3 py-2 focus-within:border-brand-gold/60 transition-colors">
                <span className="text-parchment-dim text-sm" aria-hidden>{'\u{1F50D}'}</span>
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
                    {'✕'}
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
                        {'↑'}
                      </button>
                      <button
                        onClick={nextMatch}
                        aria-label="Proximo resultado"
                        className="p-1 rounded text-parchment-muted hover:text-parchment hover:bg-surface-card transition-colors"
                      >
                        {'↓'}
                      </button>
                    </>
                  ) : (
                    <span className="font-heading text-xs text-parchment-dim">Nenhum resultado</span>
                  )}
                </div>
              )}
            </div>

            <fieldset className="flex items-center gap-3 text-xs">
              <legend className="font-heading text-parchment-dim mr-1">Considerar acentos na busca:</legend>
              <label className="flex items-center gap-1 cursor-pointer font-body text-parchment-muted">
                <input
                  type="radio"
                  name="accent-mode"
                  checked={!accentSensitive}
                  onChange={() => setAccentSensitive(false)}
                  className="accent-brand-gold"
                />
                Nao (ex: &quot;epico&quot; encontra &quot;épico&quot;)
              </label>
              <label className="flex items-center gap-1 cursor-pointer font-body text-parchment-muted">
                <input
                  type="radio"
                  name="accent-mode"
                  checked={accentSensitive}
                  onChange={() => setAccentSensitive(true)}
                  className="accent-brand-gold"
                />
                Sim
              </label>
            </fieldset>
          </>
        )}
      </header>

      <div ref={containerRef} className="flex-1 px-4 py-4">
        {manifestLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
          </div>
        ) : manifestError ? (
          <p className="font-body text-parchment-muted">
            Nao foi possivel carregar a lista de regras. Verifique se a pasta{' '}
            <code>apps/web/public/regras-munchkin/</code> contem um <code>manifest.json</code> valido.
          </p>
        ) : view === 'list' ? (
          <div className="flex flex-col gap-2">
            {manifest.map((f) => (
              <a
                key={f.id}
                href={pdfUrl(f.filename)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 bg-surface-card rounded-xl px-4 py-3 hover:bg-surface-elevated transition-colors"
              >
                <span className="font-heading text-parchment text-sm flex items-center gap-2">
                  <span className="text-brand-gold">{f.number}.</span>
                  {f.title}
                </span>
                <span className="text-parchment-dim text-xs shrink-0">Abrir PDF {'↗'}</span>
              </a>
            ))}
          </div>
        ) : (
          renderSearchContent()
        )}
      </div>
    </div>
  );
}
