# Depths DALL-E Studio

An intuitive image creation app built on DALL-E, allowing for multiple creations of your vision.

🔗 [Live Demo](https://depths-dalle-studio.vercel.app/)

---

## Stack

- **Next.js** — React framework handling both frontend and backend API routes
- **OpenAI DALL-E 3** — image generation API
- **Tailwind CSS** — utility-first styling
- **Vercel** — deployment and hosting

---

## Features

- Generate images from text prompts using DALL-E 3
- Gallery view displays all images generated in the current session
- Images persist across page refreshes via localStorage

---

## Running Locally

1. Clone the repo
```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
```

2. Install dependencies
```bash
   npm install
```

3. Add your OpenAI API key — create a `.env.local` file in the root:
```
   OPENAI_API_KEY=sk-your-key-here
```

4. Start the development server
```bash
   npm run dev
```

Visit `http://localhost:3000`

---

## Environment Variables

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `OPENAI_API_KEY` | OpenAI secret key | [platform.openai.com](https://platform.openai.com) |
