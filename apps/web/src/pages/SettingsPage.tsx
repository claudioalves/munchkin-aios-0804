import { Link } from 'react-router-dom';
import { useTTS } from '@/hooks/useTTS';

export default function SettingsPage() {
  const { isSupported, voices, selectedVoiceURI, setVoice, speak } = useTTS();

  const handlePreview = () => {
    speak('Claudio nível seis. Padova nível quatro. Banzai nível dois.');
  };

  return (
    <div className="min-h-screen bg-surface-base p-6 space-y-6 max-w-lg mx-auto">
      <header className="flex items-center gap-4">
        <Link
          to="/"
          className="text-parchment-muted hover:text-parchment transition-colors font-heading text-sm"
        >
          ← Voltar
        </Link>
        <h1 className="font-heading text-parchment text-xl flex-1">Configurações</h1>
      </header>

      <section className="bg-surface-card rounded-xl p-5 space-y-4">
        <h2 className="font-heading text-parchment text-base">Narrador</h2>

        {!isSupported ? (
          <p className="font-body text-parchment-dim text-sm">
            Narração por voz não disponível neste dispositivo.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <label className="font-body text-parchment-dim text-xs uppercase tracking-wider">
                Voz do narrador
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-surface-elevated border border-parchment-dim rounded-lg px-3 py-2 font-body text-parchment text-sm focus:outline-none focus:border-brand-gold transition-colors"
              >
                <option value="">Voz padrão do sistema</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePreview}
              className="font-heading text-brand-gold text-sm hover:text-brand-gold-light transition-colors"
            >
              🎙️ Testar narração
            </button>
          </>
        )}
      </section>
    </div>
  );
}
