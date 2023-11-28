import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import stylesUrl from "~/styles/setup.css";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { Trans, useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import { json } from "@remix-run/node";
import { useEffect } from "react";
import { boundary } from "@shopify/shopify-app-remix";
import { AppProvider } from "@shopify/polaris";
import { authenticate } from "./shopify.server";
import { NavigationMenu } from "@shopify/app-bridge-react";

export function useChangeLanguage(locale) {
  let { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
}

export async function loader({ request }) {
  let locale = await i18next.getLocale(request);
  await authenticate.admin(request);
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "", locale });
}

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }, { rel: "stylesheet", href: polarisStyles }];
};

export default function App() {
  // Get the locale from the loader
  let { apiKey, locale } = useLoaderData();
  let { t, i18n } = useTranslation();


  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider isEmbeddedApp apiKey={apiKey}>
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html >
  );
}


// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
