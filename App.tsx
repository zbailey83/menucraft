import React, { useState, useEffect } from 'react';
import MenuEditor from './components/MenuEditor';
import MenuPreview from './components/MenuPreview';
import { AppState } from './types';
import { INITIAL_STATE } from './constants';
import { KeyIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [hasKey, setHasKey] = useState(false);

  // Check for API key presence on mount
  useEffect(() => {
    const checkKey = async () => {
      if (process.env.API_KEY) {
        setHasKey(true);
        return;
      }
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    } else {
      alert("API Key selection not supported in this environment or fallback env var missing.");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden text-[#2d2d3a]">
      {/* Navbar */}
      <header className="h-16 flex items-center justify-between px-8 shrink-0 print-hide z-20 backdrop-blur-sm bg-white/20 border-b border-white/30 shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="text-3xl filter drop-shadow hover:animate-bounce cursor-default">Menu</span>
          <h1 className="font-heading font-bold text-2xl tracking-wide text-[#2d2d3a]">Craft</h1>
        </div>
        <div className="flex items-center space-x-4">
          {!hasKey && (
            <button
              onClick={handleConnectKey}
              className="clay-button clay-button-primary animate-pulse text-xs font-bold text-white"
            >
              <KeyIcon className="w-4 h-4" />
              <span>Connect API Key</span>
            </button>
          )}
          {hasKey && (
            <span className="clay-card px-4 py-1.5 flex items-center bg-green-100/50 border border-green-200 text-green-700 font-bold text-xs rounded-full shadow-none">
              API CONNECTED
            </span>
          )}
          <button
            onClick={() => window.print()}
            className="clay-button bg-white/50 text-sm hover:text-primary"
          >
            Export PDF
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative p-6 gap-6">
        {/* Editor Panel (Left) */}
        <div className="w-full md:w-[450px] lg:w-[500px] flex-shrink-0 relative z-10 h-full print-hide flex flex-col">
          <MenuEditor state={state} setState={setState} />
        </div>

        {/* Preview Panel (Right) */}
        <div className="flex-1 clay-card p-0 overflow-hidden relative h-full bg-slate-50/50">
          <MenuPreview data={state} />
        </div>
      </main>

      {/* Instructions Modal if no key */}
      {!hasKey && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 print-hide backdrop-blur-md">
          <div className="clay-card max-w-lg text-center bg-[#fef9f5]">
            <span className="text-4xl mb-4 block">🍌</span>
            <h2 className="text-3xl font-heading font-bold mb-4 text-primary">Welcome to Menu Craft</h2>
            <p className="text-secondary mb-8 text-lg">
              To generate stunning AI menus with <strong>floating 3D visuals</strong> and descriptions, you need to connect your Google Gemini API key.
            </p>
            <p className="text-xs text-slate-400 mb-6">
              Note: High-quality image generation requires a billed project.
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-primary underline ml-1 hover:text-violet-700">Learn more</a>
            </p>
            <button
              onClick={handleConnectKey}
              className="clay-button clay-button-primary w-full text-lg py-4"
            >
              Select API Key
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;