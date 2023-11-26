import { authenticate } from "../shopify.server"

export const loader = async ({ request }) => {
    const { redirect } = await authenticate.admin(request)
    throw redirect("/app")
}
