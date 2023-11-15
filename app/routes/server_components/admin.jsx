import { json } from '@remix-run/node';
import { PrismaClient } from '@prisma/client';
import { updateShopTemp } from '../server_components/updateShopTemp'

const prisma = new PrismaClient();


export async function action({ request }) {

  const formData = await request.formData();
  const temperatureValue = formData.get('temperature');
  const shopId = formData.get('shopId');
  console.log(shopId + "\n\n\n\n\n")
  console.log('Received temperature:', temperatureValue);
  const temperature = parseFloat(temperatureValue);
  // Validate the temperatureValue and shopId
  if (!temperatureValue || !shopId) {
    console.error('Missing fields');
    return json({ error: 'Shop ID and temperature are required.' }, { status: 400 });
  }

  // Check if the temperature is a valid number should not be needed fwith radio buttons
  if (isNaN(temperature)) {
    console.error('Invalid temperature value');
    return json({ error: 'Invalid temperature value.' }, { status: 400 });
  }


  const updateShopTempGo = await updateShopTemp(shopId, temperatureValue)
  const updatedRecord = await prisma.shopSettings.findFirst({ where: { shopId } })
  return updatedRecord
};
