import { json } from '@remix-run/node';
import { authenticate } from '../../shopify.server';
import prisma from '../../db.server';
import { fetchGeolocation } from './fetchGeolocation';

export async function loader({ request }) {
  // Authenticate the request
  const storefront = await authenticate.public.appProxy(request);

  // Extract request params
  const url = new URL(request.url);
  const queryParams = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  // Get request geolocation
  const forwardedIps = request.headers.get('x-forwarded-for') || '';
  const clientIp = forwardedIps.split(',')[0].trim();
  const geoData = await fetchGeolocation(clientIp);
  if (geoData.error) {
    return json({ error: geoData.error });
  }

  let shopId = queryParams.shop;
  let countryCode = geoData.countryCode;


  // Check if a ShopCountryView for the given shopId and country already exists
  const existingShopCountryView = await prisma.ShopCountryView.findFirst({
    where: {
      shopId: shopId,
      country: countryCode,
    },
    orderBy: {
      id: 'desc', // Order by 'id' in descending order to get the latest record
    },
  });

  let shopCountryView;

  if (existingShopCountryView) {
    // Make sure that the id of the existing record is correctly retrieved
    const existingViewId = existingShopCountryView.id;

    // If the record exists, increment the view count
    shopCountryView = await prisma.ShopCountryView.update({
      where: {
        id: existingViewId, // Use the retrieved id here
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } else {
    // If it does not exist, create a new record with a view count of 1
    shopCountryView = await prisma.ShopCountryView.create({
      data: {
        shopId: shopId,
        country: countryCode,
        viewCount: 1,
      },
    });
  }



  return shopCountryView;
}


