import { text, relationship, integer, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import {cloudinaryImage } from '@keystone-next/cloudinary';
import 'dotenv/config';
import formatMoney from '../lib/formatMoney';
import {rules, isSignedIn} from '../access';


export const Order = list({
	access: {
		create: isSignedIn,
		read: rules.canManageOrder,
		update: () => false,
		delete:() => false,
	},
	fields: {
		label: virtual({
			graphQLReturnType: 'String',
			resolver: function(item) {
				return formatMoney(item.total);
			}
		}),
		total: integer(),
		items: relationship({ref: 'OrderItem.order', many: true}),
		user: relationship({ref: 'User.orders'}),
		charge: text()
	}
})