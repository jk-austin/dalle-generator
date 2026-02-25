'use client';
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl(null);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong');
    } else {
      setImageUrl(data.imageUrl);
    }
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 600, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1>DALL-E Image Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A magnificent castle with dragons flying above..."
          style={{ width: '100%', padding: 10, fontSize: 16 }}
        />
        <button type="submit" disabled={loading} style={{ marginTop: 10, padding: '10px 20px' }}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && <img src={imageUrl} alt={prompt} style={{ marginTop: 20, width: '100%' }} />}
    </main>
  );
}