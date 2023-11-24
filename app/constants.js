import { BillingInterval } from "@shopify/shopify-api";

export const MONTHLY_PLAN_ROOKIE = '300 Monthly Visitors'
export const MONTHLY_PLAN_BEGINNER = '1500 Monthly Visitors'
export const MONTHLY_PLAN_ADVANCED = '6000 Monthly Visitors'
export const MONTHLY_PLAN_VETERAN = 'Unlimited Monthly Visitors'
export const ANNUAL_PLAN_ROOKIE = '4000 Annual Visitors'
export const ANNUAL_PLAN_BEGINNER = '20,000 Annual Visitors'
export const ANNUAL_PLAN_ADVANCED = '80,000 Annual Visitors'
export const ANNUAL_PLAN_VETERAN = 'Unlimited Annual Visitors'
export const PLAN_NAMES = [
    MONTHLY_PLAN_ROOKIE,
    MONTHLY_PLAN_BEGINNER,
    MONTHLY_PLAN_ADVANCED,
    MONTHLY_PLAN_VETERAN,
    ANNUAL_PLAN_ROOKIE,
    ANNUAL_PLAN_BEGINNER,
    ANNUAL_PLAN_ADVANCED,
    ANNUAL_PLAN_VETERAN,
]
export const PLAN_NAMES_DICT = {
    rookie_monthly: MONTHLY_PLAN_ROOKIE,
    beginner_monthly: MONTHLY_PLAN_BEGINNER,
    advanced_monthly: MONTHLY_PLAN_ADVANCED,
    veteran_monthly: MONTHLY_PLAN_VETERAN,
    rookie_annual: ANNUAL_PLAN_ROOKIE,
    beginner_annual: ANNUAL_PLAN_BEGINNER,
    advanced_annual: ANNUAL_PLAN_ADVANCED,
    veteran_annual: ANNUAL_PLAN_VETERAN,
}
export const BILLING_DICT = {
    [MONTHLY_PLAN_ROOKIE]: {
        amount: 9,
        currencyCode: 'USD',
        trialDays: 3,
        interval: BillingInterval.Every30Days,
    },
    [MONTHLY_PLAN_BEGINNER]: {
        amount: 19,
        currencyCode: 'USD',
        trialDays: 3,
        interval: BillingInterval.Every30Days,
    }
    ,
    [MONTHLY_PLAN_ADVANCED]: {
        amount: 49,
        currencyCode: 'USD',
        trialDays: 3,
        interval: BillingInterval.Every30Days,
    },
    [MONTHLY_PLAN_VETERAN]: {

        amount: 99,
        currencyCode: 'USD',
        trialDays: 3,
        interval: BillingInterval.Every30Days,
    },

    [ANNUAL_PLAN_ROOKIE]: {
        amount: 89,
        currencyCode: 'USD',
        trialDays: 3,
        interval: BillingInterval.Annual,
    }
    ,
    [ANNUAL_PLAN_BEGINNER]: {
        amount: 199,
        currencyCode: 'USD',
        trialDays: 3,
        interval: BillingInterval.Annual,
    }
    ,
    [ANNUAL_PLAN_ADVANCED]: {
        amount: 499,
        currencyCode: 'USD',
        trialDays: 3,
        interval: BillingInterval.Annual,
    }
    ,
    [ANNUAL_PLAN_VETERAN]: {
        amount: 899,
        currencyCode: 'USD',
        trialDays: 3,
        interval: BillingInterval.Annual,
    },
}
