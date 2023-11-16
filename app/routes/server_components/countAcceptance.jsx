import { authenticate } from '../../shopify.server';
import prisma from '../../db.server';


export async function action({ request }) {
  const storefront = await authenticate.public.appProxy(request);


  const requestBody = await request.json();
  console.log(requestBody)
  console.log(request)
  const acceptance = requestBody.accepted;

  const shopId = requestBody.shopId;
  const countryCode = requestBody.countryCode;


  const existingShopCountryView = await prisma.ShopCountryView.findFirst({
    where: {
      shopId: shopId,
      country: countryCode,
    }
  });

  if (existingShopCountryView) {

    if (acceptance) {
      const updatedShopCountryView = await prisma.ShopCountryView.update({
        where: {
          id: existingShopCountryView.id,
        },
        data: {
          acceptanceCount: {
            increment: 1,
          },
        },
      });

      return updatedShopCountryView;
    } else {

      return existingShopCountryView;
    }
  } else {

    console.error('No existing view found for shopId:', shopId, 'and countryCode:', countryCode);

  }
}
