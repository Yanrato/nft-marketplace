import { useState, useRef, type FormEvent } from "react";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/features/cart/useCart";
import { createOrder, type CheckoutCustomer } from "@/features/checkout/api";
import { useMutation } from "@tanstack/react-query";

const LAST_ORDER_KEY = "kurio_last_order";

const initialForm: CheckoutCustomer = {
  displayName: "",
  username: "",
  network: "Ethereum",
  profileName: "",
  walletAddress: "",
  secondaryWallet: "",
  walletType: "Coinbase",
  referralCode: "",
  email: "",
  ensName: "",
  useOtherWallet: false,
  notes: "",
};


const inputClass =
  "w-full rounded-md border border-white/10 bg-[#1A110B] px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-600";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const idempotencyKey = useRef(crypto.randomUUID());

  const [formData, setFormData] =
    useState<CheckoutCustomer>(initialForm);

  const [errorMessage, setErrorMessage] = useState("");

  const networkFee = items.length > 0 ? 0.016 : 0;

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const total = subtotal + networkFee;

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      try {
        localStorage.setItem(
          LAST_ORDER_KEY,
          JSON.stringify(order)
        );
      } catch {
        setErrorMessage(
          "O pedido foi criado, mas não foi possível salvar os dados da confirmação neste navegador."
        );
        return;
      }

      clearCart();
      navigate({ to: "/confirmacao" });
    },
    onError: () => {
      setErrorMessage(
        "Não foi possível registrar o pedido. Verifique os dados e tente novamente."
      );
    },
  });

  function updateField<K extends keyof CheckoutCustomer>(
    field: K,
    value: CheckoutCustomer[K]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage(
        "Seu carrinho está vazio. Adicione um NFT antes de continuar."
      );
      return;
    }

    if (
      !formData.displayName.trim() ||
      !formData.username.trim() ||
      !formData.profileName.trim() ||
      !formData.walletAddress.trim() ||
      !formData.email.trim()
    ) {
      setErrorMessage("Preencha todos os campos obrigatórios.");
      return;
    }

    mutation.mutate({
      idempotencyKey: idempotencyKey.current,
      customer: {
        ...formData,
        displayName: formData.displayName.trim(),
        username: formData.username.trim(),
        profileName: formData.profileName.trim(),
        walletAddress: formData.walletAddress.trim(),
        email: formData.email.trim(),
      },
      items,
    });
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 py-20 text-center font-mono text-white">
        <h1 className="text-lg font-bold">Seu carrinho está vazio</h1>
        <p className="text-xs text-neutral-400">
          Adicione um NFT antes de iniciar o checkout.
        </p>
        <Link
          to="/"
          className="rounded-lg bg-amber-600 px-5 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-500"
        >
          Explorar NFTs
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-8 font-mono text-white md:px-12 lg:px-24">
      <nav aria-label="Breadcrumb" className="text-xs text-neutral-400">
        <Link to="/" className="hover:text-white">
          Início
        </Link>
        <span className="mx-2">/</span>
        <Link to="/carrinho" className="hover:text-white">
          Carrinho
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-200">Checkout</span>
      </nav>

      <h1 className="text-lg font-bold">Finalizar compra</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12"
      >
        <section className="flex flex-col gap-5 lg:col-span-7">
          <h2 className="text-sm font-bold">
            Perfil do colecionador
          </h2>

          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="block text-neutral-300">
                Nome de exibição *
              </span>
              <input
                required
                autoComplete="name"
                value={formData.displayName}
                onChange={(e) => updateField("displayName", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-neutral-300">
                Nome de usuário *
              </span>
              <input
                required
                autoComplete="username"
                value={formData.username}
                onChange={(e) => updateField("username", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-neutral-300">
                Rede *
              </span>
              <div className="relative">
                <select
                  value={formData.network}
                  onChange={(e) =>
                    updateField(
                      "network",
                      e.target.value as CheckoutCustomer["network"]
                    )
                  }
                  className={`${inputClass} appearance-none`}
                >
                  <option value="Ethereum">Ethereum</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Solana">Solana</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              </div>
            </label>

            <label className="space-y-1.5">
              <span className="block text-neutral-300">
                Nome do perfil *
              </span>
              <input
                required
                value={formData.profileName}
                onChange={(e) => updateField("profileName", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="block text-neutral-300">
                Endereço da carteira *
              </span>
              <input
                required
                minLength={10}
                autoComplete="off"
                placeholder="Endereço público da sua carteira"
                value={formData.walletAddress}
                onChange={(e) =>
                  updateField("walletAddress", e.target.value)
                }
                className={inputClass}
              />
              <span className="block text-[10px] text-neutral-500">
                Informe apenas o endereço público. Nunca informe sua frase
                de recuperação ou chave privada.
              </span>
            </label>

            <label className="space-y-1.5">
              <span className="block text-neutral-300">
                Carteira secundária (opcional)
              </span>
              <input
                value={formData.secondaryWallet}
                onChange={(e) =>
                  updateField("secondaryWallet", e.target.value)
                }
                className={inputClass}
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-neutral-300">
                Tipo de carteira *
              </span>
              <select
                value={formData.walletType}
                onChange={(e) =>
                  updateField(
                    "walletType",
                    e.target.value as CheckoutCustomer["walletType"]
                  )
                }
                className={inputClass}
              >
                <option value="Coinbase">Coinbase Wallet</option>
                <option value="MetaMask">MetaMask</option>
                <option value="WalletConnect">WalletConnect</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="block text-neutral-300">
                E-mail *
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-neutral-300">
                Código de indicação (opcional)
              </span>
              <input
                value={formData.referralCode}
                onChange={(e) =>
                  updateField("referralCode", e.target.value)
                }
                className={inputClass}
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-neutral-300">
                Nome ENS (opcional)
              </span>
              <input
                placeholder="seu-nome.eth"
                value={formData.ensName}
                onChange={(e) => updateField("ensName", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="flex items-center gap-2 text-neutral-300 sm:col-span-2">
              <input
                type="checkbox"
                checked={formData.useOtherWallet}
                onChange={(e) =>
                  updateField("useOtherWallet", e.target.checked)
                }
                className="accent-amber-500"
              />
              Usar outra carteira
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="block text-neutral-300">
                Observações (opcional)
              </span>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </label>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-300"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending || items.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-950 transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending && (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            )}
            {mutation.isPending ? "Registrando pedido..." : "Confirmar compra"}
          </button>
        </section>

        <aside className="flex flex-col gap-5 rounded-xl border border-white/10 bg-[#1C120C] p-5 lg:col-span-5">
          <h2 className="text-sm font-bold">Resumo do pedido</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 text-xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg border border-white/10 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{item.name}</p>
                  <p className="text-neutral-400">
                    Edição {item.edition} · Quantidade {item.quantity}
                  </p>
                  <p className="text-neutral-500">
                    {Number(item.price).toFixed(3)} ETH por unidade
                  </p>
                </div>
                <span className="shrink-0 font-bold text-amber-500">
                  {(Number(item.price) * item.quantity).toFixed(3)} ETH
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Subtotal</span>
              <span>{subtotal.toFixed(3)} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Taxa de rede estimada</span>
              <span>{networkFee.toFixed(3)} ETH</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-4 text-sm font-bold">
              <span>Total</span>
              <span className="text-amber-500">
                {total.toFixed(3)} ETH
              </span>
            </div>
          </div>

          <Link
            to="/carrinho"
            className="text-center text-xs text-neutral-400 hover:text-white"
          >
            Voltar ao carrinho
          </Link>
        </aside>
      </form>
    </main>
  );
}

export default CheckoutPage;
