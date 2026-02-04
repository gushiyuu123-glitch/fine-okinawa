// =====================================================
//  Tailwind と style.css（1px完全一致の追加CSS）
//  を正しい順序で読み込む版（Vite/React 完全形）
// =====================================================

// 🟦 Tailwind のエントリCSS（ファイル名はあなたの環境に合わせて）
import './index.css'   // ← tailwind の @tailwind base/components/utilities を書いたCSS

// 🟧 1px完全一致のためのカスタムCSS（追加CSS）
// ※ Tailwind の後に読み込むのが絶対条件
import './style.css'

// =====================================================
//  React / Vite 基盤
// =====================================================
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// =====================================================
//  Vercel Analytics（Vite + React の正式導入文）
// =====================================================
import { inject } from '@vercel/analytics'
inject()

// =====================================================
//  ReactDOM Render
// =====================================================
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
