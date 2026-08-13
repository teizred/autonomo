'use client';

import { useChat } from '@ai-sdk/react';
import { isTextUIPart } from 'ai';
import { useState } from 'react';

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Autonomo RAG</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? '#2563eb' : '#f3f4f6',
              color: m.role === 'user' ? '#fff' : '#111',
              borderRadius: 12,
              padding: '8px 14px',
              maxWidth: '80%',
            }}
          >
            {(m.parts ?? []).filter(isTextUIPart).map((p, i) => (
              <span key={i}>{p.text}</span>
            ))}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question..."
          style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
        />
        <button
          type="submit"
          disabled={status !== 'ready'}
          style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', opacity: status !== 'ready' ? 0.5 : 1 }}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}