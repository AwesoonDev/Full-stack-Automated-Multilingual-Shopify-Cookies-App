import {
  Card,
  Link,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  Button,
  InlineStack,
} from "@shopify/polaris";
import { ExternalMinor } from '@shopify/polaris-icons';
import { Trans, useTranslation } from "react-i18next";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { useEffect } from "react";

export let handle = { i18n: "common", };


export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const shop = admin.rest.session.shop;
  const shopSettings = await prisma.ShopCountryView.findMany({
    where: { shopId: shop },
  });
  const tempSettings = await prisma.ShopSettings.findFirst({ where: { shopId: shop } })
  const temperature = tempSettings.temperature
  console.log(shop, shopSettings)
  return { shop, shopSettings, temperature }
};


export default function Onboarding() {
  return (
    <Page>
      <ui-title-bar title="Onboarding" />
      <OnboardCard step={1} />
    </Page>
  );
}

const OnboardCard = ({ step }) => {
  const loadedData = useLoaderData()
  const { t } = useTranslation()
  const navigate = useNavigate()
  function handleClick() {
    console.log(step)
    switch(step) {
      case 1:
        console.log("hello 1")
        navigate("/embed", {target: "new"})
    }
  }

  return (
    <Card>
      <InlineGrid columns={{ xs: 1, sm: ["oneThird", "twoThirds"] }} gap="500">
        <div className="img-container">
          <img src={"https://cdn.shopify.com/s/files/1/0789/8870/6084/files/2-paper.svg"} className="plan-img" />
        </div>
        <BlockStack align="space-between">
          <BlockStack gap="400" inlineAlign="start">
            <Text as="p" color="subdued" fontWeight="medium">
              {t(`step${step}`)}
            </Text>
            <Text variant="headingLg" as="h5">
              {t(`action${step}`)}
            </Text>
            <Text variant="bodyLg" as="p">
              <Trans
                i18nKey={`instruction${step}`}
                components={[<strong />]}
              />
            </Text>
            <Button
              icon={ExternalMinor}
              variant="primary"
              size="large"
              onClick={handleClick}
              >
              {t(`action${step}`)}
            </Button>
          </BlockStack>
          <br />
          <InlineStack align="space-between">
            <InlineStack gap="500">
              <Button url="https://www.google.com" target="new">Back</Button>
              <Link url="https://www.google.com" target="new">Skip</Link>
            </InlineStack>
            <Button>Next</Button>
          </InlineStack>
        </BlockStack>
      </InlineGrid>
    </Card>
  )
}
