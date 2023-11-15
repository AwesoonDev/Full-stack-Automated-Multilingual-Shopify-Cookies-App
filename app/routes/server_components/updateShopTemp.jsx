import { PrismaClient } from '@prisma/client';
import { json } from '@remix-run/node';
const prisma = new PrismaClient();


export async function updateShopTemp(shopId, temperatureValue) {

  try {
    const latestSetting = await prisma.shopSettings.findMany({
      where: { shopId: shopId },
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });

    // Check if a setting was found 
    if (latestSetting.length > 0) {
      // If found, update it, this means if a shop uninstalled and reinstalled their latest version gets updated
      await prisma.shopSettings.update({
        where: { id: latestSetting[0].id },
        data: { temperature: parseFloat(temperatureValue) },
      });
    } else {
      // If no setting was found, create a new one
      await prisma.shopSettings.create({
        data: {
          shopId: shopId,
          temperature: parseFloat(temperatureValue),
        },
      });
    }

    console.log('temp updated \n\n\n\n\n\n\n\n\n\n\n:');
    return latestSetting
  } catch (error) {
    console.error('Error saving temperature:', error);
    return json({ error: 'Failed to save temperature' }, { status: 500 });
  }
}