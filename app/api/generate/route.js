import { NextResponse } from 'next/server'; // import NextResponse to create JSON responses to send to the client
import OpenAI from 'openai'; // needed to interact with the OpenAI API

// creates a new instance of the OpenAI client using the API key from .env
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// defines an asynchronous POST function to handle incoming requests to this API route
export async function POST(request) {
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
  return NextResponse.json({ imageUrl }); // return the image URL as a JSON response to the browser
}
