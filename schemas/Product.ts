import { text, password, relationship, select, integer } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import {ProductImage} from './ProductImage';
import { isSignedIn, rules } from '../access';



export const Product = list({
	access: {
		create: isSignedIn,
		read: rules.canReadProducts,
		update: rules.canManageProducts,
		delete: rules.canManageProducts,
	},
	fields: {
		name: text({isRequired: true}),
		description: text({
			ui: {
				displayMode: 'textarea'
			},
		}),
		status: select({
			options: [
			{label: 'available', value: 'available'}, 
			{label: 'unavailable', value: 'unavailable'},
			{label: 'draft', value: 'draft'},  
			],
			defaultValue: 'draft',
			ui: {
				displayMode: 'segmented-control',
				createView: {
					fieldMode: 'hidden'
				}
			}
		}),
		price: integer(),
		user: relationship({
			ref: 'User.products',
			defaultValue: ({context}) => ({connect: {id: context.session.itemId}})
		}),
		photo: relationship({ref: 'ProductImage.product', 
			ui: {
				displayMode: 'cards',
				cardFields: ['image', 'altText'],
				inlineCreate: {fields: ['image', 'altText']},
				inlineEdit: {fields: ['image', 'altText']},
				inlineConnect: true
			}})
	} 
})