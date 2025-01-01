const { Amplify } = require('aws-amplify');
const outputs = require('../amplify_outputs.json');  // Use require for JSON in CommonJS
const { generateClient } = require("aws-amplify/api")


const client = generateClient();
Amplify.configure(outputs)


client.queries.getData({
    name: "Amplify",
  })