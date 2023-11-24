import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Trans } from "react-i18next";
import { Button, InlineStack, Spinner } from "@shopify/polaris";
import { BILLING_DICT } from "../constants";
import { BillingInterval } from "@shopify/shopify-api";

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
