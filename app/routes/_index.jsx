import { authenticate } from "../shopify.server"
import { boundary } from '@shopify/shopify-app-remix/server';

export const loader = async ({ request }) => {
    const { redirect } = await authenticate.admin(request)
    throw redirect("/app/")
}

export function ErrorBoundary() {
    return boundary.error(useRouteError());
}
export const headers = (headersArgs) => {
    return boundary.headers(headersArgs);
};
