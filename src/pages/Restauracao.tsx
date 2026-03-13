import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, Wand2, Download, ChevronLeft, ChevronRight, Palette } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RestoredPhoto {
  id: string;
  originalUrl: string;
  restoredUrl: string;
  createdAt: string;
}

const Restauracao = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [restoredUrl, setRestoredUrl] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState([50]);
  const [restoring, setRestoring] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [colorize, setColorize] = useState(false);
  const [history, setHistory] = useState<RestoredPhoto[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase
      .from("ensaios")
      .select("*")
      .eq("tipo", "restauracao")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    if (data) {
      setHistory(data.map((d) => ({
        id: d.id,
        originalUrl: d.foto_original || "",
        restoredUrl: d.foto_gerada || "",
        createdAt: d.created_at,
      })));
    }
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("Envie apenas imagens");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setRestoredUrl(null);
    toast.success("Foto carregada: " + f.name);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleRestore = async () => {
    if (!file) return toast.error("Envie uma foto primeiro");
    setRestoring(true);
    toast.info("Restaurando com IA... isso pode levar até 2 minutos");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Faça login primeiro");

      const formData = new FormData();
      formData.append("photo", file);
      formData.append("colorize", colorize ? "true" : "false");

      let response: Response;
      try {
        response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/restore-photo`,
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
          toast.error("Configure sua API Key em Configurações antes de restaurar fotos", { duration: 5000 });
          return;
        }
        throw new Error(responseData?.error || `Erro ${response.status}: Falha na restauração`);
      }

      if (!responseData.restoredUrl) {
        throw new Error("Nenhuma imagem foi retornada. Tente novamente.");
      }

      setRestoredUrl(responseData.restoredUrl);
      toast.success("Foto restaurada com sucesso!");
      loadHistory();
    } catch (e: any) {
      console.error("Restauracao error:", e);
      toast.error(e.message || "Erro ao restaurar foto");
    } finally {
      clearTimeout(timeout);
      setRestoring(false);
    }
  };

  const handleDownload = async (url?: string) => {
    const downloadUrl = url || restoredUrl;
    if (!downloadUrl) return;
    try {
      // Extract storage path from public URL to use Supabase download
      const bucketPath = downloadUrl.split("/storage/v1/object/public/photos/")[1];
      let blob: Blob;
      if (bucketPath) {
        const { data, error } = await supabase.storage.from("photos").download(decodeURIComponent(bucketPath));
        if (error || !data) throw new Error("Erro ao baixar arquivo");
        blob = data;
      } else {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Erro ao baixar arquivo");
        blob = await response.blob();
      }
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `restaurada-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success("Download iniciado!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Erro no download");
    }
  };

  return (
    <div className="space-y-8 fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Restauração <span className="text-primary">Pro</span>
        </h1>
        <p className="text-muted-foreground mt-1">Restaure fotos antigas, melhore a resolução e adicione cores com IA</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`glass-card p-8 transition-all ${isDragging ? "border-primary/50 gold-glow" : ""}`}
      >
        {!preview ? (
          <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-foreground font-medium">Arraste sua foto aqui</p>
            <p className="text-sm text-muted-foreground mt-1">ou clique para selecionar (qualquer formato de imagem)</p>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                {restoredUrl ? "Comparador Antes & Depois" : "Foto Carregada"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setFile(null); setPreview(null); setRestoredUrl(null); }}
                className="text-muted-foreground hover:text-foreground"
              >
                Trocar foto
              </Button>
            </div>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
              <div className="absolute inset-0">
                <img src={preview} alt="Original" className="w-full h-full object-contain opacity-60" />
                <span className="absolute top-3 left-3 text-xs bg-background/80 px-2 py-1 rounded-md text-muted-foreground">Antes</span>
              </div>
              {restoredUrl && (
                <>
                  <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderValue[0]}% 0 0)` }}>
                    <img src={restoredUrl} alt="Restaurada" className="w-full h-full object-contain" />
                    <span className="absolute top-3 left-3 text-xs bg-primary/80 px-2 py-1 rounded-md text-primary-foreground">Depois</span>
                  </div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-primary z-10" style={{ left: `${sliderValue[0]}%` }} />
                </>
              )}
            </div>
            {restoredUrl && <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} className="mt-2" />}
          </div>
        )}
      </div>

      {/* Colorize Option */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-primary" />
          <div>
            <Label htmlFor="colorize" className="text-foreground font-medium cursor-pointer">Adicionar cores à foto</Label>
            <p className="text-xs text-muted-foreground">Ideal para fotos antigas em preto e branco</p>
          </div>
        </div>
        <Switch id="colorize" checked={colorize} onCheckedChange={setColorize} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleRestore}
          disabled={restoring || !file}
          size="lg"
          className="flex-1 py-6 text-base bg-primary text-primary-foreground hover:bg-primary/90 gold-glow font-medium"
        >
          {restoring ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Restaurando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              {colorize ? "Restaurar e Colorir" : "Restaurar com IA"}
            </span>
          )}
        </Button>
        {restoredUrl && (
          <Button onClick={() => handleDownload()} size="lg" variant="outline" className="py-6 text-base border-primary/30 text-primary hover:bg-primary/10">
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
        )}
      </div>

      {/* History Gallery */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Suas Restaurações</h2>
          <div className="relative glass-card p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                disabled={historyIndex === 0}
                onClick={() => setHistoryIndex((i) => Math.max(0, i - 1))}
                className="shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex-1 overflow-hidden">
                <div
                  className="flex transition-transform duration-300 gap-3"
                  style={{ transform: `translateX(-${historyIndex * 260}px)` }}
                >
                  {history.map((item) => (
                    <div key={item.id} className="min-w-[240px] rounded-lg overflow-hidden bg-muted border border-border group relative">
                      <img
                        src={item.restoredUrl}
                        alt="Restaurada"
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDownload(item.restoredUrl)}>
                          <Download className="w-4 h-4 mr-1" /> Baixar
                        </Button>
                      </div>
                      <div className="p-2 text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                disabled={historyIndex >= history.length - 3}
                onClick={() => setHistoryIndex((i) => Math.min(history.length - 1, i + 1))}
                className="shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restauracao;
