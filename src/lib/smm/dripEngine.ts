// // lib/smm/dripEngine.ts
// import { Order } from "@/lib/types";

// export function randomBetween(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// export async function executeDripRun(campaign: Order) {
//   const {
//     totalOrdered,
//     quantityFrom,
//     quantityTo,
//     intervalMinutes,
//   } = campaign.dripFeed;

//   if (totalOrdered >= campaign.quantity) return;

//   const remaining = campaign.quantity - totalOrdered;

//   let orderQty = randomBetween(quantityFrom, quantityTo);
//   if (orderQty > remaining) orderQty = remaining;

//   const payload = {
//     key: process.env.SMM_API_KEY!,
//     action: "add",
//     service: String(campaign.serviceId),
//     link: campaign.link,
//     quantity: String(orderQty),
//   };

//   const res = await fetch(process.env.SMM_API_URL!, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams(payload).toString(),
//   });

//   const data = await res.json();
//   if (data.error) throw new Error(data.error);

//   // 🔐 update DB here
// }
