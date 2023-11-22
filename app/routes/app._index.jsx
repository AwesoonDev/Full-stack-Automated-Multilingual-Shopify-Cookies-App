import {
  Page,
  Layout,
  DataTable, LegacyCard, ContextualSaveBar, Frame
} from "@shopify/polaris";
import { authenticate, MONTHLY_PLAN_ROOKIE, MONTHLY_PLAN_BEGINNER } from "../shopify.server";
import { Form as RemixForm, useActionData, useLoaderData } from "@remix-run/react";
import { useTransition, useEffect, useState } from 'react';
import { upsertShopDetails } from "./server_components/upsertShopDetails";
import { updateShopTemp } from "./server_components/updateShopTemp";



export const loader = async ({ request }) => {
  const { admin, billing } = await authenticate.admin(request);
  const shop = admin.rest.session.shop;
  const shopSettings = await prisma.ShopCountryView.findMany({
    where: { shopId: shop },
  });
  const tempSettings = await prisma.ShopSettings.findFirst({ where: { shopId: shop } })
  const temperature = tempSettings.temperature
  upsertShopDetails(shop)


  await billing.require({
    plans: ([MONTHLY_PLAN_ROOKIE]),
    isTest: true,
    onFailure: async () => billing.request({ plan: (MONTHLY_PLAN_ROOKIE) }),
  });





  return { shop, shopSettings, temperature }
};


export const action = async ({ request }) => {
  const formData = await request.formData();
  const temperatureValue = formData.get('temperature');
  const shopId = formData.get('shopId');
  console.log('Received temperature:', temperatureValue);
  const temperature = parseFloat(temperatureValue);
  if (!temperatureValue || !shopId) {
    console.error('Missing fields');
    return json({ error: 'Shop ID and temperature are required.' }, { status: 400 });
  }
  if (isNaN(temperature)) {
    console.error('Invalid temperature value');
    return json({ error: 'Invalid temperature value.' }, { status: 400 });
  }

  const updateShopTempGo = await updateShopTemp(shopId, temperatureValue);
  const updatedRecord = await prisma.shopSettings.findFirst({ where: { shopId } });
  return updatedRecord;
};



export default function Index() {
  const shopId = useLoaderData();
  const loadedTemperature = shopId.temperature
  const [temperature, setTemperature] = useState(loadedTemperature.toString());
  const transition = useTransition();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleRadioChange = (event) => {
    setHasUnsavedChanges(true);
    event.currentTarget.form.submit();
  };

  const handleDiscard = () => {
    setHasUnsavedChanges(false);
  };

  const handleTemperatureChange = (newValue) => {
    setTemperature(newValue);
    setHasUnsavedChanges(true);
  };

  const rows = shopId.shopSettings.map(view => [
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img style={{ width: 30 + 'px' }} src={`https://flagsapi.com/${view.country}/shiny/64.png`} alt={`${view.country} flag`} />
      &nbsp; {view.country}
    </div>,
    `${Math.round((view.acceptanceCount) * 100 / (view.viewCount))}%`
  ]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.error) {
      setError(actionData.error);
    } else {
      setSuccess('Temperature updated successfully.');
    }
  }, [actionData]);

  return (
    <Frame>
      {hasUnsavedChanges && (
        <ContextualSaveBar
          message="Unsaved changes"
          saveAction={{
            loading: false,
            disabled: true, // Disabled because the form submits automatically
          }}
          discardAction={{
            onAction: handleDiscard,
          }}
        />
      )}
      <Page>
        <Layout>
          <Layout.Section>
            <LegacyCard title="Banner Personality" sectioned>
              <RemixForm method="post"
                encType="application/x-www-form-urlencoded"
                id="temperatureForm"
                data-save-bar
                onClick="console.log('submit', new FormData(event.target)); event.preventDefault();">
                <div className="main-container">
                  <div className="radio-buttons" onChange={handleRadioChange}>
                    <label className="custom-radio">
                      <input type="radio" name="temperature" value="0.25" defaultChecked={temperature === "0.25"} />
                      <span className="radio-btn">
                        <i className="las la-check"></i>
                        <div className="hobbies-icon">
                          <div className="intervallyTyped" data-name="a">Just letting you know, we use cookies to make your experience on our site as awesome as possible. If you're okay with our delicious cookies...</div>
                          <h3>Personable Tone</h3>
                        </div>
                      </span>
                    </label>
                    <label className="custom-radio">
                      <input type="radio" name="temperature" value="1.5" defaultChecked={temperature === "1.5"} />
                      <span className="radio-btn">
                        <i className="las la-check"></i>
                        <div className="hobbies-icon">
                          <div className="intervallyTyped" data-name="b">We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies. For more...</div>
                          <h3>Business Tone</h3>
                        </div>
                      </span>
                    </label>
                  </div>
                </div>
                <input type="hidden" name="shopId" value={shopId.shop} />
              </RemixForm>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </Page>
    </Frame>
  );
}
