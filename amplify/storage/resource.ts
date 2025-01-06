import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'cosplayCharacterImages',     access: (allow) => ({
    'images/examples/*': [
      allow.guest.to(['read']), // additional actions such as "write" and "delete" can be specified depending on your use case
      allow.authenticated.to(['read'])
    ],
    'images/users/*': [
      allow.guest.to(['read']), 
      allow.authenticated.to(['read', 'write'])
    ],
    'images/predictions/*': [
      allow.guest.to(['read']), // additional actions such as "write" and "delete" can be specified depending on your use case
      allow.authenticated.to(['list', 'write', 'get'])
    ],
  }),
});