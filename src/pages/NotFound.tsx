import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-24 flex flex-col items-center gap-4 text-center font-mono">
      <h1 className="text-2xl font-bold text-white">Página não encontrada</h1>
      <p className="text-sm text-neutral-400">
        O endereço que você acessou não existe ou foi movido.
      </p>
      <Link
        to="/"
        className="mt-2 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs px-5 py-2.5 rounded-lg uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
      >
        Voltar ao início
      </Link>
    </main>
  );
}

export default NotFoundPage;