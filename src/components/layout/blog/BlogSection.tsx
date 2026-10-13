import { ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Como funciona a propriedade de NFTs',
    summary: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    date: '12 de setembro',
    readTime: '6 min',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: 'post-2',
    title: '10 artistas digitais para acompanhar',
    summary: 'Conheça criadores que moldam a cultura digital.',
    date: '13 de setembro',
    readTime: '2 min',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: 'post-3',
    title: 'Raridade, atributos e procedência',
    summary: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    date: '15 de setembro',
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: 'post-4',
    title: 'Como proteger sua carteira',
    summary: 'Proteja sua carteira, seus ativos e sua identidade.',
    date: '15 de setembro',
    readTime: '2 min',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
  },
];

export function BlogSection() {
  return (
    <section aria-labelledby="blog-title" className="w-full bg-[#140D0A] px-6 md:px-12 lg:px-24 py-16 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center space-y-3 font-mono">
          <h2 id="blog-title" className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Diário da Cunhagem
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        {/* Grade de 4 Artigos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col rounded-2xl overflow-hidden bg-[#1C120C] border border-white/5 hover:border-amber-900/40 transition-colors shadow-lg cursor-pointer"
            >
              {/* Imagem de Capa */}
              <div className="w-full aspect-square overflow-hidden bg-neutral-900">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Informações do Post */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4 font-mono">
                <div className="space-y-2.5">
                  {/* Data e Tempo de Leitura */}
                  <span className="text-[11px] text-neutral-400 block">
                    {post.date} &nbsp;|&nbsp; Leitura de {post.readTime}
                  </span>

                  {/* Título */}
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-500 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  {/* Resumo */}
                  <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                </div>

                {/* Link Ler mais */}
                <div className="pt-2 border-t border-white/5">
                  <span className="text-xs font-semibold text-amber-500 hover:text-amber-400 inline-flex items-center gap-1 transition-colors">
                    Ler mais <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default BlogSection;