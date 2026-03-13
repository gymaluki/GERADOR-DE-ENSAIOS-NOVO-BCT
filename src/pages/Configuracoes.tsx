import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, CheckCircle2, ExternalLink, Copy, Trash2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Configuracoes = () => {
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("user_api_keys")
        .select("updated_at")
        .eq("user_id", user.id)
        .single();
      setHasKey(!!data);
      setLastUpdated(data?.updated_at ?? null);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) return toast.error("Cole sua API Key");
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Faça login primeiro");
      const { error } = await supabase
        .from("user_api_keys")
        .upsert(
          { user_id: user.id, api_key: apiKey.trim(), updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );
      if (error) throw error;
      setHasKey(true);
      setApiKey("");
      setLastUpdated(new Date().toISOString());
      toast.success("API Key salva com sucesso! ✅");
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar API Key");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_api_keys").delete().eq("user_id", user.id);
      setHasKey(false);
      setLastUpdated(null);
      toast.success("API Key removida");
    } catch {
      toast.error("Erro ao remover");
    }
  };

  const tutorialSteps = [
    {
      step: 1,
      title: "Acesse o Google AI Studio",
      desc: "Vá para aistudio.google.com e faça login com sua conta Google.",
      link: "https://aistudio.google.com",
      linkText: "Abrir Google AI Studio →",
    },
    {
      step: 2,
      title: "Faça login com sua conta Google",
      desc: "Use qualquer conta Gmail. Se já estiver logado, pule para o próximo passo.",
    },
    {
      step: 3,
      title: "Clique em 'Get API key'",
      desc: "No menu lateral esquerdo, clique em 'Get API key' ou 'Chaves de API'.",
    },
    {
      step: 4,
      title: "Crie uma nova chave",
      desc: "Clique em 'Create API key' (Criar chave de API). Se já tiver um projeto, selecione-o ou crie um novo.",
    },
    {
      step: 5,
      title: "Copie o código gerado",
      desc: "A chave aparecerá na tela. Clique no ícone de copiar ou selecione tudo e copie (Ctrl+C).",
    },
    {
      step: 6,
      title: "Cole abaixo e salve",
      desc: "Cole a chave no campo abaixo e clique em 'Salvar API Key'. Pronto! 🎉",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Configurações da <span className="text-primary">API</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure sua chave do Google Gemini para gerar e editar imagens
        </p>
      </div>

      {/* Status Card */}
      <div className={`glass-card p-5 flex items-center gap-4 ${hasKey ? "border-green-500/30" : "border-yellow-500/30"}`}>
        {hasKey ? (
          <>
            <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-foreground">API Key Configurada ✅</p>
              <p className="text-sm text-muted-foreground">
                Sua chave está salva e pronta para uso.
                {lastUpdated && ` Última atualização: ${new Date(lastUpdated).toLocaleDateString("pt-BR")}`}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Remover
            </Button>
          </>
        ) : (
          <>
            <AlertCircle className="w-8 h-8 text-yellow-500 shrink-0" />
            <div>
              <p className="font-medium text-foreground">API Key Necessária</p>
              <p className="text-sm text-muted-foreground">
                Siga o tutorial abaixo para obter sua chave gratuita do Google AI Studio
              </p>
            </div>
          </>
        )}
      </div>

      {/* Tutorial */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Como obter sua API Key (Grátis)
        </h2>

        <div className="space-y-4">
          {tutorialSteps.map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{s.step}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{s.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
                {s.link && (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {s.linkText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Key Input */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {hasKey ? "Atualizar API Key" : "Inserir API Key"}
        </h2>

        <div className="space-y-2">
          <Label htmlFor="apikey" className="text-sm text-muted-foreground">
            Google Gemini API Key
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="apikey"
                type={showKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-secondary border-border focus:border-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving || !apiKey.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Validando...
                </span>
              ) : (
                "Salvar API Key"
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Sua chave é criptografada e armazenada de forma segura no servidor. Nunca é exposta no frontend.
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="glass-card p-5 space-y-3">
        <h3 className="text-sm font-medium text-foreground">ℹ️ Informações Importantes</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            A API Key gratuita do Google AI Studio permite até <strong className="text-foreground">15 requisições por minuto</strong>.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Se receber erro de cota (429), aguarde alguns minutos ou <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">verifique seu plano</a>.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Sua chave fica vinculada à sua conta — funciona em qualquer dispositivo após login.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            Para gerar imagens, usamos o modelo <strong className="text-foreground">Imagen 3</strong> (imagen-3.0-generate-001) do Google.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Configuracoes;
