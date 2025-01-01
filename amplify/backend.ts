import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import {getData} from './functions/get-cosplay-data/resource'
defineBackend({
  auth,
  data,
  storage, 
  getData
});
