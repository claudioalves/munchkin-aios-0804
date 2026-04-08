import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-8 gap-8">
      <header className="text-center space-y-2">
        <h1 className="font-display text-4xl text-brand-gold">
          Munchkin
        </h1>
        <p className="font-heading text-parchment-muted tracking-widest text-sm uppercase">
          Level Tracker
        </p>
      </header>

      <nav className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          to="/new-game"
          className="bg-brand-gold text-surface-base font-heading font-semibold px-6 py-4 rounded-xl text-center hover:bg-brand-gold-light transition-colors shadow-glow-gold text-lg"
        >
          Novo Jogo
        </Link>
        <Link
          to="/players"
          className="border border-brand-gold text-brand-gold font-heading px-6 py-4 rounded-xl text-center hover:bg-surface-elevated transition-colors text-lg"
        >
          Gerenciar Jogadores
        </Link>
      </nav>
    </div>
  );
}
