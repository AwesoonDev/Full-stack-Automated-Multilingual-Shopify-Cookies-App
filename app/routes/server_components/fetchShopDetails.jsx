import { upsertShopDetails } from "./upsertShopDetails";
import { json } from '@remix-run/node';


export async function fetchShopDetails(admin) {
  try {
    const graphqlResponse = await admin.graphql(`
      {
        shop {
          myshopifyDomain
        }
      }`);
    if (!graphqlResponse.ok) {
      throw new Error(`Network response was not ok: ${graphqlResponse.status}`);
    }
    const jsonResponse = await graphqlResponse.json();
    const {
      data: {
        shop: { myshopifyDomain }
      }
    } = jsonResponse;
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", `Shop Domain received: ${myshopifyDomain}`, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
    console.log(myshopifyDomain, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
    const regOrUpdateShop = await upsertShopDetails(myshopifyDomain);

    return json({ shopId: myshopifyDomain });
  } catch (error) {
    throw new Error(`Error fetching shop details: ${error.message}`);
  }
}