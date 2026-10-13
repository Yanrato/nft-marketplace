import { useState } from 'react';
import { 
  User, 
  Wallet, 
  History, 
  Heart, 
  TrendingUp, 
  Download, 
  HelpCircle, 
  LogOut, 
  Eye, 
  EyeOff, 
  ChevronDown,
  Check
} from 'lucide-react';

interface ProfilePageProps {
  onLogout?: () => void;
}

export function ProfilePage({ onLogout }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'wallets'>('wallets'); // Pode alternar

  // 1. Dados do Perfil do Colecionador
  const [profileData, setProfileData] = useState({
    displayName: 'Alex Falconi',
    username: 'alexfalconi',
    email: 'contato@email.com',
    ensName: 'alex',
    walletNickname: 'Carteira Principal ETH',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  });

  // 2. Senhas
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirmPass: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 3. Dados da Carteira Principal
  const [primaryWallet, setPrimaryWallet] = useState({
    displayName: '',
    walletNickname: '',
    network: '',
    profileName: '',
    walletAddress: '',
    secondaryAddress: '',
    walletType: '',
    referralCode: '',
    email: '',
    ensName: '',
  });

  // 4. Carteira Secundária
  const [sameAsPrimary, setSameAsPrimary] = useState(false);

  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Carteira principal salva com sucesso!');
  };

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-8 flex flex-col gap-10 w-full font-mono text-white">
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* === SIDEBAR MEU PERFIL (3 Colunas) === */}
        <aside className="md:col-span-3 bg-[#160E0A] border border-white/5 rounded-2xl p-4 flex flex-col gap-6">
          <h2 className="text-xs font-bold text-white px-2">Meu perfil</h2>

          <nav className="flex flex-col gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left relative ${
                activeTab === 'profile' ? 'text-amber-500 bg-amber-500/10 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {activeTab === 'profile' && <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />}
              <User className="w-4 h-4 shrink-0" />
              <span>Dados do perfil</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wallets')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left relative ${
                activeTab === 'wallets' ? 'text-amber-500 bg-amber-500/10 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {activeTab === 'wallets' && <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />}
              <Wallet className="w-4 h-4 shrink-0" />
              <span>Carteiras</span>
            </button>

            <button type="button" onClick={() => alert('Fora do escopo da entrega')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white transition-colors text-left">
              <History className="w-4 h-4 shrink-0" />
              <span>Atividade</span>
            </button>

            <button type="button" onClick={() => alert('Fora do escopo da entrega')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white transition-colors text-left">
              <Heart className="w-4 h-4 shrink-0" />
              <span>Lista de interesse</span>
            </button>

            <button type="button" onClick={() => alert('Fora do escopo da entrega')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white transition-colors text-left">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Ofertas</span>
            </button>

            <button type="button" onClick={() => alert('Fora do escopo da entrega')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white transition-colors text-left">
              <Download className="w-4 h-4 shrink-0" />
              <span>Arquivos baixados</span>
            </button>

            <button type="button" onClick={() => alert('Fora do escopo da entrega')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-white transition-colors text-left">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Suporte</span>
            </button>

            <div className="pt-4 border-t border-white/5 mt-2">
              <button
                type="button"
                onClick={onLogout || (() => alert('Sessão encerrada!'))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-red-400 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sair</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* === CONTEÚDO PRINCIPAL (9 Colunas) === */}
        <section className="md:col-span-9 flex flex-col gap-8">
          
          {activeTab === 'wallets' ? (
            /* ========================================== */
            /* === ABA: CARTEIRAS (FIDELIDADE AO FIGMA) === */
            /* ========================================== */
            <div className="flex flex-col gap-10">
              
              {/* 1. Carteira Principal */}
              <form onSubmit={handleSaveWallet} className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Carteira principal</h3>
                    <button type="button" onClick={() => alert('Adicionar nova carteira')} className="text-xs text-amber-500 hover:text-amber-400">
                      Adicionar
                    </button>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Nome de exibição */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Nome de exibição<span className="text-amber-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={primaryWallet.displayName}
                      onChange={e => setPrimaryWallet({ ...primaryWallet, displayName: e.target.value })}
                      className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* Apelido da carteira */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Apelido da carteira<span className="text-amber-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={primaryWallet.walletNickname}
                      onChange={e => setPrimaryWallet({ ...primaryWallet, walletNickname: e.target.value })}
                      className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* Rede */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Rede <span className="text-amber-500">*</span></label>
                    <div className="relative">
                      <select
                        value={primaryWallet.network}
                        onChange={e => setPrimaryWallet({ ...primaryWallet, network: e.target.value })}
                        className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-300 outline-none appearance-none cursor-pointer focus:border-amber-600"
                      >
                        <option value="">Selecione uma rede</option>
                        <option value="Ethereum">Ethereum</option>
                        <option value="Polygon">Polygon</option>
                        <option value="Solana">Solana</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Nome do perfil */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Nome do perfil<span className="text-amber-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={primaryWallet.profileName}
                      onChange={e => setPrimaryWallet({ ...primaryWallet, profileName: e.target.value })}
                      className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* Endereço da carteira */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Endereço da carteira<span className="text-amber-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Endereço 0x da carteira"
                      value={primaryWallet.walletAddress}
                      onChange={e => setPrimaryWallet({ ...primaryWallet, walletAddress: e.target.value })}
                      className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* ENS ou carteira secundária */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">ENS ou carteira secundária (opcional)</label>
                    <input
                      type="text"
                      value={primaryWallet.secondaryAddress}
                      onChange={e => setPrimaryWallet({ ...primaryWallet, secondaryAddress: e.target.value })}
                      className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* Tipo de carteira */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Tipo de carteira<span className="text-amber-500">*</span></label>
                    <div className="relative">
                      <select
                        value={primaryWallet.walletType}
                        onChange={e => setPrimaryWallet({ ...primaryWallet, walletType: e.target.value })}
                        className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-300 outline-none appearance-none cursor-pointer focus:border-amber-600"
                      >
                        <option value="">Selecione uma carteira</option>
                        <option value="MetaMask">MetaMask</option>
                        <option value="Coinbase">Coinbase Wallet</option>
                        <option value="WalletConnect">WalletConnect</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Código de indicação */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Código de indicação<span className="text-amber-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={primaryWallet.referralCode}
                      onChange={e => setPrimaryWallet({ ...primaryWallet, referralCode: e.target.value })}
                      className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* E-mail */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">E-mail<span className="text-amber-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={primaryWallet.email}
                      onChange={e => setPrimaryWallet({ ...primaryWallet, email: e.target.value })}
                      className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
                    />
                  </div>

                  {/* Nome ENS */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Nome ENS <span className="text-amber-500">*</span></label>
                    <div className="relative flex">
                      <span className="bg-[#241710] border border-r-0 border-white/10 px-3 py-2.5 text-xs text-neutral-300 rounded-l-md flex items-center gap-1">
                        .eth <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </span>
                      <input
                        type="text"
                        value={primaryWallet.ensName}
                        onChange={e => setPrimaryWallet({ ...primaryWallet, ensName: e.target.value })}
                        className="w-full bg-[#1A110B] border border-white/10 rounded-r-md px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs px-6 py-2.5 rounded-md uppercase tracking-wider transition-colors shadow-md"
                  >
                    Salvar carteira
                  </button>
                </div>
              </form>

              {/* 2. Carteira Secundária */}
              <div className="border-t border-white/5 pt-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-white">Carteira secundária</h3>
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                      <span 
                        onClick={() => setSameAsPrimary(!sameAsPrimary)}
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                          sameAsPrimary ? 'border-amber-500 bg-amber-500' : 'border-neutral-500'
                        }`}
                      >
                        {sameAsPrimary && <Check className="w-2.5 h-2.5 text-black" />}
                      </span>
                      <span>Igual à carteira principal</span>
                    </label>
                    <button type="button" onClick={() => alert('Adicionar carteira secundária')} className="text-amber-500 hover:text-amber-400 font-bold">
                      Adicionar
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-400">
                  Você ainda não adicionou uma carteira secundária.
                </p>
              </div>

            </div>
          ) : (
            /* ========================================== */
            /* === ABA: DADOS DO PERFIL (DO OUTRO PRINT) === */
            /* ========================================== */
            <form onSubmit={e => { e.preventDefault(); alert('Perfil salvo!'); }} className="flex flex-col gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">
                  Perfil do colecionador
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Nome de exibição*</label>
                    <input type="text" value={profileData.displayName} onChange={e => setProfileData({ ...profileData, displayName: e.target.value })} className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Nome de usuário*</label>
                    <input type="text" value={profileData.username} onChange={e => setProfileData({ ...profileData, username: e.target.value })} className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">E-mail*</label>
                    <input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Nome ENS*</label>
                    <div className="flex">
                      <span className="bg-[#241710] border border-r-0 border-white/10 px-3 py-2.5 text-xs text-neutral-300 rounded-l-md">.eth</span>
                      <input type="text" value={profileData.ensName} onChange={e => setProfileData({ ...profileData, ensName: e.target.value })} className="w-full bg-[#1A110B] border border-white/10 rounded-r-md px-3 py-2.5 text-xs text-neutral-200 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-300">Apelido da carteira*</label>
                    <input type="text" value={profileData.walletNickname} onChange={e => setProfileData({ ...profileData, walletNickname: e.target.value })} className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 block">Avatar</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                        <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <button type="button" onClick={() => alert('Alterar avatar')} className="bg-amber-600 text-black font-bold text-xs px-4 py-2 rounded-md">Alterar</button>
                      <button type="button" onClick={() => setProfileData({ ...profileData, avatarUrl: '' })} className="text-xs text-neutral-400 hover:text-white">Remover</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alterar Senha */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-white">Alterar senha</h3>
                <div className="space-y-3 max-w-md text-xs">
                  <div className="relative">
                    <input type={showCurrent ? 'text' : 'password'} placeholder="Senha atual" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">{showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                  </div>
                  <div className="relative">
                    <input type={showNew ? 'text' : 'password'} placeholder="Nova senha" value={passwords.newPass} onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none" />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">{showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                  </div>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} placeholder="Confirmar nova senha" value={passwords.confirmPass} onChange={e => setPasswords({ ...passwords, confirmPass: e.target.value })} className="w-full bg-[#1A110B] border border-white/10 rounded-md px-3 py-2.5 text-xs text-neutral-200 outline-none" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">{showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                  </div>
                </div>
              </div>

              <div>
                <button type="submit" className="bg-amber-600 text-black font-bold text-xs px-8 py-3 rounded-md uppercase">Salvar</button>
              </div>
            </form>
          )}

        </section>

      </div>

    </main>
  );
}

export default ProfilePage;