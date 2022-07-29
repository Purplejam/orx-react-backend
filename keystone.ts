import 'dotenv/config';
import {config, createSchema} from '@keystone-next/keystone/schema';
import {createAuth} from '@keystone-next/auth';
import {User} from './schemas/User';
import {Product} from './schemas/Product'; 
import {Order} from './schemas/Order'; 
import {OrderItem} from './schemas/OrderItem'; 
import {withItemData, statelessSessions} from '@keystone-next/keystone/session'
import {ProductImage} from './schemas/ProductImage';
import {CartItem} from './schemas/CartItem';
import {insertSeedData} from './seed-data/index';
import { sendPasswordResetEmail } from './lib/mail';
import {extendGraphqlSchema} from './mutations/index';
import {Role} from './schemas/Role';
import {permissionsList} from './schemas/fields';

const databaseURL = process.env.DATABASE_URL;
const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long should they stay signed in
  secret: process.env.COOKIE_SECRET
}

const {withAuth} = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password']
  },
  passwordResetLink: {
    sendToken: async ({ itemId, identity, token }) => {await sendPasswordResetEmail(token, identity)},
    tokensValidForMins: 60,
  },

})


export default withAuth(
  config({
    server: {
      cors: {
        //origin: [process.env.FRONTEND_URL],
        //origin: true,
        //credentials: true, 
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      async onConnect(keystone) {
        if(process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }   
      }
    },
    experimental: {
      generateNextGraphqlAPI: true,
      generateNodeAPI: true,
    },
    lists: createSchema({
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
      Role
    }),
    extendGraphqlSchema,
    ui: {
      //change this for roles
      isAccessAllowed: ({session}) => {
        return !!session?.data;
      }
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: `id name email role { ${permissionsList.join(' ')} }`,
    })
}))