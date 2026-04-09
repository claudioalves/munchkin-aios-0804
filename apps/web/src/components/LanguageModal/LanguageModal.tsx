import { useState } from 'react';
import type { Language } from '@/i18n/translations';
import { LANGUAGES } from '@/i18n/translations';
import { useLang } from '@/i18n/LanguageContext';

interface LanguageModalProps {
  onConfirm: () => void;
}

export function LanguageModal({ onConfirm }: LanguageModalProps) {
  const { lang, setLang, t } = useLang();
  const [selected, setSelected] = useState<Language>(lang);

  function handleConfirm() {
    setLang(selected);
    onConfirm();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface-card border border-brand-gold/40 rounded-2xl p-6 w-full max-w-xs flex flex-col gap-5">
        <div className="text-center">
          <h2 className="font-display text-brand-gold text-2xl">🌐</h2>
          <h3 className="font-heading text-parchment text-lg mt-1">{t('lang.title')}</h3>
          <p className="font-body text-parchment-muted text-xs mt-1">{t('lang.subtitle')}</p>
        </div>

        <div className="flex flex-col gap-2">
          {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, label]) => (
            <button
              key={code}
              onClick={() => setSelected(code)}
              className={`w-full text-left px-4 py-3 rounded-xl font-heading text-sm transition-colors ${
                selected === code
                  ? 'bg-brand-gold text-surface-base'
                  : 'bg-surface-elevated text-parchment hover:bg-surface-base'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-brand-gold text-surface-base font-heading font-semibold py-3 rounded-xl hover:bg-brand-gold-light transition-colors"
        >
          {t('lang.confirm')}
        </button>
      </div>
    </div>
  );
}
