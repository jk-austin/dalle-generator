'use client'; // tells Next.js this is a client component and can use hooks like useState
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // import the Supabase client to interact with the database

export default function Home() {
  const [prompt, setPrompt] = useState<string>(''); // user input for image generation
  // const [imageUrl, setImageUrl] = useState<string | null>(null); // generated image URL, replaced by images array to store multiple generated images
  const [images, setImages] = useState<string[]>([]); // array to store multiple generated image URLs

  useEffect(() => {
    const stored = localStorage.getItem('images');
    if (stored) setImages(JSON.parse(stored));
  }, []); // on component mount, load any previously generated images from localStorage
  
  async function fetchCount() {
    const { data } = await supabase
      .from('counter')
      .select('count')
      .single();
    console.log('count data:', data);
    console.log('count error:', error);
    if (data) setCount(data.count);
  }
  
  useEffect(() => {
    fetchCount();
  }, []); // on component mount, fetch the current count of generated images from Supabase to display usage stats

  const [loading, setLoading] = useState<boolean>(false); // loading state to disable button and show feedback
  const [error, setError] = useState<string | null>(null); // error state to display any issues
  const [count, setCount] = useState<number>(0); // state to track the number of images generated, will be updated from Supabase
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent page refresh on form submit
    setLoading(true); // set loading state to true while fetching, will change button display
    setError(null); // reset any previous errors
    // setImageUrl(null); // reset previous image; replaced by not clearing images to allow multiple generations
    
    const res = await fetch('/api/generate', {
      method: 'POST', // send POST request to our API route
      headers: { 'Content-Type': 'application/json' }, // specify JSON content type
      body: JSON.stringify({ prompt }), // send the prompt as JSON in the request body
    });

    const data = await res.json(); // parse back to a JS object
    if (!res.ok) { // check if response is not ok and set error message
      setError(data.error || 'Something went wrong');
    } else { // if successful, set the image URL to display the generated image
      setImages(prev => {
        const updated = [data.imageUrl, ...prev];
        localStorage.setItem('images', JSON.stringify(updated));
        return updated;
      }); // add new image URL to the beginning of the images array and update localStorage
      await fetchCount(); // after successfully generating an image, fetch the updated count from Supabase to reflect the new total in the UI
    }
    setLoading(false); // reset loading state after response is handled
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-start pt-24 px-4">
      <h1 className="text-4xl font-light tracking-widest text-slate-300 uppercase">
        Depths Image Studio
      </h1>
      <p className=" text-slate-500 text-sm tracking-widest mb-12">
        {count} {count === 1 ? 'image generated' : 'images generated'} {/* display the count of generated images */}
      </p>
    {/* form to handle user input and submission */}
    <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-4">
        <input
          type="text"
          value={prompt} // bind input value to prompt state
          onChange={(e) => setPrompt(e.target.value)} // update prompt state on input change
          placeholder="A magnificent castle with dragons flying above..."
          className="bg-slate-800 text-slate-200 placeholder-slate-500 border border-slate-700 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-slate-400"
        />
        <button
          type="submit"
          disabled={loading} // disable button while loading to prevent multiple submissions
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm tracking-widest uppercase py-3 rounded-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate'} {/* change button text based on loading state */}
        </button>
      </form>
      {error && (
        <p className="mt-6 text-red-400 text-sm">{error}</p> /* display error message if there is an error */
      )}
      {images.length > 0 && (
        <div className="mt-12 mb-24 w-full max-w-xl flex flex-col gap-6">
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Generated image ${index + 1}`} /* display generated image if available, with alt text for accessibility */
              className="w-full rounded-sm opacity-90"
            />
          ))}
        </div>
  )}
    </main>
  );
}

  //return ( 
  //  <main style={{ maxWidth: 600, margin: '60px auto', fontFamily: 'sans-serif' }}> {/* simple styling for the main container */}
  //    <h1>DALL-E Image Generator</h1>
  //   <form onSubmit={handleSubmit}> {/* form to handle user input and submission */}
  //      <input
  //        type="text"
  //        value={prompt} // bind input value to prompt state
  //        onChange={(e) => setPrompt(e.target.value)} // update prompt state on input change
  //        placeholder="A magnificent castle with dragons flying above..."
  //        style={{ width: '100%', padding: 10, fontSize: 16 }}
  //      />
  //      <button type="submit" disabled={loading} style={{ marginTop: 10, padding: '10px 20px' }}> {/* disable button while loading to prevent multiple submissions */}
  //        {loading ? 'Generating...' : 'Generate'} {/* change button text based on loading state */}
  //      </button>
  //    </form>
  //    {error && <p style={{ color: 'red' }}>{error}</p>} {/* display error message if there is an error */}
  //    {imageUrl && <img src={imageUrl} alt={prompt} style={{ marginTop: 20, width: '100%' }} />} {/* display generated image if available */}
  //  </main>
  //);
//}