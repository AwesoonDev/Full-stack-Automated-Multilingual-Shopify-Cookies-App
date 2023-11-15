// export async function updatingBannerView(shopId, countryCode) {
//   // Check if a ShopCountryView for the given shopId and country already exists
//   const existingShopCountryView = await prisma.ShopCountryView.findFirst({
//     where: {
//       shopId: shopId,
//       country: countryCode,
//     },
//     orderBy: {
//       id: 'desc', // Order by 'id' in descending order to get the latest record
//     },
//   });

//   let shopCountryView;

//   if (existingShopCountryView) {
//     // Make sure that the id of the existing record is correctly retrieved
//     const existingViewId = existingShopCountryView.id;

//     // If the record exists, increment the view count
//     shopCountryView = await prisma.ShopCountryView.update({
//       where: {
//         id: existingViewId, // Use the retrieved id here
//       },
//       data: {
//         viewCount: {
//           increment: 1,
//         },
//       },
//     });
//   } else {
//     // If it does not exist, create a new record with a view count of 1
//     shopCountryView = await prisma.ShopCountryView.create({
//       data: {
//         shopId: shopId,
//         country: countryCode,
//         viewCount: 1,
//       },
//     });
//   }
//   return shopCountryView
// }