import { json } from '@remix-run/node';
import { authenticate } from '../../shopify.server';
import prisma from '../../db.server';
import { fetchGeolocation } from './fetchGeolocation';

export async function action({ request }) {
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

  async function getTotalViewsForShopSinceBeginningOfMonth(shopId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalViews = await prisma.ShopCountryView.aggregate({
      _sum: {
        viewCount: true,
      },
      where: {
        shopId: shopId,
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    return totalViews?._sum?.viewCount || 0;
  }

  const totalViews = await getTotalViewsForShopSinceBeginningOfMonth(shopId);

  if (totalViews > 30) {
    console.log("bishtar az 30 tas koskesh")
  } else {
    console.log("kamtare madareto gayidam")
  }

  return shopCountryView;
}


