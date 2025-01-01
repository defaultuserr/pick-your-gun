const fs = require('fs');

// Path to the JSON file
const filePath = './cosplay.json';
const { fetchAllPaginatedData } = require ('../src/shared.js');
const { generateClient } = require('aws-amplify/data');
const { Amplify } = require('aws-amplify');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator
const outputs = require('../amplify_outputs.json');  // Use require for JSON in CommonJS



// Configure Amplify with the outputs
Amplify.configure(outputs);
const client = generateClient();
// Function to read and parse JSON file
function readAndPrintMedia(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      printMediaDetails(jsonData);
    } catch (parseErr) {
      console.error(`Error parsing JSON: ${parseErr}`);
    }
  });
}

// Function to parse and print media details
async function printMediaDetails(data) {
    for (const mediaItem of data.media) {
        const mediaExistsValue = await mediaExists(mediaItem.title); // Await works properly here
        if (mediaExistsValue) {
       
            console.log(`Media with title ${mediaItem.title} already exists in the database`);
            continue; // Skip to the next item
        }

        let mediaId = await createMedia(mediaItem); // Assuming createMedia is also asynchronous
        console.log(`Media with id ${mediaItem.id}`);
        console.log(`Media Title: ${mediaItem.title}`);
        console.log(`Type: ${mediaItem.type}`);
        console.log(`Release Year: ${mediaItem.release_year}`);
        console.log(`Genres: ${mediaItem.genre.join(", ")}`);
        console.log(`Cosplay Recommendations:`);

        for (const recommendation of mediaItem.cosplay_recommendations) {

        

            await createCosplayRecommendation( mediaId, recommendation); // Assuming createMedia is also asynchronous
            console.log(`  Character: ${recommendation.character}`);
            console.log(`  Difficulty: ${recommendation.difficulty}`);
            console.log(`  Key Items: ${recommendation.key_items.join(", ")}`);
            console.log(`  Image URL: ${recommendation.image_url}`);
            console.log("  -----------------------");
        };

        console.log("=========================");
    }
}



const mediaExists = async (title) => {
    const movies = await fetchAllPaginatedData(client, 'Media', { title: { eq: title } });
    console.log("in den movies")

    console.log(movies.length > 0)
    return movies.length > 0;
  };

  const createMedia = async (media) => {
    uuidValue = String(uuidv4());

    console.log(uuidValue )
    console.log(media)
const { errors: errors, data: newMedia } = await client.models.Media.create({
    //id: uuidValue,  // Generate a new ID for the movie
    type: media.type,  // Include type attribute
    title: media.title,
    genre: media.genre,
    genre_lowercase: String(media.genre).toLowerCase(),
    release_year: Number(media.release_year),
});

if (errors) {
    console.error('Error creating media:', errors);
} else {
  
    return newMedia.id;
    
}
}

const createCosplayRecommendation = async (mediaId, recommendation) => {
console.log("recommendation")
console.log(recommendation)
const { errors: errors, data: newMedia } = await client.models.CosplayRecommendation.create({
  id: String(uuidv4()),  // Generate a new ID for the movie
  mediaId: mediaId,  // Include type attribute
  character: recommendation.character,
  difficulty: recommendation.difficulty,  // Include type attribute
  key_items: recommendation.key_items,
  image_url: recommendation.image_url,

});





if (errors) {
  console.error('Error creating recommendtation', errors);
} else {

  console.log('recommendation created:', recommendation.character);
}
}

// Call the function to read and print the data
readAndPrintMedia(filePath);
