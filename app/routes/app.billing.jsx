import { Badge, BlockStack, Box, Button, Card, Divider, InlineGrid, InlineStack, Page, Text } from "@shopify/polaris";
import { Trans, useTranslation } from "react-i18next";
import { PlanButton } from "./app.billing.planButton";
import { PLAN_NAMES_DICT } from "../constants";
import {
    ChevronLeftMinor,
    ChevronRightMinor
} from '@shopify/polaris-icons';
import { advanced, beginner, rookie, veteran } from "../images";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

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
        await billing.request({ plan: values?.plan })
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
                    <Badge size="small" tone="success">
                        <Trans i18nKey={"freeTrial"} />
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
            <InlineGrid columns="2" gap="400">
                <BlockStack>
                    <Text alignment="center" fontWeight="bold">
                        <Trans i18nKey={`${plan}Monthly`} />
                    </Text>
                    <PlanButton name={PLAN_NAMES_DICT[`${plan}_monthly`]} />
                </BlockStack>
                <BlockStack>
                    <Text alignment="center" fontWeight="bold">
                        <Trans i18nKey={`${plan}Annual`} />
                    </Text>
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
