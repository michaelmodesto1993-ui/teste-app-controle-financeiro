import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  // Fix: Initialize state as a class property. This avoids using a constructor for basic state setup
  // and resolves the TypeScript errors where 'this.state' and 'this.props' were not being correctly recognized.
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Erro não capturado no componente filho:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="bg-surface rounded-lg shadow-lg p-6 h-full flex items-center justify-center min-h-[384px]">
            <div className="text-center">
                <p className="font-bold text-expense">Erro no Gráfico</p>
                <p className="text-text-secondary text-sm">Não foi possível exibir este componente.</p>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
