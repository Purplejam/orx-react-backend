import { text, password, relationship, select, integer } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import {Product} from './Product';
import {rules, isSignedIn} from '../access';




export const CartItem = list({
	access: {
		create: isSignedIn,
		read: rules.canManageOrder,
		update: rules.canManageOrder,
		delete: rules.canManageOrder,
	},
	ui: {
		listView: {
			initialColumns: ['quantity', 'product', 'user']
		}
	},
	fields: {
		quantity: integer({
			defaultValue: 1,
			isRequired: true
		}),
		product: relationship({
			ref: 'Product'
		}),
		user: relationship({
			ref: 'User.cart'
		})
	} 
})