import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import {getData} from './functions/get-cosplay-data/resource'
const backend = defineBackend({
  auth,
  data,
  storage, 
  getData
});

// Set environment variables for the S3 Bucket name
backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  S3_BUCKET_NAME: backend.storage.resources.bucket.bucketName,
 };
 
 const rekognitionDataSource = backend.data.addHttpDataSource(
  "RekognitionDataSource",
  `https://rekognition.${backend.data.stack.region}.amazonaws.com`,
  {
    authorizationConfig: {
      signingRegion: backend.data.stack.region,
      signingServiceName: "rekognition",
    },
  }
 );
 
 rekognitionDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    actions: ["rekognition:DetectFaces", "rekognition:DetectLabels"],
    resources: ["*"],
  })
 );
 
 backend.storage.resources.bucket.grantReadWrite(
  rekognitionDataSource.grantPrincipal
 );