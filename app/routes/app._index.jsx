import {
  Page,
  Layout,
  Button,
  BlockStack,
  TextField, DataTable
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { fetchShopDetails } from "./server_components/fetchShopDetails";
import { json } from '@remix-run/node';
import { Form as RemixForm, useActionData, useLoaderData } from "@remix-run/react";
import { useTransition, useState } from 'react';
import { upsertShopDetails } from "./server_components/upsertShopDetails";


export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const shop = admin.rest.session.shop;
  console.log(shop, '\n\n\n\n\n\n\n\n\n')


  const shopSettings = await prisma.ShopCountryView.findMany({
    where: { shopId: shop },
  });

  return { shop, shopSettings }
};


export default function Index() {

  const shopId = useLoaderData();

  upsertShopDetails(shopId.shop)
  const [temperature, setTemperature] = useState('0');
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";
  console.log("Loaded Data:", shopId);


  const handleTemperatureChange = (newValue) => {
    setTemperature(newValue);
  };
  console.log(shopId.shopSettings)
  const rows = shopId.shopSettings.map(view => [
    view.country,
    view.viewCount.toString(),
  ]);

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <RemixForm action="/server_components/admin" method="post" encType="application/x-www-form-urlencoded">
              <TextField
                label="AI Temperature Setting"
                type="number"
                name="temperature"
                value={temperature}
                onChange={handleTemperatureChange}
                min={0}
                max={2}
                step={0.01}
                autoComplete="off"
              />
              <input type="hidden" name="shopId" value={shopId} />
              <Button primary submit disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Temperature'}
              </Button>
            </RemixForm>
            {useActionData?.error && (
              <p style={{ color: 'red' }}>{actionData.error}</p>
            )}
          </Layout.Section>
          <Layout.Section>
            <DataTable
              columnContentTypes={['text', 'numeric']}
              headings={['Country', 'View Count']}
              rows={rows}
            />
          </Layout.Section>
        </Layout>

      </BlockStack>
    </Page>
  );
}