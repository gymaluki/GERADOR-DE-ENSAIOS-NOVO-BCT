import { DollarSign, MessageCircle, Lightbulb, Package, Megaphone, Target, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Script copiado!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="absolute top-3 right-3 p-2 rounded-lg bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground transition-all">
      {copied ? <CheckCheck className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const scriptTrafego = `Temos pacotes com 15 ou 30 fotos personalizadas.

✨ Você me envia algumas fotos suas (usadas só para treinar a ferramenta).

✨ Depois, te mando referências do seu nicho para você escolher o estilo que mais gostar.

✨ A partir disso, criamos um ensaio completo com fotos super realistas e profissionais.

Para você ter uma noção, vou te mandar algumas fotos que já criei recentemente. Assim você consegue ver como fica o resultado final. 📸`;

const script1 = `Opa, [Nome]! Tudo bem? Estava vendo seu perfil e achei seu conteúdo excelente. Mas notei que sua foto de perfil não está passando a autoridade que seu trabalho merece.

Eu trabalho com Ensaios Fotográficos de IA e consigo criar 20 fotos suas em estúdios de luxo, sem você precisar sair de casa ou gastar R$ 2.000 com fotógrafo.

Toparia que eu fizesse uma amostra gratuita de uma foto sua agora, só para você ver o nível da tecnologia?`;

const script2 = `(Manda a foto gerada) Dá uma olhada nisso, [Nome]! Fiz essa versão sua em um escritório executivo em 30 segundos.

Imagina ter 20 fotos nesse nível para postar no LinkedIn, WhatsApp e Instagram. No estúdio você pagaria uma fortuna, comigo o pack completo com 20 cenários diferentes está saindo por apenas R$ 97,00 hoje.

Posso gerar o restante para você?`;

const script3 = `Oi, [Nome]! Vi que você postou essa foto com sua família, que lembrança linda! Notei que ela está um pouco sem nitidez.

Eu tenho uma ferramenta de IA que restaura fotos antigas e deixa em qualidade 4K. Fiz um teste rápido para você ver: (Manda a foto restaurada).

Se você quiser, eu restauro outras 5 fotos suas e ainda crio 5 versões suas com estilo 'Ensaio de Luxo' por apenas R$ 47,00. O que acha?`;

const Treinamento = () => {
  return (
    <div className="space-y-8 fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Treinamento & <span className="text-primary">Vendas</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Pacotes recomendados, scripts prontos e dicas para vender ensaios com IA
        </p>
      </div>

      {/* Estratégia de Tráfego Pago */}
      <div className="glass-card p-6 space-y-4 gold-glow">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground">🚀 Estratégia de Captação com Tráfego Pago</h2>
            <p className="text-xs text-muted-foreground">Como conseguir clientes fáceis usando anúncios</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-sm text-foreground font-medium mb-2">📢 Passo 1: Faça Tráfego Pago</p>
            <p className="text-xs text-muted-foreground">
              Crie anúncios no Instagram/Facebook mostrando antes e depois dos ensaios. Direcione tudo para o seu WhatsApp. 
              O cliente já chega quente e pronto para comprar!
            </p>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-sm text-foreground font-medium mb-2">🎓 Passo 2: Aprenda o Básico</p>
            <p className="text-xs text-muted-foreground">
              Acesse conteúdos no YouTube para aprender o básico de tráfego pago. Pesquise por "como fazer tráfego pago no Instagram" 
              e "como criar anúncios no Facebook Ads". Com R$ 10-20/dia você já consegue resultados!
            </p>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 relative">
            <CopyButton text={scriptTrafego} />
            <p className="text-sm text-foreground font-medium mb-2">💬 Passo 3: Quando o Cliente Mandar Mensagem</p>
            <p className="text-xs text-muted-foreground mb-3">
              Após o cliente entrar em contato pelo anúncio, envie o seguinte script:
            </p>
            <div className="bg-background/50 rounded-lg p-4 text-sm text-foreground leading-relaxed whitespace-pre-line border border-border/50">
              {scriptTrafego}
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">⚠️ Importante:</strong> Remodele esses scripts do jeito que achar melhor pro seu negócio. 
            Isso são apenas dicas e sugestões para você adaptar à sua realidade!
          </p>
        </div>
      </div>

      {/* Pacotes de Venda */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground">Valores para Vender os Pacotes</h2>
            <p className="text-xs text-muted-foreground">Preços recomendados para revenda</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Pacote</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Nome Sugerido</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">O que entregar</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium">Preço de Venda</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-3"><span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-md">Básico</span></td>
                <td className="py-3 px-3 text-foreground font-medium">Express Profissional</td>
                <td className="py-3 px-3 text-muted-foreground">5 Fotos (Mesmo cenário)</td>
                <td className="py-3 px-3 text-right font-bold text-primary">R$ 47,00</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-3"><span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-md">Premium</span></td>
                <td className="py-3 px-3 text-foreground font-medium">Autoridade Digital</td>
                <td className="py-3 px-3 text-muted-foreground">15 Fotos (3 Cenários diferentes)</td>
                <td className="py-3 px-3 text-right font-bold text-primary">R$ 97,00</td>
              </tr>
              <tr>
                <td className="py-3 px-3"><span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-md">Gold</span></td>
                <td className="py-3 px-3 text-foreground font-medium">Ensaio de Marca 2026</td>
                <td className="py-3 px-3 text-muted-foreground">30 Fotos + Restauração de 3 fotos</td>
                <td className="py-3 px-3 text-right font-bold text-primary">R$ 197,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Scripts de Vendas */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground">Scripts de Vendas no WhatsApp</h2>
            <p className="text-xs text-muted-foreground">Copie e use direto no X1 com seus clientes</p>
          </div>
        </div>

        {[
          { title: 'Script 1: A Abordagem "Quebra-Gelo"', subtitle: "Ideal para abordar advogados, médicos, corretores ou donos de negócios no Instagram.", text: script1 },
          { title: 'Script 2: O Fechamento "Efeito Uau"', subtitle: "Use este script depois que a pessoa mandar a foto e você gerar no seu app.", text: script2 },
          { title: 'Script 3: O Script para "Restauração de Memórias"', subtitle: "Ideal para abordar pessoas que postam fotos antigas ou em baixa qualidade.", text: script3 },
        ].map((s, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-foreground text-sm">{s.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground italic">{s.subtitle}</p>
            <div className="bg-secondary/50 rounded-xl p-4 text-sm text-foreground leading-relaxed relative whitespace-pre-line">
              <CopyButton text={s.text} />
              {s.text}
            </div>
          </div>
        ))}
      </div>

      {/* Dicas de Ouro */}
      <div className="glass-card p-6 space-y-4 gold-glow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display font-bold text-foreground">💡 Dicas de Ouro para o Revendedor</h2>
        </div>

        <div className="space-y-3">
          {[
            { icon: "🚫", title: "Nunca mande o preço de cara", desc: "Sempre peça a foto primeiro para fazer a \"amostra\". A venda acontece quando a pessoa se vê bonita na tela." },
            { icon: "🎙️", title: "Use Áudio", desc: "No X1, um áudio de 20 segundos explicando a tecnologia passa muito mais confiança do que apenas texto." },
            { icon: "⏳", title: "Gatilho da Escassez", desc: "\"Só consigo atender mais 3 pessoas hoje com esse preço promocional, porque o processamento da IA é pesado.\"" },
            { icon: "📢", title: "Tráfego Pago + WhatsApp", desc: "Faça tráfego pago direcionando para o WhatsApp. O cliente chega quente e pronto para comprar — basta aplicar os scripts acima." },
          ].map((d, i) => (
            <div key={i} className="bg-secondary/50 rounded-xl p-4">
              <p className="text-sm text-foreground font-medium mb-1">{d.icon} {d.title}</p>
              <p className="text-xs text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass-card p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Megaphone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-foreground text-sm">Estratégia de Captação</h3>
          <p className="text-xs text-muted-foreground">
            Crie anúncios mostrando antes/depois dos ensaios, direcione para o WhatsApp e feche a venda com os scripts acima. Foco em profissionais liberais e aniversariantes!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Treinamento;
