import OpenAI from "openai";

const apiKey = process.env.OPENAI_SECRET_KEY;

if (!apiKey) {
  throw new Error('OPENAI_KEY environment variable not set');
}

const openai = new OpenAI({apiKey});

export default openai;