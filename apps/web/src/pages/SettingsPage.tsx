import { Link } from 'react-router-dom';
import { useTTS } from '@/hooks/useTTS';
import { useLang } from '@/i18n/LanguageContext';
import type { Language } from '@/i18n/translations';

export default function SettingsPage() {
  const { isSupported, voices, selectedVoiceURI, setVoice, speak } = useTTS();
  const { lang, setLang, t, LANGUAGES } = useLang();

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
        <h1 className="font-heading text-parchment text-xl flex-1">{t('settings.title')}</h1>
      </header>

      <section className="bg-surface-card rounded-xl p-5 space-y-4">
        <h2 className="font-heading text-parchment text-base">{t('settings.narrator')}</h2>

        {!isSupported ? (
          <p className="font-body text-parchment-dim text-sm">
            {t('settings.narratorUnsupported')}
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <label className="font-body text-parchment-dim text-xs uppercase tracking-wider">
                {t('settings.narratorVoice')}
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-surface-elevated border border-parchment-dim rounded-lg px-3 py-2 font-body text-parchment text-sm focus:outline-none focus:border-brand-gold transition-colors"
              >
                <option value="">{t('settings.narratorDefault')}</option>
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
              {t('settings.narratorTest')}
            </button>
          </>
        )}
      </section>

      <section className="bg-surface-card rounded-xl p-5 space-y-4">
        <h2 className="font-heading text-parchment text-base">{t('settings.language')}</h2>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, label]) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-3 py-2 rounded-lg font-heading text-sm transition-colors text-left ${
                lang === code
                  ? 'bg-brand-gold text-surface-base'
                  : 'bg-surface-elevated text-parchment hover:bg-surface-base'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
