// Design System smoke test — será substituído pelo roteador na Story 3.1
function App() {
  return (
    <div className="min-h-screen bg-surface-base p-8 space-y-12">

      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="font-display text-4xl text-brand-gold">
          Munchkin Level Tracker
        </h1>
        <p className="font-heading text-parchment-muted tracking-widest text-sm uppercase">
          Design System — Smoke Test
        </p>
      </header>

      {/* Paleta de cores */}
      <section className="space-y-4">
        <h2 className="font-heading text-parchment text-xl border-b border-parchment-dim pb-2">
          Cores
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { bg: 'bg-brand-gold',     label: 'brand-gold',     text: 'text-surface-base' },
            { bg: 'bg-brand-ruby',     label: 'brand-ruby',     text: 'text-parchment' },
            { bg: 'bg-brand-emerald',  label: 'brand-emerald',  text: 'text-parchment' },
            { bg: 'bg-surface-card',   label: 'surface-card',   text: 'text-parchment' },
            { bg: 'bg-parchment',      label: 'parchment',      text: 'text-surface-base' },
            { bg: 'bg-surface-elevated', label: 'surface-elevated', text: 'text-parchment' },
            { bg: 'bg-brand-gold-light', label: 'gold-light',   text: 'text-surface-base' },
            { bg: 'bg-brand-gold-dark',  label: 'gold-dark',    text: 'text-parchment' },
          ].map(({ bg, label, text }) => (
            <div
              key={label}
              className={`${bg} ${text} rounded-lg p-4 font-body text-sm flex items-end min-h-16`}
            >
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Tipografia */}
      <section className="space-y-4">
        <h2 className="font-heading text-parchment text-xl border-b border-parchment-dim pb-2">
          Tipografia
        </h2>
        <div className="space-y-6 bg-surface-card rounded-xl p-6">
          <div>
            <p className="font-body text-parchment-dim text-xs uppercase tracking-wider mb-1">
              font-display — Cinzel Decorative
            </p>
            <p className="font-display text-brand-gold text-3xl">
              Munchkin Level 11
            </p>
          </div>
          <div>
            <p className="font-body text-parchment-dim text-xs uppercase tracking-wider mb-1">
              font-heading — Cinzel
            </p>
            <p className="font-heading text-parchment text-2xl">
              CLAUDIO — NÍVEL 8
            </p>
          </div>
          <div>
            <p className="font-body text-parchment-dim text-xs uppercase tracking-wider mb-1">
              font-body — Crimson Pro
            </p>
            <p className="font-body text-parchment text-lg">
              Gerenciador de partidas de Munchkin para sessões presenciais com amigos.
            </p>
          </div>
        </div>
      </section>

      {/* Botões */}
      <section className="space-y-4">
        <h2 className="font-heading text-parchment text-xl border-b border-parchment-dim pb-2">
          Componentes Base
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-brand-gold text-surface-base font-heading font-semibold px-6 py-3 rounded-lg hover:bg-brand-gold-light transition-colors shadow-glow-gold">
            + Incrementar
          </button>
          <button className="bg-brand-ruby text-parchment font-heading font-semibold px-6 py-3 rounded-lg hover:bg-brand-ruby-light transition-colors">
            − Decrementar
          </button>
          <button className="bg-brand-emerald text-parchment font-heading font-semibold px-6 py-3 rounded-lg animate-victory">
            🏆 Vitória!
          </button>
          <button className="border border-brand-gold text-brand-gold font-heading px-6 py-3 rounded-lg hover:bg-surface-elevated transition-colors">
            Secundário
          </button>
        </div>
      </section>

      {/* Level card preview */}
      <section className="space-y-4">
        <h2 className="font-heading text-parchment text-xl border-b border-parchment-dim pb-2">
          Player Card Preview
        </h2>
        <div className="flex flex-wrap gap-4">
          {[
            { name: 'Claudio', level: 8, color: '#c9943a' },
            { name: 'Padova', level: 6, color: '#b02828' },
            { name: 'Maia',   level: 4, color: '#2d7a4a' },
          ].map(({ name, level, color }) => (
            <div
              key={name}
              className="bg-surface-card rounded-xl p-6 flex flex-col items-center gap-3 w-40 shadow-card"
              style={{ borderTop: `3px solid ${color}` }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-surface-base text-lg"
                style={{ backgroundColor: color }}
              >
                {name[0]}
              </div>
              <p className="font-heading text-parchment text-sm uppercase tracking-wide">
                {name}
              </p>
              <p className="font-display text-6xl leading-none" style={{ color }}>
                {level}
              </p>
              <div className="flex gap-2 mt-1">
                <button className="w-10 h-10 rounded-lg bg-brand-ruby text-parchment font-bold text-xl">
                  −
                </button>
                <button className="w-10 h-10 rounded-lg bg-brand-gold text-surface-base font-bold text-xl">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default App;
