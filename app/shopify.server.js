import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  LATEST_API_VERSION,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-10";
import prisma from "./db.server";
import { BillingInterval } from "@shopify/shopify-api";



export const MONTHLY_PLAN_ROOKIE = '300 Monthly Visitors';
export const MONTHLY_PLAN_BEGINNER = '1500 Monthly Visitors';
export const MONTHLY_PLAN_ADVANCED = '6000 Monthly Visitors';
export const MONTHLY_PLAN_VETERAN = 'Unlimited Visitors';
export const ANNUAL_PLAN_ROOKIE = 'Rookie'
export const ANNUAL_PLAN_BEGINNER = 'Beginner'
export const ANNUAL_PLAN_ADVANCED = 'Advanced'
export const ANNUAL_PLAN_VETERAN = 'Veteran'




const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),

  billing: {
    [MONTHLY_PLAN_ROOKIE]: {
      name: "Whats Good",
      amount: 9,
      currencyCode: 'USD',
      trialDays: 3,
      interval: BillingInterval.Every30Days,
    },
    [MONTHLY_PLAN_BEGINNER]: {
      name: "Whats Good",
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
      interval: BillingInterval.Every30Days,
    }
    ,
    [ANNUAL_PLAN_BEGINNER]: {
      amount: 199,
      currencyCode: 'USD',
      trialDays: 3,
      interval: BillingInterval.Every30Days,
    }
    ,
    [ANNUAL_PLAN_ADVANCED]: {
      amount: 499,
      currencyCode: 'USD',
      trialDays: 3,
      interval: BillingInterval.Every30Days,
    }
    ,
    [ANNUAL_PLAN_VETERAN]: {
      amount: 899,
      currencyCode: 'USD',
      trialDays: 3,
      interval: BillingInterval.Every30Days,
    },
  }

});


export default shopify;


export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
