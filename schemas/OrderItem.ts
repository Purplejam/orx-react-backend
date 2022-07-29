import { text, password, relationship, select, integer } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import {ProductImage} from './ProductImage';
import {rules, isSignedIn} from '../access';



export const OrderItem = list({
 access: {
   create: isSignedIn,
   read: rules.canManageOrderItem,
   update: () => false,
   delete: () => false,
 },
	fields: {
		name: text({isRequired: true}),
		description: text({
			ui: {
				displayMode: 'textarea'
			},
		}),
		price: integer(),
		photo: relationship({ref: 'ProductImage', 
			ui: {
				displayMode: 'cards',
				cardFields: ['image', 'altText'],
				inlineCreate: {fields: ['image', 'altText']},
				inlineEdit: {fields: ['image', 'altText']},
				inlineConnect: true
			}}),
		quantity: integer(),
		order: relationship({ref: 'Order.items'})
	} 
})