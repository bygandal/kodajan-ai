
import { useState } from 'react';

export default function Home() {
  const [task, setTask] = useState('');
  const [role, setRole] = useState('KodAjan.dev');
  const [context, setContext] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, agentRole: role, context })
    });
    const data = await res.json();
    setOutput(data.output || data.error);
    setLoading(false);
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">KodAjan Görev Paneli</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="KodAjan.dev">KodAjan.dev</option>
          <option value="KodAjan.qa">KodAjan.qa</option>
          <option value="KodAjan.doc">KodAjan.doc</option>
          <option value="KodAjan.design">KodAjan.design</option>
          <option value="KodAjan.chat">KodAjan.chat</option>
          <option value="KodAjan.audit">KodAjan.audit</option>
        </select>
        <textarea placeholder="Görev açıklaması" value={task} onChange={e => setTask(e.target.value)} rows={4} />
        <textarea placeholder="Bağlam / Context" value={context} onChange={e => setContext(e.target.value)} rows={3} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </form>
      {output && (
        <div className="mt-6 p-4 border bg-gray-100 whitespace-pre-wrap">
          <h2 className="font-semibold">Ajan Çıktısı:</h2>
          <p>{output}</p>
        </div>
      )}
    </main>
  );
}
