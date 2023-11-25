import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function fetchOpenAiResponse(shopTemperature, prompt) {

  const bannerContent = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: shopTemperature == "personal" ? 1.50 : 0.25, // Adjust the temperature as needed
    messages: [{
      role: 'user',
      content: prompt,
    }],
  });
  console.log(bannerContent)
  return bannerContent
}

