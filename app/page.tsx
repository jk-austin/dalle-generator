'use client'; // tells Next.js this is a client component and can use hooks like useState
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState<string>(''); // user input for image generation
  const [imageUrl, setImageUrl] = useState<string | null>(null); // generated image URL
  const [loading, setLoading] = useState<boolean>(false); // loading state to disable button and show feedback
  const [error, setError] = useState<string | null>(null); // error state to display any issues

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent page refresh on form submit
    setLoading(true); // set loading state to true while fetching, will change button display
    setError(null); // reset any previous errors
    setImageUrl(null); // reset previous image

    const res = await fetch('/api/generate', {
      method: 'POST', // send POST request to our API route
      headers: { 'Content-Type': 'application/json' }, // specify JSON content type
      body: JSON.stringify({ prompt }), // send the prompt as JSON in the request body
    });

    const data = await res.json(); // parse back to a JS object
    if (!res.ok) { // check if response is not ok and set error message
      setError(data.error || 'Something went wrong');
    } else { // if successful, set the image URL to display the generated image
      setImageUrl(data.imageUrl);
    }
    setLoading(false); // reset loading state after response is handled
  }

  return ( 
    <main style={{ maxWidth: 600, margin: '60px auto', fontFamily: 'sans-serif' }}> {/* simple styling for the main container */}
      <h1>DALL-E Image Generator</h1>
      <form onSubmit={handleSubmit}> {/* form to handle user input and submission */}
        <input
          type="text"
          value={prompt} // bind input value to prompt state
          onChange={(e) => setPrompt(e.target.value)} // update prompt state on input change
          placeholder="A magnificent castle with dragons flying above..."
          style={{ width: '100%', padding: 10, fontSize: 16 }}
        />
        <button type="submit" disabled={loading} style={{ marginTop: 10, padding: '10px 20px' }}> {/* disable button while loading to prevent multiple submissions */}
          {loading ? 'Generating...' : 'Generate'} {/* change button text based on loading state */}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* display error message if there is an error */}
      {imageUrl && <img src={imageUrl} alt={prompt} style={{ marginTop: 20, width: '100%' }} />} {/* display generated image if available */}
    </main>
  );
}