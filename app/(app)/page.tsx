'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ parts: [{ type: 'text', text: input }], role: 'user' });
    setInput('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4 mb-4">
        {messages.map((m) => (
          <div key={m.id || Math.random().toString()} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <p className="inline-block bg-gray-100 rounded-lg px-3 py-2">
              {m.parts ? m.parts.map((p, i) => (p.type === 'text' ? <span key={i}>{p.text}</span> : null)) : (m as any).content}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question sur le statut auto-entrepreneur..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button type="submit" disabled={status !== 'ready'} className="bg-black text-white px-4 py-2 rounded-lg">
          Envoyer
        </button>
      </form>
    </div>
  );
}