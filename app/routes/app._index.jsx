import {
  Page,
  Layout,
  Button,
  BlockStack,
  TextField, DataTable, LegacyCard
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { Form as RemixForm, useActionData, useLoaderData } from "@remix-run/react";
import { useTransition, useState } from 'react';
import { upsertShopDetails } from "./server_components/upsertShopDetails";
import stylesUrl from "~/styles/setup.css";
import { useTypeWriterEffect } from "./ui_effects/intervallyTyped";

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

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
  let companyLogo = "https://chatup-demo.myshopify.com/cdn/shop/files/english.png?v=1693027883&width=180"
  const shopId = useLoaderData();

  upsertShopDetails(shopId.shop)
  const [temperature, setTemperature] = useState('0');
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  console.log("Loaded Data:", shopId);


  const handleTemperatureChange = (newValue) => {
    setTemperature(newValue);
  };
  console.log(shopId.shopSettings, "\n\n\n\n\n\n\n\n")


  const rows = shopId.shopSettings.map(view => [
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img style={{ width: 30 + 'px' }} src={`https://flagsapi.com/${view.country}/shiny/64.png`} alt={`${view.country} flag`} />
      &nbsp; {view.country}
    </div>,
    `${Math.round((view.acceptanceCount) * 100 / (view.viewCount))}%`
  ]);



  // Empty dependency array to run only once after mount
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <LegacyCard title="Banner Personality" sectioned>


            <div className="main-container">
              <div className="radio-buttons">
                <label className="custom-radio">
                  <input type="radio" name="radio" defaultChecked />
                  <span className="radio-btn">
                    <i className="las la-check"></i>
                    <div className="hobbies-icon">
                      <div className="intervallyTyped" data-name="a">We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies. For more information on how we...</div>
                      <h3>Business Tone</h3>
                    </div>
                  </span>
                </label>
                <label className="custom-radio">
                  <input type="radio" name="radio" defaultChecked />
                  <span className="radio-btn">
                    <i className="las la-check"></i>
                    <div className="hobbies-icon">
                      <div className="intervallyTyped" data-name="b">Just letting you know, we use cookies to make your experience on our site as awesome as possible. If you're okay with our delicious cookies, just keep browsing...</div>
                      <h3>Personal Tone</h3>
                    </div>
                  </span>
                </label>

                {/* ... other radio options */}
              </div>
            </div>

          </LegacyCard>
        </Layout.Section>
        <Layout.Section style={{ display: 'none' }} variant="oneThird">
          <LegacyCard title="Acceptance Rate per Country" sectioned>

            <DataTable
              columnContentTypes={['text', 'numeric',]}
              headings={['Country', 'Acceptance Rate']}
              rows={rows}
            />



          </LegacyCard>
        </Layout.Section>

      </Layout>


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
              <input type="hidden" name="shopId" value={shopId.shop} />
              <Button primary submit disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Temperature'}
              </Button>
            </RemixForm>
            {useActionData?.error && (
              <p style={{ color: 'red' }}>{actionData.error}</p>
            )}
          </Layout.Section>

        </Layout>

      </BlockStack>

    </Page>
  );

}
