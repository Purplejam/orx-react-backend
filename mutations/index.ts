import {graphQLSchemaExtension} from '@keystone-next/keystone/schema';
import addToCart from './addToCart';
import checkOut from './checkOut';

export const extendGraphqlSchema = graphQLSchemaExtension({
	typeDefs:`
	type Mutation {
		addToCart(productId: ID): CartItem
		checkOut(token: String): Order
	}
	`,
	resolvers:{
			Mutation: {
				addToCart,
				checkOut,
			}
		}
})