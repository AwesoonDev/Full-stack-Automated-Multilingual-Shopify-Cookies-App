import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { json } from '@remix-run/node';

export async function upsertShopDetails(shopId) {

  let temperature = parseFloat(0);
  const existingShop = await prisma.shopSettings.findFirst({ where: { shopId: shopId } })
  console.log(existingShop, " \n\n\n\n\n\n\n\n\n\n\n")
  if (existingShop) {
    console.log('shop exists and will ignore hitting the databse \n\n\n\n\n\n\n\n\n\n\n:');
    return shopId
  }

  try {
    const setting = await prisma.shopSettings.upsert({
      where: { shopId: shopId },
      update: { temperature: temperature },
      create: {
        shopId: shopId,
        temperature: temperature,
      },
    });

    console.log('shop saved \n\n\n\n\n\n\n\n\n\n\n:', setting);
    return json({ shopId: shopId });
  } catch (error) {
    console.error('Error saving temperature:', error);
    return json({ error: 'Failed to save temperature' }, { status: 500 });
  }

}

