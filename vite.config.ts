import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Este bloco 'define' torna as variáveis de ambiente disponíveis para o código do lado do cliente.
  // Ele stringifica com segurança o valor de process.env.API_KEY durante o processo de build.
  // Isso permite que o código do aplicativo acesse a chave de API via `process.env.API_KEY`
  // enquanto adere às diretrizes de codificação da API do Gemini.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
