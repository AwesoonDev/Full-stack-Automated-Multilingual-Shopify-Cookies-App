import { Badge, BlockStack, Box, Button, Card, Divider, InlineGrid, InlineStack, Page, Spinner, Text } from "@shopify/polaris";
import { Trans, useTranslation } from "react-i18next";
import { PLAN_NAMES_DICT, BILLING_DICT } from "../constants";
import {
    ChevronLeftMinor,
    ChevronRightMinor
} from '@shopify/polaris-icons';
import { advanced, beginner, rookie, veteran } from "../images";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { BillingInterval } from "@shopify/shopify-api";

export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    const charges = await admin.rest.resources.RecurringApplicationCharge.find({ session })
    const name = charges?.name
    return json({ ok: true, name: name })
}

export const action = async ({ request }) => {
    const formData = await request.formData()
    const values = Object.fromEntries(formData)
    if (values?.plan) {
        const { billing } = await authenticate.admin(request);
        await billing.request({ isTest: false,  plan: values?.plan })
    }

    return null
}

export default function Billing() {
    return (
        <Page narrowWidth>
            <PlanCarousel />
        </Page >
    )
}

const PlanCarousel = () => {
    return (
        <Card>
            <div className="slider">
                <div id="plan-carousel" className="plans">
                    <PlanContent plan={'rookie'} src={rookie} right={"beginner"} />
                    <PlanContent plan={'beginner'} src={beginner} left={"rookie"} right={"advanced"} />
                    <PlanContent plan={'advanced'} src={advanced} left={"beginner"} right={"veteran"} />
                    <PlanContent plan={'veteran'} src={veteran} left={"advanced"} />
                </div>
            </div>
        </Card>
    )
}


const PlanContent = ({ plan, src, left, right }) => {
    const { t } = useTranslation();

    const handleLeft = () => {
        document.getElementById(`${left}`).scrollIntoView({ block: "center", inline: "center" })
    }

    const handleRight = () => {
        document.getElementById(`${right}`).scrollIntoView({ block: "center", inline: "center" })
    }

    return (
        <div style={{ width: "100%" }} id={`${plan}`}>
            <div className="plan-img-container">
                <img src={src} className="plan-img" />
            </div>
            <InlineStack align="space-between" blockAlign="center">
                <Button disabled={!left} icon={left ? ChevronLeftMinor : false} onClick={() => handleLeft()}></Button>
                <InlineStack gap="100">
                    <Text variant="headingXl">
                        <Trans i18nKey={`${plan}`} />
                    </Text>
                    <Badge tone="success" size="small">
                    {/* <div className="cookie-badge" > */}
                        <Trans i18nKey={"freeTrial"} />
                    {/* </div> */}
                    </Badge>
                </InlineStack>
                <Button disabled={!right} icon={right ? ChevronRightMinor : false} onClick={() => handleRight()}></Button>
            </InlineStack>
            <br />
            <Divider />
            <br />
            <PlanFeature name={t("feature1")} />
            <br />
            <InlineGrid columns="2" gap="400">
                <PlanFeature name={t("feature2")} />
                <PlanFeature name={t("feature3")} />
                <PlanFeature name={t("feature4")} />
                <PlanFeature name={t("feature5")} include={["advanced", "veteran"].includes(plan)} />
            </InlineGrid>
            <br />
            <Divider />
            <br />
            <InlineGrid columns="2" gap="400" alignItems="center">
                <BlockStack>
                    {/* <div className="cookie-badge" > */}
                    <Text alignment="center" fontWeight="bold">
                        <Trans i18nKey={`${plan}Monthly`} />
                    </Text>
                    {/* </div> */}
                    <PlanButton name={PLAN_NAMES_DICT[`${plan}_monthly`]} />
                </BlockStack>
                <BlockStack>
                    {/* <div className="cookie-badge" > */}
                    <Text alignment="center" fontWeight="bold">
                        <Trans i18nKey={`${plan}Annual`} />
                    </Text>
                    {/* </div> */}
                    <PlanButton name={PLAN_NAMES_DICT[`${plan}_annual`]} />
                </BlockStack>
            </InlineGrid>
        </div>
    )
}

export const PlanFeature = ({ name, include = true }) => {
    return <PaddedCell padding={["0", "5", "0", "5"]}>
        <BlockStack align="space-between">
            <BlockStack gap="100">
                <div className={`plan-feature${include ? "" : " not-included"}`}>
                    {!include ? <div id="xmark" /> : <div id="checkmark" />}
                    <p>
                        {name}
                    </p>
                </div>
            </BlockStack>
            <div />
        </BlockStack>
    </PaddedCell>
}

export const PaddedCell = ({ children, padding }) => {
    return (
        <Box
            paddingBlockStart={padding && padding[0] ? padding[0] : "0"} //top
            paddingInlineEnd={padding && padding[1] ? padding[1] : "0"} //right
            paddingBlockEnd={padding && padding[2] ? padding[2] : "0"} //bottom
            paddingInlineStart={padding && padding[3] ? padding[3] : "0"} //left
        >
            {children}
        </Box>
    )
}


export const PlanButton = ({ name }) => {
    const loaderData = useLoaderData()
    const current = name == loaderData?.name
    const navigation = useNavigation()
    const busy = navigation.state == "submitting" && navigation.formData.get("plan") == name
    const normal = !busy && !current
    const redirecting = busy && !current

    return (
        <Form method="post">
            <input type="hidden" name="plan" value={name} />
            <Button
                submit
                disabled={current || busy}
                primary
                fullWidth
                id="plan-button"
            >
                <div style={{ minHeight: "1.5rem", display: "flex", alignItems: "center" }}>
                    {
                        current && <Trans i18nKey={"currentPlan"} />
                    }
                    {
                        normal && BILLING_DICT[name]?.interval === BillingInterval.Every30Days &&
                        <Trans i18nKey={"xPerMonth"} values={{ x: BILLING_DICT[name]?.amount }} />
                    }
                    {
                        normal && BILLING_DICT[name]?.interval === BillingInterval.Annual &&
                        <Trans i18nKey={"xPerAnnum"} values={{ x: BILLING_DICT[name]?.amount }} />
                    }
                    {
                        redirecting &&
                        <InlineStack gap="100" blockAlign="center">
                            <Spinner size="small" />
                            <Trans i18nKey={"redirecting"} />
                        </InlineStack>
                    }
                </div>
            </Button>
        </Form>
    )
}

