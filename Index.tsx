import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Download, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Ensaio {
  id: string;
  foto_gerada: string | null;
  tipo: string;
  cenario: string | null;
  status: string;
  created_at: string;
}

const Galeria = () => {
  const { user } = useAuth();
  const [ensaios, setEnsaios] = useState<Ensaio[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchEnsaios = async () => {
      const { data } = await supabase
        .from("ensaios")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setEnsaios((data as Ensaio[]) || []);
      setLoading(false);
    };
    fetchEnsaios();
  }, [user]);

  const handleDownload = async (ensaio: Ensaio) => {
    if (!ensaio.foto_gerada) return;
    setDownloading(ensaio.id);
    try {
      const bucketPath = ensaio.foto_gerada.split("/storage/v1/object/public/photos/")[1];
      let blob: Blob;
      if (bucketPath) {
        const { data, error } = await supabase.storage.from("photos").download(decodeURIComponent(bucketPath));
        if (error || !data) throw new Error("Erro ao baixar");
        blob = data;
      } else {
        const res = await fetch(ensaio.foto_gerada);
        if (!res.ok) throw new Error("Erro ao baixar");
        blob = await res.blob();
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${ensaio.tipo}-${ensaio.cenario || "foto"}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download iniciado!");
    } catch {
      toast.error("Erro no download");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Meus <span className="text-primary">Pedidos</span>
        </h1>
        <p className="text-muted-foreground mt-1">Fotos geradas e restauradas prontas para download</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card aspect-square shimmer" />
          ))}
        </div>
      ) : ensaios.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium">Nenhum ensaio ainda</p>
          <p className="text-sm text-muted-foreground mt-1">
            Gere seu primeiro ensaio ou restaure uma foto para começar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ensaios.map((e) => (
            <div key={e.id} className="glass-card-hover overflow-hidden group">
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {e.foto_gerada ? (
                  <img src={e.foto_gerada} alt="Ensaio" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2"
                    disabled={downloading === e.id}
                    onClick={() => handleDownload(e)}
                  >
                    {downloading === e.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Baixar
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-foreground capitalize">{e.tipo}</p>
                <p className="text-xs text-muted-foreground">{e.cenario || "Sem cenário"}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                  e.status === "concluido" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {e.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Galeria;
