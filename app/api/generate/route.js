import { NextResponse } from 'next/server'; // import NextResponse to create JSON responses to send to the client
import OpenAI from 'openai'; // needed to interact with the OpenAI API
import { supabase } from '@/lib/supabase'; // import the Supabase client to interact with the database

// creates a new instance of the OpenAI client using the API key from .env
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// defines an asynchronous POST function to handle incoming requests to this API route
export async function POST(request) {
  try {
    const { prompt } = await request.json(); // extract the prompt from the request body, which is expected to be JSON

    // validate that the prompt is provided, if not return a 400 Bad Request response with an error message
    if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    // calls the OpenAI API to generate an image based on the provided prompt using the DALL-E 3 model
    const response = await openai.images.generate({
        model: 'dall-e-3', // specify the DALL-E 3 model for image generation
        prompt, // uses property shorthand to pass the prompt variable as the prompt parameter
        n: 1, // specify that we want to generate 1 image
        size: '1024x1024', // specify the desired size of the generated image
    });

    // extract the image URL from the response
    const imageUrl = response.data[0].url; // grab index 0
    await supabase.rpc("increment_counter"); // call the increment_counter RPC function in Supabase to increment the counter for tracking usage
  
    return NextResponse.json({ imageUrl }); // return the image URL as a JSON response to the browser
    } catch (error) {
        console.error('API route error:', error);
        if (error.code === 'content_policy_violation') {
            return NextResponse.json({ error: 'Your prompt was rejected by OpenAI content policy. Please try a different prompt.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
