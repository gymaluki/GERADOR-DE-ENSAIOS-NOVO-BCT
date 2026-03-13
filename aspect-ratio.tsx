import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Don't crash the entire app for DOM manipulation errors (often caused by browser extensions)
    if (
      error.message?.includes("insertBefore") ||
      error.message?.includes("removeChild") ||
      error.message?.includes("appendChild") ||
      error.message?.includes("not a child")
    ) {
      console.warn("DOM manipulation error (likely browser extension):", error.message);
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Suppress DOM manipulation errors from browser extensions
    if (
      error.message?.includes("insertBefore") ||
      error.message?.includes("removeChild") ||
      error.message?.includes("appendChild") ||
      error.message?.includes("not a child")
    ) {
      console.warn("Suppressed DOM error (browser extension):", error.message);
      return;
    }
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-xl font-bold text-foreground">Algo deu errado</h2>
            <p className="text-muted-foreground text-sm">
              {this.state.error?.message || "Erro inesperado"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
