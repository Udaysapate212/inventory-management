import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'sonner'
import { ProductProvider } from './context/ProductContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductProvider>
      <App />
      <Toaster 
      position="top-right"
      richColors 
      closeButton
      toastOptions={{
        classNames: {
          toast: '!bg-slate-800 !text-white !border-slate-700',
          title: '!font-bold',
        },
      }}
    />
    </ProductProvider>
  </React.StrictMode>
)