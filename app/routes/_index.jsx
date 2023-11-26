import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server"

export const loader = async ({ request }) => {
    const { redirect } = await authenticate.admin(request)
    const url = new URL(request.url);
    if (url.searchParams.get("shop")) {
        throw redirect(`/app?${url.searchParams.toString()}`);
    }

    return json({ ok: true })
}

export default function App() {
    return (
        <div>
            empty
        </div>
    )
}
