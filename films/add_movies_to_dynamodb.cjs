const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator
const { generateClient } = require('aws-amplify/data');
const { Amplify } = require('aws-amplify');
const outputs = require('../amplify_outputs.json');  // Use require for JSON in CommonJS


// Configure Amplify with the outputs
Amplify.configure(outputs);
const client = generateClient();

// Function to read and parse the JSON file
const readJsonFile = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading or parsing the file:', error);
  }
};

// Path to your movie-list.json file
const filePath = './game-list.json';
const movieData = readJsonFile(filePath);


const fetchPaginatedData = async (model, filter) => {
  let allData = [];
  let nextToken = null;

  do {
    const result = await client.models[model].list({
      filter: filter,
      nextToken: nextToken
    });

    if (result.errors) {
      console.error('Error fetching data:', result.errors);
      break;
    }

    if (result.data && result.data.length > 0) {
      allData = [...allData, ...result.data]; // Accumulate results
    }

    nextToken = result.nextToken; // Update nextToken for the next iteration
  } while (nextToken);

  return allData;
};



// Function to check if a weapon exists by its name
const weaponExists = async (name) => {
  const weapons = await fetchPaginatedData('Weapon', { name: { eq: name } });
  return weapons.length > 0;
};
const movieExists = async (title) => {
  const movies = await fetchPaginatedData('Movie', { title: { eq: title } });
  return movies.length > 0;
};

const weaponMovieExists = async (movieIdValue, weaponIdValue) => {
  const weaponMovies = await fetchPaginatedData('WeaponMovie', {
    and: [
      { movieId: { eq: movieIdValue } },
      { weaponId: { eq: weaponIdValue } }
    ]
  });
  return weaponMovies.length > 0;
};

const fetchAllPaginatedData = async (modelName, filter = {}) => {
  let allData = [];
  let nextToken = null;

  do {
    const result = await client.models[modelName].list({
      filter: filter,
      nextToken: nextToken // Pass the token for pagination
    });

    if (result.errors) {
      console.error(`Error fetching data for model ${modelName}:`, result.errors);
      break; // Exit loop on error
    }

    if (result.data && result.data.length > 0) {
      allData = [...allData, ...result.data]; // Accumulate the fetched data
    }

    nextToken = result.nextToken; // Update the token for the next iteration
  } while (nextToken); // Continue until nextToken is null

  return allData;
};


// Function to process movies and weapons asynchronously
const processMoviesAndWeapons = async () => {
  for (const movie of movieData) {
    console.log(`Processing Movie: ${movie.title}`);
    console.log(`Year: ${movie.year}`);
    console.log(`Genre: ${movie.genre}`);
    console.log(`Type: ${movie.type}`);

    // Check if the movie already exists in the database
    let movieId;
    const movieExistsFlag = await movieExists(movie.title);
    if (movieExistsFlag) {
      console.log(`Movie already exists: ${movie.title}`);
      // Fetch the existing movie ID


      const result = await fetchAllPaginatedData('Movie', { title: { eq: movie.title } });
      console.log(result);
        movieId = result[0].id; 
        console.log(movieId);
   // Assuming the movie ID is in the first result
    } else {
      // Create the movie if it doesn't exist
      try {
        const { errors: movieErrors, data: newMovie } = await client.models.Movie.create({
          id: uuidv4(),  // Generate a new ID for the movie
          title: movie.title,
          year: movie.year,
          genre: movie.genre,
          type: movie.type,  // Include type attribute
          weapons: movie.weapons.map(weapon => weapon.id),
        });

        if (movieErrors) {
          console.error('Error creating movie:', movieErrors);
        } else {
          movieId = newMovie.id;  // Save the new movie ID
          console.log('Movie created:', newMovie);
        }
      } catch (error) {
        console.error('Error creating movie:', error);
      }
    }

    // Process weapons for the movie
    for (const weapon of movie.weapons) {
      console.log(`Processing Weapon: ${weapon.name}`);
 

      let weaponId;
      // Check if the weapon already exists in the database
      const weaponExistsFlag = await weaponExists(weapon.name);
      if (weaponExistsFlag) {
        console.log(`Weapon already exists: ${weapon.name}`);
        // Fetch the existing weapon ID
      
        const result = await fetchAllPaginatedData('Weapon', { name: { eq: weapon.name } });
       
        weaponId = result[0].id; 
        console.log(weaponId);
           // Assuming the weapon ID is in the first result
      } else {
        // Create the weapon if it doesn't exist
        try {
          const { errors: weaponErrors, data: newWeapon } = await client.models.Weapon.create({
            id: uuidv4(),  // Generate a new ID for the weapon
            name: weapon.name,
            description: weapon.description,
            price: weapon.price,
            affiliateLink: weapon.affiliateLink,
          });

          if (weaponErrors) {
            console.error('Error creating weapon:', weaponErrors);
          } else {
            weaponId = newWeapon.id;  // Save the new weapon ID
            console.log('Weapon created:', newWeapon);
          }
        } catch (error) {
          console.error('Error creating weapon:', error);
        }
      }

      // Link the weapon to the movie if it doesn't already exist in WeaponMovie
      const relationshipExists = await weaponMovieExists(movieId, weaponId);
      if (relationshipExists) {
        console.log(`WeaponMovie already exists: ${weapon.name}`);
      } else {
        try {
          const { errors: weaponMovieErrors, data: newWeaponMovie } = await client.models.WeaponMovie.create({
            movieId: movieId,  // Link the movie to this weapon
            weaponId: weaponId, // Link the weapon to this movie
          });
          console.log('WeaponMovie relationship created:', newWeaponMovie);

        } catch (error) {
          console.error('Error creating WeaponMovie relationship:', error);
        }
      }
    }

    console.log('----------------------------');
  }
};

// Process the movies and weapons
processMoviesAndWeapons().catch(error => {
  console.error('Error processing movies and weapons:', error);
});
