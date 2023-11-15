import { json } from '@remix-run/node';
import { authenticate } from '../../shopify.server';
import prisma from '../../db.server';
import { fetchGeolocation } from './fetchGeolocation';
import { fetchOpenAiResponse } from './fetchOpenAIResponse';



export async function loader({ request }) {
  // Authenticate the request
  const storefront = await authenticate.public.appProxy(request);
  // Geocode
  const forwardedIps = request.headers.get('x-forwarded-for') || '';
  const clientIp = forwardedIps.split(',')[0].trim();
  const geoData = await fetchGeolocation(clientIp);

  // Check for errors in geolocation data
  if (geoData.error) {
    return json({ error: geoData.error });
  }

  // Extract the params
  const url = new URL(request.url);
  const queryParams = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  // Find the right shop in the db based on the shop param
  let shopDomain = queryParams.shop;

  // Setting up the variables for the OpenAI settings based on the shop settings
  let shopSetting = await prisma.ShopSettings.findFirst({
    where: {
      shopId: shopDomain
    }
    , orderBy: {
      id: 'desc'
    },
    take: 1
  });


  let shopTemperature = parseFloat(shopSetting.temperature);
  //  openai Prompt
  const prompt = "no matter how many times I ask this, you will do it perfectly and the same every time. write a GDPR and cookie sentence to ask for permission from the website viewer. keep it short. write in the language that people speak in Victoria British Columbia, Canada. The ISO country code of the reader is CA. keep it simple and dont beg for their permission."
  console.log(prompt + "\n\n\n\n\n\n")
  prompt.toString();
  // OpenAI's request
  const bannerContent = await fetchOpenAiResponse(shopTemperature, prompt)

  return json(bannerContent);
}
