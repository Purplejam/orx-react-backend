import { text, password, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { rules, permissions} from '../access';


//named exported
export const User = list({
	access: {
		create: () => true,
		read: rules.canManageUsers,
		update: rules.canManageUsers,
		delete: permissions.canManageUsers,
	},
	ui: {
		hideCreate: session => permissions.canManageUsers(session),
		hideDelete: session => permissions.canManageUsers(session),
	},
	fields: {
		name: text({isRequired: true}),
		email: text({isRequired: true, isUnique: true}),
		password: password({isRequired: true}),
		cart: relationship({
			ref: 'CartItem.user',
			many: true,
			ui: {
				createView: {
					fieldMode : 'hidden'
				},
				itemView: {
					fieldMode: 'read'
				}
			}
		}),
		orders: relationship({ref: 'Order.user', many: true}),
		role: relationship({
			ref: 'Role.assignedTo',
			access: {
				create: permissions.canManageUsers,
				update: permissions.canManageUsers
			}
		}),
		products: relationship({ref: 'Product.user', many: true}),
	}
})