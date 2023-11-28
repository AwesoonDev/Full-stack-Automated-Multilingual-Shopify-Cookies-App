import { json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";
import { BlockStack, Button, Card, DataTable, InlineGrid, Layout, Page, RadioButton, Text, useBreakpoints } from "@shopify/polaris"
import { authenticate } from "../shopify.server";
import { Trans } from "react-i18next";
import { rookie, beginner, advanced, veteran, mascot } from "../images";
import { AppsMinor, StarFilledMinor, ConversationMinor } from '@shopify/polaris-icons';
import { useState } from "react";
import prisma from "../db.server";
import { MONTHLY_PLAN_ROOKIE, PLAN_NAMES } from "../constants";


export const loader = async ({ request }) => {
    const { admin, billing } = await authenticate.admin(request);
    const shop = admin.rest.session.shop;
    const embed_url = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${process.env.SHOPIFY_THEME_EXTENSION_ID}/${process.env.SHOPIFY_THEME_EXTENSION_NAME}`
    const shopSettings = await prisma.ShopSettings.findFirst({ where: { shopId: shop } })
    let tone = "business"
    if (shopSettings) {
        tone = shopSettings?.tone || ""
    } else {
        console.log("upserting", shop)
        const setting = await prisma.ShopSettings.upsert({
            where: { shopId: shop },
            update: {},
            create: { shopId: shop }
        })
    }

    const shopViews = await prisma.ShopCountryView.findMany({
        where: { shopId: shop },
    });

    await billing.require({
        plans: PLAN_NAMES,
        isTest: true,
        onFailure: async () => billing.request({ plan: MONTHLY_PLAN_ROOKIE }),
    });

    return json({ ok: true, shop: shop, shopViews: shopViews, embed_url: embed_url, tone: tone })
}



export const action = async ({ request }) => {
    const formData = await request.formData()
    const values = Object.fromEntries(formData)
    if (values?.shop && values?.tone) {
        const setting = await prisma.ShopSettings.upsert({
            where: { shopId: values.shop },
            update: { tone: values.tone },
            create: {
                shopId: values.shop,
                tone: values.tone
            }
        })
    }

    return null
}



export default function Index() {
    const loaderData = useLoaderData()
    const { xsOnly, smUp } = useBreakpoints()

    const cookies = [
        <div className="img-container">
            <img src={veteran} className="plan-img" />
        </div>,
        <div className="img-container">
            <img src={advanced} className="plan-img" />
        </div>,
        <div className="img-container">
            <img src={beginner} className="plan-img" />
        </div>,
        <div className="img-container">
            <img src={rookie} className="plan-img" />
        </div>,
        <div className="img-container">
            <img src={mascot} className="plan-img" />
        </div>,
    ]

    const embedCard = <Card>
        {
            smUp &&
            <InlineGrid columns={["oneThird", "twoThirds"]} gap="500" >
                <div />
                <Text variant="headingXl">
                    <Trans i18nKey={"embedAction"} />
                </Text>
            </InlineGrid>
        }
        <InlineGrid columns={{ xs: 1, sm: ["oneThird", "twoThirds"] }} gap="500" alignItems="center">
            {cookies[0]}
            <BlockStack gap="500" align="space-between" inlineAlign={xsOnly ? "start" : "end"}>
                {
                    xsOnly &&
                    <Text variant="headingXl">
                        <Trans i18nKey={"embedAction"} />
                    </Text>
                }
                <br />
                <Text variant="bodyLg">
                    <Trans i18nKey={"embedInstruction1"} />
                </Text>
                <Text variant="bodyLg">
                    <Trans i18nKey={"embedInstruction2"} />
                </Text>
                <Button
                    icon={AppsMinor}
                    variant="primary"
                    size="large"
                    url={loaderData.embed_url}
                    target="new">
                    <Trans i18nKey={"embedAction"} />
                </Button>
            </BlockStack>
        </InlineGrid>
    </Card>

    const toneCard = <Card>
        {
            smUp &&
            <>
                <Text variant="headingXl">
                    <Trans i18nKey={"toneAction"} />
                </Text>
                <br />
            </>
        }
        <InlineGrid columns={{ xs: 1, sm: ["twoThirds", "oneThird"] }} gap="500" alignItems="center">
            {xsOnly && cookies[1]}
            <BlockStack gap="500" align="space-between">
                {
                    xsOnly &&
                    <Text variant="headingXl">
                        <Trans i18nKey={"toneAction"} />
                    </Text>
                }
                <BlockStack>
                    <ToneForm />
                </BlockStack>
            </BlockStack>
            {smUp && cookies[1]}
        </InlineGrid >
    </Card >

    const chatCard = <Card>
        {
            smUp &&
            <InlineGrid columns={["oneThird", "twoThirds"]} gap="500">
                <div />
                <Text variant="headingXl">
                    <Trans i18nKey={"chatAction"} />
                </Text>
            </InlineGrid>
        }
        <InlineGrid columns={{ xs: 1, sm: ["oneThird", "twoThirds"] }} gap="500" alignItems="center">
            {cookies[2]}
            <BlockStack gap="500" align="space-between" inlineAlign={xsOnly ? "start" : "end"}>
                {
                    xsOnly &&
                    <Text variant="headingXl">
                        <Trans i18nKey={"chatAction"} />
                    </Text>
                }
                <br />
                <Text variant="bodyLg">
                    <Trans i18nKey={"chatInstruction"} />
                </Text>
                <Button
                    icon={ConversationMinor}
                    variant="primary"
                    size="large"
                    url={"https://apps.shopify.com/chatup-ai-powered-live-chat"}
                    target="new">
                    <Trans i18nKey={"chatAction"} />
                </Button>
            </BlockStack>
        </InlineGrid>
    </Card>


    const reviewCard = <Card>
        {
            smUp &&
            <Text variant="headingXl">
                <Trans i18nKey={"reviewAction"} />
            </Text>
        }
        <InlineGrid columns={{ xs: 1, sm: ["twoThirds", "oneThird"] }} gap="500" alignItems="center">
            {xsOnly && cookies[4]}
            <BlockStack gap="500" align="space-between" inlineAlign="start">
                {
                    xsOnly &&
                    <Text variant="headingXl">
                        <Trans i18nKey={"reviewAction"} />
                    </Text>
                }
                <br />
                <Text variant="bodyLg">
                    <Trans i18nKey={"reviewInstruction"} />
                </Text>
                <Button
                    icon={StarFilledMinor}
                    variant="primary"
                    size="large"
                    url={"https://apps.shopify.com/chatup-ai-powered-live-chat#adp-reviews"}
                    target="new">
                    <Trans i18nKey={"reviewAction"} />
                </Button>
            </BlockStack>
            {smUp && cookies[4]}
        </InlineGrid>
    </Card>



    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <BlockStack gap="500">
                        {embedCard}
                        {toneCard}
                        {chatCard}
                        {reviewCard}
                    </BlockStack>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                    <Card>
                        <Text variant="headingXl">
                            <Trans i18nKey={"statsTitle"} />
                        </Text>
                        <BannerStats />
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}

const ToneForm = () => {
    const loaderData = useLoaderData();
    const [tone, setTone] = useState(loaderData.tone)
    const [init, setInit] = useState(loaderData.tone)

    onreset = () => {
        setTone(init)
    }

    onsubmit = () => {
        setInit(tone)
    }

    return (
        <Form data-save-bar method="post">
            <input type="hidden" name="shop" value={loaderData.shop} />
            <RadioButton
                name="tone"
                value="business"
                checked={tone === "business"}
                onChange={() => setTone("business")}
                label={
                    <Card>
                        <Text variant="headingMd">
                            {<Trans i18nKey={"business"} />}
                        </Text>
                        <i>
                            {<Trans i18nKey={"toneBusiness"} />}
                        </i>
                    </Card>
                }
            />
            <RadioButton
                name="tone"
                value="personal"
                checked={tone === "personal"}
                onChange={() => setTone("personal")}
                label={
                    <Card>
                        <Text variant="headingMd">
                            {<Trans i18nKey={"personal"} />}
                        </Text>
                        <i>
                            {<Trans i18nKey={"tonePersonal"} />}
                        </i>
                    </Card>
                }
            />
        </Form>
    )
}

const BannerStats = () => {
    const loaderData = useLoaderData();
    const rows = loaderData.shopViews.map(view => [
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img style={{ width: 30 + 'px' }} src={`https://flagsapi.com/${view.country}/shiny/64.png`} alt={`${view.country} flag`} />
            &nbsp; {view.country}
        </div>,
        `${Math.round((view.acceptanceCount) * 100 / (view.viewCount))}%`
    ]);

    return (
        <DataTable
            columnContentTypes={['text', 'numeric',]}
            headings={['Country', 'Acceptance Rate']}
            rows={rows}
        />
    )
}
