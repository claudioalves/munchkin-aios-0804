import { useState } from 'react';

interface ShareModalProps {
  gameId: string;
  onClose: () => void;
}

export function ShareModal({ gameId, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const spectateUrl = `${window.location.origin}/spectate/${gameId}`;
  const whatsappText = encodeURIComponent(
    `👾 Estou jogando Munchkin! Acompanhe a partida ao vivo:\n${spectateUrl}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(spectateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-card border border-brand-gold/40 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-brand-gold text-lg">Compartilhar Partida</h2>
          <button
            onClick={onClose}
            className="text-parchment-muted hover:text-parchment transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <p className="font-body text-parchment-muted text-sm">
          Envie o link abaixo para amigos acompanharem a partida em tempo real.
        </p>

        {/* Link */}
        <div className="flex items-center gap-2 bg-surface-base rounded-lg px-3 py-2 border border-surface-border">
          <span className="font-body text-parchment-dim text-xs truncate flex-1">
            {spectateUrl}
          </span>
          <button
            onClick={handleCopy}
            className="font-heading text-brand-gold text-xs whitespace-nowrap hover:text-brand-gold-light transition-colors"
          >
            {copied ? '✓ Copiado' : '📋 Copiar'}
          </button>
        </div>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] transition-colors rounded-xl py-3 px-4 font-heading font-semibold text-white text-sm"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Compartilhar no WhatsApp
        </a>

        {/* Share nativa (se suportada) */}
        {typeof navigator.share === 'function' && (
          <button
            onClick={() => {
              void navigator.share({
                title: 'Munchkin — Acompanhe a partida',
                text: '👾 Estou jogando Munchkin! Acompanhe ao vivo:',
                url: spectateUrl,
              });
            }}
            className="flex items-center justify-center gap-2 border border-surface-border rounded-xl py-3 px-4 font-heading text-parchment-muted text-sm hover:border-brand-gold/40 hover:text-parchment transition-colors"
          >
            ↗ Outras opções
          </button>
        )}
      </div>
    </div>
  );
}
