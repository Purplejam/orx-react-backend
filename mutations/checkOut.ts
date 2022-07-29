import {KeystoneContext, SessionStore} from '@keystone-next/types';
import {Session} from '../types';
import {OrderCreateInput} from '../.keystone/schema-types';
import calcTotalPrice from '../lib/calcTotalPrice.js';
import stripeConfig from '../lib/stripe';

interface Arguments {
	token: string
}
export default async function checkOut(
	root: any, 
	{token} : Arguments, 
	context: KeystoneContext): Promise<OrderCreateInput> {

	//query current user 
	const sesh = context.session as Session; 
	if (!sesh.itemId) {
		throw new Error('You must be logged in to do this');
	}

	const user = await context.lists.User.findOne({
		where: {id: sesh.itemId},
		resolveFields: `
		id
		name
		email
		cart {
			id 
			quantity
			product {
				name
				price
				description
				id
				photo {
					id
					image {
						id 
						publicUrlTransformed
					}
				}
			}
		}`
	})

	const cartItems = user.cart.filter(cartItem => cartItem.product);
	const amount = calcTotalPrice(user.cart);
	console.log(amount);

	const charge = await stripeConfig.paymentIntents.create({
		amount,
		currency: 'USD',
		confirm: true,
		payment_method: token,
	}).catch(err => {
		console.log(err);
		throw new Error(err.message);
	})

	console.log(charge);

	const orderItems = cartItems.map(cartItem => {
		const orderItem = {
			name: cartItem.product.name,
			description: cartItem.product.description,
			price: cartItem.product.price,
			quantity: cartItem.quantity,
			photo: {connect: {id: cartItem.product.photo.id}},
		}
		return orderItem;
	})

	const order = await context.lists.Order.createOne({
		data: {
			total: charge.amount,
			items: {create: orderItems},
			user: {connect: {id: sesh.itemId}},
			charge: charge.id
		}
	});

	const cartItemIds = user.cart.map(cartItems => cartItems.id);
	await context.lists.CartItem.deleteMany({
		ids: cartItemIds
	});

	return order;
}