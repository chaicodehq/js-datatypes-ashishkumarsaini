/**
 * 🍕 Zomato Order Builder
 *
 * Zomato jaisa order summary banana hai! Cart mein items hain (with quantity
 * aur addons), ek optional coupon code hai, aur tujhe final bill banana hai
 * with itemwise breakdown, taxes, delivery fee, aur discount.
 *
 * Rules:
 *   - cart is array of items:
 *     [{ name: "Butter Chicken", price: 350, qty: 2, addons: ["Extra Butter:50", "Naan:40"] }, ...]
 *   - Each addon string format: "AddonName:Price" (split by ":" to get price)
 *   - Per item total = (price + sum of addon prices) * qty
 *   - Calculate:
 *     - items: array of { name, qty, basePrice, addonTotal, itemTotal }
 *     - subtotal: sum of all itemTotals
 *     - deliveryFee: Rs 30 if subtotal < 500, Rs 15 if 500-999, FREE (0) if >= 1000
 *     - gst: 5% of subtotal, rounded to 2 decimal places parseFloat(val.toFixed(2))
 *     - discount: based on coupon (see below)
 *     - grandTotal: subtotal + deliveryFee + gst - discount (minimum 0, use Math.max)
 *     - Round grandTotal to 2 decimal places
 *
 *   Coupon codes (case-insensitive):
 *     - "FIRST50"  => 50% off subtotal, max Rs 150 (use Math.min)
 *     - "FLAT100"  => flat Rs 100 off
 *     - "FREESHIP" => delivery fee becomes 0 (discount = original delivery fee value)
 *     - null/undefined/invalid string => no discount (0)
 *
 *   - Items with qty <= 0 ko skip karo
 *   - Hint: Use map(), reduce(), filter(), split(), parseFloat(),
 *     toFixed(), Math.max(), Math.min(), toLowerCase()
 *
 * Validation:
 *   - Agar cart array nahi hai ya empty hai, return null
 *
 * @param {Array<{ name: string, price: number, qty: number, addons?: string[] }>} cart
 * @param {string} [coupon] - Optional coupon code
 * @returns {{ items: Array<{ name: string, qty: number, basePrice: number, addonTotal: number, itemTotal: number }>, subtotal: number, deliveryFee: number, gst: number, discount: number, grandTotal: number } | null}
 *
 * @example
 *   buildZomatoOrder([{ name: "Biryani", price: 300, qty: 1, addons: ["Raita:30"] }], "FLAT100")
 *   // subtotal: 330, deliveryFee: 30, gst: 16.5, discount: 100
 *   // grandTotal: 330 + 30 + 16.5 - 100 = 276.5
 *
 *   buildZomatoOrder([{ name: "Pizza", price: 500, qty: 2, addons: [] }], "FIRST50")
 *   // subtotal: 1000, deliveryFee: 0, gst: 50, discount: min(500, 150) = 150
 *   // grandTotal: 1000 + 0 + 50 - 150 = 900
 */
export function buildZomatoOrder(cart, coupon) {
  if (!Array.isArray(cart) || cart.length <= 0) {
    return null
  }

  const items = computeTotalItems(cart);

  const subtotal = items.reduce((acc, { itemTotal }) => acc + itemTotal, 0);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const gst = calculateGST(subtotal);
  const discount = calculateDiscount(coupon, subtotal, deliveryFee);
  const grandTotal = subtotal + deliveryFee + gst - discount;

  return {
    items,
    subtotal,
    deliveryFee: deliveryFee !== discount ? deliveryFee : 0,
    gst,
    discount,
    grandTotal: Math.max(grandTotal, 0)
  }
}

const computeTotalItems = (cart) => {
  return cart.filter(({ qty }) => qty > 0).map(({ name, qty, price, addons = [] }) => {

    const addonTotal = addons.reduce((acc, addOn) => acc + parseInt(addOn.split(':')[1]), 0)

    return {
      name,
      qty,
      basePrice: price * qty,
      addonTotal,
      itemTotal: (price + addonTotal) * qty
    }
  })
};

const calculateDeliveryFee = (orderSubTotal) => {
  if (orderSubTotal >= 1000) {
    return 0;
  } else if (orderSubTotal >= 500) {
    return 15;
  }
  return 30;
}

const calculateGST = (orderSubTotal) => parseFloat(((5 * orderSubTotal) / 100).toFixed(2));

const calculateDiscount = (coupon, subtotal, deliveryFee) => {
  if (!coupon) {
    return 0;
  }

  switch (coupon.toLowerCase()) {
    case "first50": return Math.min(((50 * subtotal) / 100), 150);
    case "flat100": return 100;
    case "freeship": return deliveryFee; // handling free ship in calculateDeliveryFee
    default: return 0;
  }
}