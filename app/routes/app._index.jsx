import { json } from "@remix-run/node"
import { Form, Form as RemixForm, useActionData, useLoaderData } from "@remix-run/react";
import { BlockStack, Button, Card, InlineGrid, Layout, Page, RadioButton, Text, useBreakpoints } from "@shopify/polaris"
import { authenticate } from "../shopify.server";
import { Trans } from "react-i18next";
import { cookie_1, cookie_2, cookie_3, cookie_4 } from "../images";
import { AppsMinor, StarFilledMinor, ConversationMinor } from '@shopify/polaris-icons';
import { useEffect, useRef, useState, useTransition } from "react";
import prisma from "../db.server";


export const loader = async ({ request }) => {
    const { admin, billing } = await authenticate.admin(request);
    const shop = admin.rest.session.shop;
    const embed_url = `https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${process.env.SHOPIFY_THEME_EXTENSION_ID}/${process.env.SHOPIFY_THEME_EXTENSION_NAME}`
    const shopSettings = await prisma.ShopSettings.findFirst({ where: { shopId: shop } })
    console.log(shopSettings)
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

    return json({ ok: true, shop: shop, embed_url: embed_url, tone: tone })
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
        console.log("hello there")
        console.log(setting)
    }

    console.log("general kenobi")
    console.log(values.tone)
    console.log(values.shop)
    return json({ok: true, shop: values?.shop, tone: values?.tone})
}



export default function Index() {
    const loaderData = useLoaderData()
    const { xsOnly, smUp } = useBreakpoints()

    const cookies = [
        <div className="img-container">
            <img src={cookie_1} className="plan-img" />
        </div>,
        <div className="img-container">
            <img src={cookie_2} className="plan-img" />
        </div>,
        <div className="img-container">
            <img src={cookie_3} className="plan-img" />
        </div>,
        <div className="img-container">
            <img src={cookie_4} className="plan-img" />
        </div>
    ]

    const embedCard = <Card>
        <InlineGrid columns={{ xs: 1, sm: ["oneThird", "twoThirds"] }} gap="500">
            {cookies[0]}
            <BlockStack gap="500" align="space-between" inlineAlign={xsOnly ? "start" : "end"}>
                <Text variant="headingXl">
                    <Trans i18nKey={"embedAction"} />
                </Text>
                <Text variant="bodyLg">
                    <Trans i18nKey={"embedInstruction1"} components={[<strong />]} />
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
        <InlineGrid columns={{ xs: 1, sm: ["twoThirds", "oneThird"] }} gap="500">
            {xsOnly && cookies[1]}
            <BlockStack gap="500" align="space-between">
                <Text variant="headingXl">
                    <Trans i18nKey={"toneAction"} />
                </Text>
                <BlockStack>
                    <ToneForm />
                </BlockStack>
            </BlockStack>
            {smUp && cookies[1]}
        </InlineGrid >
    </Card >

    const reviewCard = <Card>
        <InlineGrid columns={{ xs: 1, sm: ["oneThird", "twoThirds"] }} gap="500">
            {cookies[2]}
            <BlockStack gap="500" align="space-between" inlineAlign={xsOnly ? "start" : "end"}>
                <Text variant="headingXl">
                    <Trans i18nKey={"reviewAction"} />
                </Text>
                <Text variant="bodyLg">
                    <Trans i18nKey={"embedInstruction1"} components={[<strong />]} />
                </Text>
                <Text variant="bodyLg">
                    <Trans i18nKey={"embedInstruction2"} />
                </Text>
                <Button
                    icon={StarFilledMinor}
                    variant="primary"
                    size="large"
                    url={loaderData.embed_url}
                    target="new">
                    <Trans i18nKey={"reviewAction"} />
                </Button>
            </BlockStack>
        </InlineGrid>
    </Card>

    const chatCard = <Card>
        <InlineGrid columns={{ xs: 1, sm: ["twoThirds", "oneThird"] }} gap="500">
            {xsOnly && cookies[3]}
            <BlockStack gap="500" align="space-between" inlineAlign="start">
                <Text variant="headingXl">
                    <Trans i18nKey={"chatAction"} />
                </Text>
                <Text variant="bodyLg">
                    <Trans i18nKey={"embedInstruction1"} components={[<strong />]} />
                </Text>
                <Text variant="bodyLg">
                    <Trans i18nKey={"embedInstruction2"} />
                </Text>
                <Button
                    icon={ConversationMinor}
                    variant="primary"
                    size="large"
                    url={loaderData.embed_url}
                    target="new">
                    <Trans i18nKey={"chatAction"} />
                </Button>
            </BlockStack>
            {smUp && cookies[3]}
        </InlineGrid>
    </Card>


    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <BlockStack gap="500">
                        {embedCard}
                        {toneCard}
                        {reviewCard}
                        {chatCard}
                    </BlockStack>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                    <Card>
                        <Text variant="headingXl">
                            Banner stats
                        </Text>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}

const ToneForm = () => {
    const loaderData = useLoaderData();
    const actionData = useActionData();
    const [tone, setTone] = useState(actionData?.tone ?? loaderData?.tone)

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




// <RemixForm method="post"
// encType="application/x-www-form-urlencoded"
// id="toneeratureForm"
// data-save-bar
// onClick="console.log('submit', new FormData(event.target)); event.preventDefault();">
// <div className="main-container">
//     <div className="radio-buttons" >
//         <label className="custom-radio">
//             <input type="radio" name="toneerature" value="business" defaultChecked={true} />
//             <span className="radio-btn">
//                 <i className="las la-check"></i>
//                 <div className="hobbies-icon">
//                     <div className="intervallyTyped" data-name="a">
//                         {<Trans i18nKey={"toneBusiness"} />}
//                     </div>
//                     <h3>{<Trans i18nKey={"business"} />}</h3>
//                 </div>
//             </span>
//         </label>
//         <label className="custom-radio">
//             <input type="radio" name="toneerature" value="personal" defaultChecked={false} />
//             <span className="radio-btn">
//                 <i className="las la-check"></i>
//                 <div className="hobbies-icon">
//                     <div className="intervallyTyped" data-name="b">
//                         {<Trans i18nKey={"tonePersonal"} />}
//                     </div>
//                     <h3>{<Trans i18nKey={"personal"} />}</h3>
//                 </div>
//             </span>
//         </label>
//     </div>
// </div>
// <input type="hidden" name="shopId" value={""} />
// </RemixForm>