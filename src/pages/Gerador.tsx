import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Upload, Sparkles, Download, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Ensaio Fotográfico
import cenarioColorida from "@/assets/cenario-colorida.jpg";
import cenarioCinematografica from "@/assets/cenario-cinematografica.jpg";
import cenarioEspelho from "@/assets/cenario-espelho.jpg";
import cenarioPretoBranco from "@/assets/cenario-preto-branco.jpg";
import cenarioPraiaEscura from "@/assets/cenario-praia-escura.jpg";

// Aniversário
import cenarioAniverBaloesLilas from "@/assets/cenario-aniver-baloes-lilas.jpg";
import cenarioAniverVelasPedraria from "@/assets/cenario-aniver-velas-pedraria.jpg";
import cenarioAniverGlamourBaloes from "@/assets/cenario-aniver-glamour-baloes.jpg";
import cenarioAniverRoseCama from "@/assets/cenario-aniver-rose-cama.jpg";
import cenarioAniverBoloFaiscas from "@/assets/cenario-aniver-bolo-faiscas.jpg";

// Ensaio Profissional
import cenarioProfPoltrona from "@/assets/cenario-prof-poltrona.jpg";
import cenarioProfBancoAlto from "@/assets/cenario-prof-banco-alto.jpg";
import cenarioProfCadeiraPB from "@/assets/cenario-prof-cadeira-pb.jpg";
import cenarioProfRetrato from "@/assets/cenario-prof-retrato.jpg";
import cenarioProfEditorial from "@/assets/cenario-prof-editorial.jpg";

type Cenario = {
  id: string;
  label: string;
  desc: string;
  image: string;
  prompt: string;
};

type Catalogo = {
  id: string;
  label: string;
  emoji: string;
  cenarios: Cenario[];
};

const catalogos: Catalogo[] = [
  {
    id: "ensaio",
    label: "Ensaio Fotográfico",
    emoji: "📷",
    cenarios: [
      {
        id: "praia-escura",
        label: "Praia Escura 🌅",
        desc: "Pôr do sol na praia com flash",
        image: cenarioPraiaEscura,
        prompt: "Faça-me parecer que estou em uma praia onde está escuro, mas alguém tirou minha foto com um flash e meu rosto está um pouco brilhante e brilhante. No fundo, adicione o pôr do sol como se o sol tivesse 98% do sol, deixando o céu vermelho roxo e está quase escuro. A imagem é tirada pelas minhas costas e me disseram para me virar para a foto. Estou usando um suéter fora do ombro. A foto é tirada acima da cintura, o que significa que mostra apenas a parte superior da minha imagem corporal.",
      },
      {
        id: "foto-colorida",
        label: "Foto Colorida 🍭",
        desc: "Ambiente retrô colorido anos 90/2000",
        image: cenarioColorida,
        prompt: "Edita a foto com cabelo solto, usando um casaco branco felpudo com estrelas coloridas, um top de alças com listras coloridas e um short jeans. Estou sentada em um balcão rosa com detalhes metálicos, dentro de um ambiente rosa com decoração retrô inspirada nos anos 90 e 2000. Na mão, seguro um grande pirulito colorido. A iluminação é de estúdio, com luzes de neon visíveis, e há dois copos de Bubble Tea e vários objetos colecionáveis ao redor.",
      },
      {
        id: "cinematografica",
        label: "Cinematográfica 🎞️",
        desc: "Retrato vintage com trem e flores",
        image: cenarioCinematografica,
        prompt: "Edite esta foto, Um retrato cinematográfico e temperamental de uma jovem de pé ao ar livre, segurando um buquê de flores vermelho-laranja vibrantes. Seu cabelo varrido pelo rosto, adicionando uma sensação de movimento. O fundo mostra um trem em movimento desfocado, criando uma atmosfera dinâmica e nostálgica. A iluminação é quente e fraca, com um visual de filme vintage, grão macio e sombras profundas, evocando um clima íntimo e melancólico.",
      },
      {
        id: "espelho",
        label: "Foto no Espelho 🪞",
        desc: "Selfie no espelho com câmera vintage",
        image: cenarioEspelho,
        prompt: "Edite essa foto com longos cabelos escuros (ou claros) tirando uma foto de si mesma em um espelho oval com moldura de casco de tartaruga. Ela está segurando uma câmera vintage Kodak e apoiando o rosto na mão. A iluminação é suave e o fundo parece ser um quarto.",
      },
      {
        id: "preto-branco",
        label: "Preto & Branco 📸",
        desc: "Retrato artístico P&B dramático",
        image: cenarioPretoBranco,
        prompt: "Crie um retrato estético em preto e branco elegante (use minha imagem com 100% de rosto preciso) sentada no chão em iluminação dramática. Ela está usando um casaco escuro grande, com os cabelos bagunçados e volumosos cobrindo parcialmente o rosto dela. Sua pose é emocional e introspectiva, com uma mão perto da boca e a cabeça ligeiramente virada para o lado. Sombras de uma janela caem sobre a parede atrás dela, criando uma atmosfera temperamental artística.",
      },
    ],
  },
  {
    id: "aniversario",
    label: "Aniversário",
    emoji: "🎂",
    cenarios: [
      {
        id: "aniver-baloes-lilas",
        label: "Balões & Flores Lilás 🎈",
        desc: "Cenário rosa/lilás com escada e balões",
        image: cenarioAniverBaloesLilas,
        prompt: "Fotografia em ambiente interno com fundo branco iluminado por luz natural suave, criando uma atmosfera clara e vibrante. A cena mostra uma mulher sentada de maneira descontraída ao lado de uma escada de madeira pintada de lilás, cercada por uma composição de balões grandes e médios nas cores rosa e roxo, misturados a arranjos de flores brancas volumosas. A iluminação é difusa e uniforme, destacando as cores vivas e o contraste entre os elementos decorativos. A mulher está posicionada ligeiramente voltada para a câmera, em um enquadramento de meio corpo, com o olhar direcionado para frente e uma expressão serena. Ela veste um blazer rosa claro de tecido estruturado, uma blusa branca simples por baixo e calça jeans de lavagem clara. Segura uma pequena bola espelhada prateada na mão direita, apoiando-a sobre o joelho, enquanto o braço esquerdo repousa suavemente na escada lilás. Ela está segurando dois balões grandes de números 26. O cenário transmite modernidade, alegria e elegância, com uma paleta de cores vibrante (rosa, lilás, branco e prateado). Sujeito: feminina (mesmo rosto e penteado da foto enviada, não altere a expressão facial nem a proporção do corpo).",
      },
      {
        id: "aniver-velas-pedraria",
        label: "Velas com Pedraria ✨",
        desc: "Close-up com velas de pedraria no escuro",
        image: cenarioAniverVelasPedraria,
        prompt: "Use a foto enviada como inspiração visual para os traços, o tom de pele, o cabelo e o formato do rosto da pessoa, mantendo sua aparência natural e reconhecível na imagem final. Retrato realista em close-up de uma jovem pessoa segurando duas velas de aniversário grandes acesas, formando o número \"26\". As velas estão inteiramente cobertas por pedrarias em tons de rosa clara e rosa bebê, em vários tamanhos e formatos, criando uma textura brilhante e delicada que reflete suavemente a luz do fogo. A iluminação vem somente das velas, revelando parcialmente o rosto e as mãos, enquanto o fundo permanece completamente escuro. A pessoa segura as velas com as duas mãos e olha para elas com um leve sorriso. Maquiagem: cílios alongados estilo extensão com gatinho, gloss rosado nos lábios. Roupa: regata branca soltinha, reta e sem alças extra finas. Acessórios: colares prateados em camadas no pescoço. Ambiente: totalmente escuro, sem luzes externas, como se a foto tivesse sido tirada por um celular em um cômodo apagado. A iluminação é fraca e amarelada, proveniente apenas das chamas das velas. Estilo e atmosfera: fotografia amadora tirada por celular, com granulação visível, ruído digital e nitidez propositalmente reduzida, devido à falta de luz. Aparência analógica e vintage, inspirada em fotos reais e espontâneas de estética Pinterest noturna.",
      },
      {
        id: "aniver-glamour-baloes",
        label: "Glamour Preto & Dourado 🖤",
        desc: "Vestido preto com balões pretos e dourados",
        image: cenarioAniverGlamourBaloes,
        prompt: "Crie um retrato glamuroso para uma sessão de fotos bem realista de aniversário com flash, o fundo uma parede clara simples iluminada com um holofote redondo, ela usa um vestido preto curto mas elegante com um decote, ela está de joelhos olhando para o bolo como se estivesse soprando a vela, no chão tem muitos balões pretos e dourados ela está segurando um bolo com o número 26 em cima.",
      },
      {
        id: "aniver-rose-cama",
        label: "Rosé & Confetes 🥂",
        desc: "Balões rosé gold na cama com confetes",
        image: cenarioAniverRoseCama,
        prompt: "Crie uma fotografia hiper realista de uma mulher Celebrando mais um ano de vida 26 anos com o coração cheio de gratidão e alegria. Os balões em ouro rosé e confetes dourados tornam tudo ainda mais mágico. Que este novo ciclo seja repleto de realizações, amor e momentos inesquecíveis. A mulher está de costas para a câmera olhando para trás levemente, sorridente. Ela tem o cabelo abaixo dos ombros e levemente ondulado. Está vestindo uma camisa branca cumprida mostrando o charme da mulher elegante, a maquiagem leve e bem marcante, com cílios grandes e uma boca vermelha. Ela segura os balões que mostra sua idade na cor rosé sentada em uma cama, uma boa iluminação. Sem retirar as minhas características.",
      },
      {
        id: "aniver-bolo-faiscas",
        label: "Bolo com Faíscas 🎇",
        desc: "Bolo decorado com sparklers à noite",
        image: cenarioAniverBoloFaiscas,
        prompt: "Crie um retrato vibrante e festivo, capturando uma cena de celebração de aniversário em um ambiente noturno. O foco central é uma jovem, que parece ser a aniversariante, sentada atrás de um bolo. Ela tem um sorriso radiante no rosto, com os dentes à mostra, transmitindo pura alegria e entusiasmo. Ela tem o cabelo altura dos ombros levemente ondulados e está usando um vestido preto tomara que caia ou uma peça de roupa similar, e brincos longos e brilhantes. Mantenha as características reais do rosto e traços da pessoa da foto. À frente da pessoa, há um bolo de aniversário grande e ricamente decorado. Ele parece de cor clara, talvez branca ou rosa pálido, com uma cobertura que escorre pelas laterais (efeito \"drip\"). O topo do bolo está adornado com rosas em tons de rosa suave. No centro, há um topo de bolo (cake topper) dourado com a inscrição \"Happy Birthday\" em letra cursiva. Um elemento dramático e chamativo são os dois foguetes de faíscas (\"sparkler candles\" ou \"vela vulcão\") acesos, um em cada lado do bolo, lançando faíscas douradas e brilhantes para cima, iluminando a cena com um brilho quente. A cena se passa à noite em um local que parece ser ao ar livre ou em uma área com muita vegetação ao fundo. A iluminação é primariamente gerada pelas faíscas e por luzes ambiente suaves, criando um clima quente, íntimo e dramático. Não mude as minhas características.",
      },
    ],
  },
  {
    id: "profissional",
    label: "Ensaio Profissional",
    emoji: "💼",
    cenarios: [
      {
        id: "prof-poltrona",
        label: "Poltrona Elegante 🪑",
        desc: "Retrato sofisticado em poltrona de couro",
        image: cenarioProfPoltrona,
        prompt: "Um retrato de estúdio profissional three-quarter-length 100% realista do rosto, sentada em um lugar elegante terno de alfaiataria de cor creme. Ela se senta em uma poltrona de couro marrom, pernas elegantemente cruzadas, perna direita sobre a esquerda, inclinada ligeiramente para a frente. Braços: cotovelo direito apoiado na coxa, mão esquerda suavemente perto do queixo. Seu braço esquerdo descansa casualmente em seu colo. Sua expressão é pensativa e composta, lábios fechados, olhos fixos levemente na câmera com elegância e confiança. Seu cabelo é de comprimento médio, pontas claras, modelado em ondas soltas com volume natural, marrom com reflexos dourados, repartidos ao meio. Ela usa acessórios sutis: pequenos brincos, anéis finos e uma delicada pulseira de ouro. O terno é estruturado, fosca, cor marfim, com ombros e punhos abotoados. O fundo é um gradiente marrom sólido e quente, borrado e iluminado como em um estúdio. A iluminação é suave e difusa da esquerda para a direita, criando destaques e sombras suaves. A atmosfera é cinematográfica, profissional e editorial de moda.",
      },
      {
        id: "prof-banco-alto",
        label: "Banco Alto Estúdio 🖤",
        desc: "Terno branco em fundo escuro, batom vermelho",
        image: cenarioProfBancoAlto,
        prompt: "Faça uma imagem vemos uma mulher elegante posando em um estúdio de fundo neutro e escuro, o que destaca ainda mais sua presença sofisticada. Ela está sentada de forma confiante em um banco alto, vestindo um conjunto branco de alfaiataria composto por blazer e calça de corte reto. O look transmite poder, sofisticação e modernidade. Nos pés, ela usa sandálias de salto finas, que completam a produção com leveza. Seu cabelo está como na imagem original, ela tem elegância e é minimalista. A maquiagem é marcante, com destaque para o batom vermelho intenso, que contrasta de maneira refinada com o branco do traje. O olhar é firme e direto, transmitindo autoconfiança, força e imponência. É uma imagem com forte impacto visual, perfeita para transmitir autoridade, estilo e presença marcante.",
      },
      {
        id: "prof-cadeira-pb",
        label: "Cadeira P&B Moderna 🎬",
        desc: "Estúdio P&B com blazer preto e cadeira metal",
        image: cenarioProfCadeiraPB,
        prompt: "Esta foto de estúdio em preto e branco apresenta uma foto minha de uma jovem magra e imperturbável sentada casualmente em uma cadeira dobrável de metal com as pernas cruzadas. Ela está usando um blazer preto, uma saia preta longa e saltos pretos. A iluminação é suave e mínima, criando sombras ousadas e uma atmosfera temperamental. A postura do corpo é relaxada, inclinando-se levemente com uma mão no encosto da cadeira, seu rosto virado para o lado. O fundo é simples, com uma estética simples e moderna.",
      },
      {
        id: "prof-retrato",
        label: "Retrato Sofisticado 💎",
        desc: "Close-up blazer claro com mãos no queixo",
        image: cenarioProfRetrato,
        prompt: "Gere uma foto onde essa mulher está em um retrato profissional e sofisticado. Ela está usando um blazer claro, que transmite elegância e sobriedade, e aparece com os cabelos soltos, longos e ondulados, bem alinhados. Seu rosto está em evidência, com uma maquiagem leve, mas marcante: pele uniforme, olhos destacados com cílios volumosos e batom em tom rosado que harmoniza com o look. A pose é clássica e confiante — ela apoia o queixo delicadamente sobre as mãos entrelaçadas, exibindo anéis e um relógio refinado, reforçando a imagem de profissionalismo e estilo. O fundo neutro e claro ajuda a manter toda a atenção nela, destacando ainda mais sua expressão serena e segura.",
      },
      {
        id: "prof-editorial",
        label: "Editorial Fashion 👠",
        desc: "Blazer risca de giz, calça branca, revista",
        image: cenarioProfEditorial,
        prompt: "Crie uma foto que transmite elegância moderna e atitude minimalista. A mulher aparece caminhando com naturalidade, descalça, o que dá um ar descontraído e autêntico ao retrato. Ela veste um blazer preto de risca de giz, que remete à alfaiataria clássica, combinado com uma calça branca de corte amplo, criando contraste sofisticado entre sobriedade e leveza. Na mão esquerda, segura uma revista de moda — elemento que reforça a atmosfera fashion e editorial da cena. Seu olhar é confiante e direto, complementado pelo cabelo solto, levemente ondulado, que emoldura o rosto. O fundo neutro, totalmente claro, valoriza o destaque para o movimento, a pose e o estilo, transformando a imagem em um registro que mistura simplicidade, sofisticação e uma estética contemporânea.",
      },
    ],
  },
];

const Gerador = () => {
  const [activeCatalogo, setActiveCatalogo] = useState<string>("ensaio");
  const [selectedCenario, setSelectedCenario] = useState<string | null>(null);
  const [fotoBase, setFotoBase] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const currentCatalogo = catalogos.find((c) => c.id === activeCatalogo);

  const handleSelectCenario = (id: string) => {
    setSelectedCenario(id);
    const cenario = currentCatalogo?.cenarios.find((c) => c.id === id);
    if (cenario) setPrompt(cenario.prompt);
    setGeneratedUrl(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Envie apenas imagens");
        return;
      }
      setFotoBase(file);
      setFotoPreview(URL.createObjectURL(file));
      setGeneratedUrl(null);
      toast.success("Foto carregada: " + file.name);
    }
  };

  const handleGenerate = async () => {
    if (!selectedCenario) return toast.error("Selecione um cenário");
    if (!fotoBase) return toast.error("Faça upload da foto base");
    if (!prompt.trim()) return toast.error("Escreva o prompt descrevendo o ensaio");

    setGenerating(true);
    toast.info("Gerando ensaio profissional... isso pode levar até 2 minutos");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError || !session) throw new Error("Sessão expirada. Faça login novamente.");

      const allCenarios = catalogos.flatMap((c) => c.cenarios);
      const cenarioLabel = allCenarios.find((c) => c.id === selectedCenario)?.label || selectedCenario;

      const formData = new FormData();
      formData.append("photo", fotoBase);
      formData.append("prompt", prompt);
      formData.append("cenario", cenarioLabel);

      let response: Response;
      try {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-imagen`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${session.access_token}` },
            body: formData,
            signal: controller.signal,
          }
        );
      } catch (fetchErr: any) {
        if (fetchErr.name === "AbortError") {
          throw new Error("Tempo limite excedido. Tente novamente.");
        }
        throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
      }

      let responseData: any;
      try {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Erro ${response.status}: Resposta inválida do servidor`);
      }

      if (!response.ok) {
        if (responseData?.needsApiKey) {
          toast.error("Configure sua API Key em Configurações antes de gerar ensaios", { duration: 5000 });
          return;
        }
        throw new Error(responseData?.error || `Erro ${response.status}: Falha na geração`);
      }

      if (!responseData.generatedUrl) {
        throw new Error("Nenhuma imagem foi retornada. Tente novamente.");
      }

      setGeneratedUrl(responseData.generatedUrl);
      toast.success("Ensaio gerado com sucesso!");
    } catch (e: any) {
      console.error("Gerador error:", e);
      toast.error(e.message || "Erro ao gerar ensaio");
    } finally {
      clearTimeout(timeout);
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedUrl) return;
    try {
      const bucketPath = generatedUrl.split("/storage/v1/object/public/photos/")[1];
      let blob: Blob;
      if (bucketPath) {
        const { data, error } = await supabase.storage.from("photos").download(decodeURIComponent(bucketPath));
        if (error || !data) throw new Error("Erro ao baixar");
        blob = data;
      } else {
        const res = await fetch(generatedUrl);
        if (!res.ok) throw new Error("Erro ao baixar");
        blob = await res.blob();
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ensaio-${selectedCenario}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download iniciado!");
    } catch {
      toast.error("Erro no download");
    }
  };

  return (
    <div className="space-y-8 fade-in max-w-5xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Gerador de <span className="text-primary">Ensaios</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Escolha o catálogo, selecione o cenário, envie a foto e gere seu ensaio
        </p>
      </div>

      {/* Catálogos Tabs */}
      <div className="flex gap-2 flex-wrap">
        {catalogos.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCatalogo(cat.id);
              setSelectedCenario(null);
              setPrompt("");
              setGeneratedUrl(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCatalogo === cat.id
                ? "bg-primary text-primary-foreground gold-glow"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Cenários do catálogo ativo */}
      {currentCatalogo && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {currentCatalogo.emoji} Cenários — {currentCatalogo.label}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {currentCatalogo.cenarios.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectCenario(c.id)}
                className={`glass-card-hover p-3 text-left transition-all relative ${
                  selectedCenario === c.id ? "border-primary/50 gold-glow" : ""
                }`}
              >
                {selectedCenario === c.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className="w-full aspect-[3/4] rounded-lg overflow-hidden mb-2">
                  <img src={c.image} alt={c.label} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="font-medium text-xs text-foreground">{c.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{c.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prompt */}
      <div className="glass-card p-5 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Prompt do Ensaio{" "}
          {selectedCenario && (
            <span className="text-primary">(pré-preenchido pelo cenário — edite como quiser)</span>
          )}
        </h3>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Selecione um cenário acima ou escreva seu próprio prompt..."
          className="bg-secondary border-border min-h-[120px] resize-none"
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground text-right">{prompt.length}/2000</p>
      </div>

      {/* Upload */}
      <div className="glass-card p-5 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Foto Base do Cliente</h3>
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl hover:border-primary/40 cursor-pointer transition-colors bg-secondary/30 overflow-hidden">
          {fotoPreview ? (
            <img src={fotoPreview} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Clique para enviar (qualquer formato)</span>
            </>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
        </label>
        {fotoBase && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground truncate">{fotoBase.name}</p>
            <button
              onClick={() => { setFotoBase(null); setFotoPreview(null); }}
              className="text-xs text-primary hover:underline"
            >
              Trocar
            </button>
          </div>
        )}
      </div>

      {/* Generated Image Preview */}
      {generatedUrl && (
        <div className="glass-card p-5 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Ensaio Gerado ✨</h3>
          <div className="w-full rounded-xl overflow-hidden bg-muted">
            <img src={generatedUrl} alt="Ensaio gerado" className="w-full h-auto object-contain max-h-[500px]" />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleGenerate}
          disabled={generating}
          size="lg"
          className="flex-1 py-6 text-base bg-primary text-primary-foreground hover:bg-primary/90 gold-glow font-medium"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Gerando Ensaio...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Gerar Ensaio Profissional
            </span>
          )}
        </Button>

        {generatedUrl && (
          <Button
            onClick={handleDownload}
            size="lg"
            variant="outline"
            className="py-6 text-base border-primary/30 text-primary hover:bg-primary/10"
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
        )}
      </div>
    </div>
  );
};

export default Gerador;
