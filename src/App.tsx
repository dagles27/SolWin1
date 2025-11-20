// src/App.tsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GambaProvider, GambaUiProvider } from 'gamba-react-ui-v2'
import { ToastContainer } from 'react-toastify'
import Header from './sections/Header'
import Home from './sections/Home'
import Game from './sections/Game'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'

// WICHTIG: Dieser Spacer macht Platz für den neuen fixed Header (66px hoch)
const HeaderSpacer = () => <div style={{ height: '66px' }} />

function App() {
  return (
    <GambaProvider>
      <GambaUiProvider>
        <BrowserRouter>
          <Header />
          <HeaderSpacer />        {/* ← Diese Zeile ist der Fix! */}
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<Game />} />
            {/* füge hier weitere Routes ein wenn du hast */}
          </Routes>

          <ToastContainer theme="dark" position="bottom-right" />
        </BrowserRouter>
      </GambaUiProvider>
    </GambaProvider>
  )
}

export default App