import db from "../../db.server";


export async function removeCustomer(shopId) {
  await db.shopSettings.deleteMany({ where: { shopId: shopId } });
  console.log("Shop Deleted \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
}