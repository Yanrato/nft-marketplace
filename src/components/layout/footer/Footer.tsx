import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Inscrição recebida para: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#140D0A] text-white border-t border-white/10 pt-16 pb-8 font-mono">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col gap-12">
        
        {/* === 1. PILARES DE CONFIANÇA + NEWSLETTER === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/5">
          
          {/* Pilar 1: Segurança */}
          <div className="flex flex-col gap-3 lg:border-r lg:border-white/10 lg:pr-6">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-neutral-950 font-extrabold flex items-center justify-center text-sm shadow-md">
              W
            </div>
            <h4 className="text-xs font-bold text-white tracking-wide">
              Segurança da carteira
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Proteja sua carteira e colecione arte digital verificada com confiança.
            </p>
          </div>

          {/* Pilar 2: Criadores */}
          <div className="flex flex-col gap-3 lg:border-r lg:border-white/10 lg:pr-6">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-neutral-950 font-extrabold flex items-center justify-center text-sm shadow-md">
              C
            </div>
            <h4 className="text-xs font-bold text-white tracking-wide">
              Criadores em destaque
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
            </p>
          </div>

          {/* Pilar 3: Alertas */}
          <div className="flex flex-col gap-3 lg:border-r lg:border-white/10 lg:pr-6">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-neutral-950 font-extrabold flex items-center justify-center text-sm shadow-md">
              D
            </div>
            <h4 className="text-xs font-bold text-white tracking-wide">
              Alertas de lançamentos
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
            </p>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white leading-tight">
              Antecipe-se ao próximo <br /> lançamento
            </h4>
            
            <form onSubmit={handleNewsletterSubmit} className="flex mt-1">
              <input
                type="email"
                placeholder="digite seu e-mail..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#241710] border border-white/5 rounded-l-md px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 outline-none w-full focus:border-amber-600 transition-colors"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs px-4 py-2 rounded-r-md transition-colors shrink-0"
              >
                Enviar
              </button>
            </form>

            <p className="text-[10px] text-neutral-400 leading-normal">
              Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
            </p>
          </div>

        </div>

        {/* === 2. FAIXA INTERMEDIÁRIA INSTITUCIONAL === */}
        <div className="py-4 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <div className="font-bold tracking-[0.25em] text-white text-sm">
            KURIO
          </div>
          <div className="text-neutral-400 text-[11px]">
            Feito para colecionadores, criadores e cultura
          </div>
          <a href="mailto:contato@email.com" className="text-neutral-300 hover:text-white transition-colors text-[11px]">
            contato@email.com
          </a>
          <div className="text-neutral-300 text-[11px]">
            +55 11 4002 8922
          </div>
        </div>

        {/* === 3. LINKS DO MAPA DO SITE, REDES E CARTEIRAS === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
          
          {/* Coluna 1: Meu Perfil */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white">Meu perfil</h5>
            <ul className="space-y-2 text-[11px] text-neutral-400">
              <li><a href="#perfil" className="hover:text-white transition-colors">Meu perfil</a></li>
              <li><a href="#colecao" className="hover:text-white transition-colors">Minha coleção</a></li>
              <li><a href="#atividade" className="hover:text-white transition-colors">Atividade</a></li>
              <li><a href="#estudio" className="hover:text-white transition-colors">Estúdio do criador</a></li>
              <li><a href="#interesse" className="hover:text-white transition-colors">Lista de interesse</a></li>
            </ul>
          </div>

          {/* Coluna 2: Central de Ajuda */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white">Central de ajuda</h5>
            <ul className="space-y-2 text-[11px] text-neutral-400">
              <li><a href="#ajuda" className="hover:text-white transition-colors">Central de ajuda</a></li>
              <li><a href="#como-comprar" className="hover:text-white transition-colors">Como comprar NFTs</a></li>
              <li><a href="#carteira" className="hover:text-white transition-colors">Carteira e segurança</a></li>
              <li><a href="#politica" className="hover:text-white transition-colors">Política do mercado</a></li>
              <li><a href="#denunciar" className="hover:text-white transition-colors">Denunciar item</a></li>
            </ul>
          </div>

          {/* Coluna 3: Coleções */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white">Coleções</h5>
            <ul className="space-y-2 text-[11px] text-neutral-400">
              <li><a href="#arte-digital" className="hover:text-white transition-colors">Arte digital</a></li>
              <li><a href="#fotografia" className="hover:text-white transition-colors">Fotografia</a></li>
              <li><a href="#musica" className="hover:text-white transition-colors">Música</a></li>
              <li><a href="#arte-3d" className="hover:text-white transition-colors">Arte 3D</a></li>
              <li><a href="#utilidade" className="hover:text-white transition-colors">Utilidade</a></li>
            </ul>
          </div>

          {/* Coluna 4: Redes Sociais e Carteiras */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-white">Redes sociais</h5>
              <div className="flex items-center gap-2">
                {['f', '📸', '𝕏', 'in', '▶'].map((icon, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-7 h-7 rounded border border-white/10 flex items-center justify-center text-xs text-neutral-300 hover:border-amber-500 hover:text-amber-500 transition-colors"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-bold text-white">Carteiras compatíveis</h5>
              <div className="inline-block bg-[#241710] border border-amber-900/40 px-3 py-1.5 rounded-md">
                <span className="text-[10px] text-amber-500 font-bold tracking-wider">
                  METAMASK &nbsp;•&nbsp; WALLETCONNECT &nbsp;•&nbsp; COINBASE
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* === 4. COPYRIGHT FINAL === */}
        <div className="pt-8 border-t border-white/5 text-center text-[11px] text-neutral-500">
          © 2026 Kurio. Propriedade digital para todos.
        </div>

      </div>
    </footer>
  );
}

export default Footer;