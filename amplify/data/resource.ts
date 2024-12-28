import { type ClientSchema, a, defineData, } from "@aws-amplify/backend";


/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  // Weapon Model
  Weapon: a
    .model({
      name: a.string().required(),
      description: a.string(),
      price: a.string(),
      affiliateLink: a.string(),
      // One-to-many with WeaponMovie (through the join table)
      movies: a.hasMany('WeaponMovie', 'weaponId'),

    })
    .secondaryIndexes((index) => [index('name')]) // Optional secondary index on name for performance
    .authorization((allow) => [allow.publicApiKey()]),

  // Movie Model
  Movie: a
    .model({
      title: a.string().required(),
      description: a.string(),
      year: a.integer(), 
      genre: a.string(),
      rating: a.string(),
      type: a.string(), 
      // One-to-many with WeaponMovie (through the join table)
      weapons: a.hasMany('WeaponMovie', 'movieId'),
    })
    .secondaryIndexes((index) => [index('title')]) // Optional secondary index on title for performance
    .authorization((allow) => [allow.publicApiKey()]),

  // VideoGame Model


  // Join Table for Weapon and Movie
  WeaponMovie: a
    .model({
      id: a.id().required(),
      weaponId: a.id().required(), // Foreign Key to Weapon
      movieId: a.id().required(), // Foreign Key to Movie
      weapon: a.belongsTo('Weapon', 'weaponId'), // Belongs to Weapon
      movie: a.belongsTo('Movie', 'movieId') // Belongs to Movie
    })
    .authorization((allow) => [allow.publicApiKey()]),

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
