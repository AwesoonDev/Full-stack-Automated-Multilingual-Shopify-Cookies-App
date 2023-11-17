import { json } from '@remix-run/node';
import { authenticate } from '../../shopify.server';
import prisma from '../../db.server';
import { fetchGeolocation } from './fetchGeolocation';

export async function action({ request }) {
  console.log("koskesh e kiri")
  // Authenticate the request
  const storefront = await authenticate.public.appProxy(request);
  const requestBody = await request.json();
  const accepted = requestBody.accepted;

  const forwardedIps = request.headers.get('x-forwarded-for') || '';
  const clientIp = forwardedIps.split(',')[0].trim();
  const geoData = await fetchGeolocation(clientIp);
  let shopId = request.headers.get('x-shop-domain')
  let countryCode = geoData.countryCode;

  if (geoData.error) {
    return json({ error: geoData.error });
  }


  // Check if a ShopCountryView for the given shopId and country already exists
  const existingShopCountryView = await prisma.ShopCountryView.findFirst({
    where: {
      shopId: shopId,
      country: countryCode,
    }
  });

  let shopCountryView;

  if (existingShopCountryView) {

    const existingViewId = existingShopCountryView.id;

    shopCountryView = await prisma.ShopCountryView.update({
      where: {
        id: existingViewId,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } else {

    shopCountryView = await prisma.ShopCountryView.create({
      data: {
        shopId: shopId,
        country: countryCode,
        viewCount: 1,
      },
    });
  }

  if (accepted === true) {
    shopCountryView = await prisma.ShopCountryView.update({
      where: { id: shopCountryView.id },
      data: {
        acceptanceCount: {
          increment: 1
        }
      }
    });
  }

  return shopCountryView;
}


