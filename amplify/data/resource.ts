import { type ClientSchema, a, defineData, } from "@aws-amplify/backend";
import { getData } from "../functions/get-cosplay-data/resource"

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  // Media Model
   Media: a
  .model({
    id: a.id().required(),
    type: a.string().required(), // "movie", "game", or "series"
    title: a.string().required(),
    genre: a.string(), // e.g., "Fantasy", "Adventure"
    genre_lowercase: a.string(), // e.g., "Fantasy", "Adventure"
    release_year: a.integer(),
    cosplay_recommendations: a.hasMany('CosplayRecommendation', 'mediaId'), // One-to-many relationship
  })
  .secondaryIndexes((index) => [index('title')]) // Index for title for better search performance
  .authorization((allow) => [allow.publicApiKey()]),
  
  // Cosplay Recommendation
  CosplayRecommendation: a
  .model({
    id: a.id().required(),
    mediaId: a.id().required(), // Foreign key linking to Media
    character: a.string().required(),
    difficulty: a.string().required(), // e.g., "Easy", "Medium", "Hard", "Expert"
    key_items: a.string().array(), // List of specific cosplay items
    image_url: a.string(), // URL for character image
    media: a.belongsTo('Media', 'mediaId'), // One-to-one relationship
  })
  .authorization((allow) => [allow.publicApiKey()]),
//genre model
  Genre: a
  .model({
    id: a.id().required(),
    type: a.string().required(), // "movie", "game", or "series"
    genre_lowercase: a.string().required(),
    genre: a.string().required(),
  })
  .secondaryIndexes((index) => [index('genre')]) // Index for title for better search performance
  .authorization((allow) => [allow.publicApiKey()]),
 // used to retrieve data for genres api
  getData: a
  .query()
  .arguments({
    name: a.string(),
  })
  .returns(a.string())
  .handler(a.handler.function(getData)).authorization((allow) => [allow.publicApiKey()]),
});




export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
