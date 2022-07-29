import {KeystoneContext, SessionStore} from '@keystone-next/types';
import {CartItemCreateInput} from '../.keystone/schema-types';
import {Session} from '../types';
import {CartItem} from '../schemas/CartItem';

export default async function addToCart(
	root: any, 
	{productId} : {productId: string}, 
	context: KeystoneContext): Promise<CartItemCreateInput> {
	console.log('ADDING TO CART!');
	//query current user
	const sesh = context.session as Session; 
	if (!sesh.itemId) {
		throw new Error('You must be logged in to do this');
	}


	//query the current user CartItemCreateInput
	const allCartItems = await context.lists.CartItem.findMany({
		where: { 
			user: {id: sesh.itemId}, 
			product: {id: productId}
		},
		resolveFields: 'id, quantity'
	});

	//see if the current item is in the CartItemCreateInput
	//if it is, increment by 1
	const [existingCartItem] = allCartItems;
	if(existingCartItem) {
		console.log(`There are already ${existingCartItem.quantity}, increment by 1`);
		return await context.lists.CartItem.updateOne({
			id: existingCartItem.id,
			data: {quantity: existingCartItem.quantity + 1},
			resolveFields: false,
		})
	};

	//if it isnt, create a new cart item
	return await context.lists.CartItem.createOne({
		data: {
			product: {connect: {id: productId}},
			user: {connect: {id: sesh.itemId}},		
		},
		resolveFields: false,
	})
}