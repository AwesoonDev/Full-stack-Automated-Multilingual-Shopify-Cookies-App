import { json } from "@remix-run/node";


export async function existingBannerExists(visitingCountry, shopDomain) {
  const existingBannerShop = await prisma.ShopCountryView.findFirst({
    where: {
      shopId: shopDomain,
      country: visitingCountry
    }
  })

  let existingBanner = existingBannerShop.bannerContent || "none"

  if (existingBanner != "none") {
    console.log(existingBanner, "\n\n\n\n\n")
    return existingBanner

  } else {
    return false
  }
}


