export default function calcTotalPrice(cart) {
	let sum = 0;
	for (let i = 0; i < cart.length; i++) {
		if (!cart[i].product) continue;
		sum += cart[i].quantity * cart[i].product.price;
	}
	return sum;
}