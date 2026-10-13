import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (usernameOrEmail: string) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('register'); // pode iniciar em 'register' ou 'login'

  // Estados de formulário
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
      alert(`Conta criada com sucesso para: ${username} (${email})`);
      onSuccess?.(username);
    } else {
      alert(`Login simulado com sucesso para: ${email}`);
      onSuccess?.(email);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono text-white animate-in fade-in duration-200">
      
      {/* Container Central da Modal */}
      <div className="relative w-full max-w-[420px] bg-[#160E0A] border border-amber-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5 overflow-hidden">
        
        {/* Borda decorativa âmbar inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600" />

        {/* Botão Fechar (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5 text-amber-600 hover:text-amber-500" />
        </button>

        {/* 1. Abas: Entrar | Criar conta */}
        <div className="flex items-center justify-center gap-3 text-lg font-bold pt-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`transition-colors ${mode === 'login' ? 'text-amber-500 font-bold' : 'text-neutral-300 hover:text-white'}`}
          >
            Entrar
          </button>
          <span className="text-neutral-600">|</span>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`transition-colors ${mode === 'register' ? 'text-amber-500 font-bold' : 'text-neutral-300 hover:text-white'}`}
          >
            Criar conta
          </button>
        </div>

        {/* Subtítulo dinâmico */}
        <p className="text-xs text-neutral-400 text-center leading-relaxed max-w-[320px] mx-auto">
          {mode === 'register'
            ? 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'
            : 'Entre para gerenciar sua carteira, coleção e perfil de criador.'}
        </p>

        {/* 2. Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 pt-1">
          
          {/* MODO CRIAR CONTA */}
          {mode === 'register' ? (
            <>
              {/* Nome de usuário */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1F140D] border border-white/10 rounded-lg px-3.5 py-3 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              {/* Digite seu e-mail */}
              <div>
                <input
                  type="email"
                  required
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1F140D] border border-white/10 rounded-lg px-3.5 py-3 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              {/* Senha com olhinho */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1F140D] border border-white/10 rounded-lg px-3.5 py-3 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-amber-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirmar senha */}
              <div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#1F140D] border border-white/10 rounded-lg px-3.5 py-3 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              {/* Botão Criar conta */}
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs py-3.5 rounded-lg uppercase tracking-wider transition-colors shadow-md mt-1 cursor-pointer"
              >
                Criar conta
              </button>
            </>
          ) : (
            /* MODO ENTRAR (LOGIN) */
            <>
              {/* E-mail */}
              <div>
                <input
                  type="email"
                  required
                  placeholder="contato@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1F140D] border border-white/10 rounded-lg px-3.5 py-3 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-amber-600 transition-colors"
                />
              </div>

              {/* Senha */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1F140D] border border-amber-600/60 rounded-lg px-3.5 py-3 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-amber-500 transition-colors tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Esqueceu a senha */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Recuperação de senha simulada!')}
                  className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs py-3.5 rounded-lg uppercase tracking-wider transition-colors shadow-md mt-1 cursor-pointer"
              >
                Entrar
              </button>
            </>
          )}

        </form>

        {/* 3. Divisória Ou continue com */}
        <div className="relative flex items-center justify-center my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-[#160E0A] px-3 text-[11px] text-neutral-400">
            Ou continue com
          </span>
        </div>

        {/* 4. Logins Sociais */}
        <div className="flex flex-col gap-2.5">
          {/* Google */}
          <button
            type="button"
            onClick={() => alert('Login com Google')}
            className="w-full bg-[#1F140D] border border-white/10 hover:border-white/20 text-neutral-200 text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continuar com Google</span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={() => alert('Login com Facebook')}
            className="w-full bg-[#1F140D] border border-white/10 hover:border-white/20 text-neutral-200 text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
          >
            <span className="text-[#1877F2] font-bold text-base leading-none">f</span>
            <span>Continuar com Facebook</span>
          </button>
        </div>

      </div>

    </div>
  );
}

export default AuthModal;