import OpenAI from 'openai';
import { existingBannerExists } from './existingBannerExists';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function fetchOpenAiResponse(shopTemperature, prompt, visitingCountry, shopDomain) {

  const existingBanner = await existingBannerExists(visitingCountry, shopDomain)


  if (existingBanner) {

    return existingBanner

  } else {

    const bannerContent = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: shopTemperature,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    })

    const messageContent = bannerContent.choices[0].message.content.replace(/\\/g, '').replace('"', '').replace('."', '.');

    const record = await prisma.ShopCountryView.findFirst({
      where: {
        shopId: shopDomain,
        country: visitingCountry,
      },
    });


    if (record) {
      const updatedRecord = await prisma.ShopCountryView.update({
        where: {
          id: record.id,
        },
        data: {
          bannerContent: messageContent,
        },
      });
    }
    return messageContent
  }

}


