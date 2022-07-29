import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// At it's simplest, the access control returns a yes or no value depending on the users session


export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}


//@ts-ignore
const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

//alternative array
/*const generatedPermissionsArr = {
  canManageProducts: function({ session }: ListAccessArgs): boolean {
    return !!session?.data.role?.canManageProducts
  } 
} */

// Permissions check if someone meets a criteria - yes or no.
export const permissions = {
  ...generatedPermissions,
};

//ruled based function
//rules can return boolean or filters
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canReadProducts({session}: ListAccessArgs) {
    if(permissions.canManageProducts({session})) {
      return true; //can read everything
    }
    //othervise they should see available canReadProducts
    return { status: 'AVAILABLE' }
  },
  canManageOrder({session}: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if(permissions.canManageCart({session})) {
      return true; //can read everything
    }

    return {user: {id: session.itemId}}
  },
  canManageOrderItem({session}: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if(permissions.canManageCart({session})) {
      return true;
    }

    return {order: {user: {id: session.itemId}}}
  },
  canManageUsers({ session }: ListAccessArgs) {
     if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageUsers({ session })) {
      return true;
    }

    return { id: session.itemId };
  },
}