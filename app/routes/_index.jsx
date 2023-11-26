import { authenticate } from "../shopify.server"

export const loader = async ({ request }) => {
    const { redirect } = await authenticate.admin(request)
    const url = new URL(request.url);
    throw redirect(`/app?${url.searchParams.toString()}`);
}
