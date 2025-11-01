import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // Fix: Initialize state as a class property to resolve issues with `this.state` and `this.props` access.
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Erro não capturado no componente filho:", error, errorInfo);
  }

  render() {
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
