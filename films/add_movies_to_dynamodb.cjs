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
    // Read the file content
    const rawData = fs.readFileSync(filePath, 'utf8');
    // Parse the JSON content and return
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading or parsing the file:', error);
  }
};

// Path to your movie-list.json file
const filePath = './movie-list.json';

// Parse the JSON data
const movieData = readJsonFile(filePath);

// Function to generate unique IDs for movies and weapons
const generateIdsForData = (data) => {
  return data.map(movie => {
    // Generate a unique ID for the movie
    movie.id = uuidv4();
    
    // Generate a unique ID for each weapon in the movie
    movie.weapons = movie.weapons.map(weapon => {
      weapon.id = uuidv4();
      return weapon;
    });

    return movie;
  });
};

// Function to check if a movie exists by its title
const movieExists = async (name) => {
  console.log("chekcin movie", name)
  const result = await client.models.Movie.list({  filter: {
    title: {
      beginsWith: name
    }
  }});
  console.log("result", result)
  if (result.data && result.data.length == 1)  {
    console.log("movie alraedy exists")
    return true;
  }
  
};

// Function to check if a weapon exists by its name
const weaponExists = async (name) => {
  console.log("chekcin name", name)
  const result = await client.models.Weapon.list({  filter: {
    name: {
      beginsWith: name
    }
  }});
  console.log("result", result)
  if (result.data && result.data.length == 1)  {
    console.log("weapon alraedy exists")
    return true;
  }
  
};

// Function to check if a Weapon-Movie relationship exists
const weaponMovieExists = async (movieId, weaponId) => {
  const result = await client.models.WeaponMovie.get({
    movieId,
    weaponId
  });
  return result.items && result.items.length > 0;
};

// Function to process movies and weapons asynchronously
const processMoviesAndWeapons = async () => {
  const updatedData = generateIdsForData(movieData);  // Generate IDs for each item

  // Iterate through each movie in the data using for...of to work with async/await
  for (const movie of updatedData) {
    console.log(`Processing Movie: ${movie.title}`);
    console.log(`Year: ${movie.year}`);
    console.log(`Genre: ${movie.genre}`);
    console.log(`Rating: ${movie.rating}`);

    // Check if the movie already exists
    const movieExistsFlag = await movieExists(movie.title);
    if (movieExistsFlag) {
      console.log(`Movie already exists: ${movie.title}`);
    } else {
      // Create the movie if it doesn't exist
      try {
        const { errors: movieErrors, data: newMovie } = await client.models.Movie.create({
          id: movie.id,  // Using the generated ID
          title: movie.title,
          year: movie.year,
          genre: movie.genre,
          rating: movie.rating,
          weapons: movie.weapons.map(weapon => weapon.id), // Map to just the weapon IDs
        });

        if (movieErrors) {
          console.error('Error creating movie:', movieErrors);
        } else {
          console.log('Movie created:', newMovie);
        }
      } catch (error) {
        console.error('Error creating movie:', error);
      }
    }

    // Step 3: Always iterate over weapons, regardless of movie existence
    for (const weapon of movie.weapons) {
      console.log(`Processing Weapon: ${weapon.name}`);
      
      // Check if the weapon already exists
      const weaponExistsFlag = await weaponExists(weapon.name);
      if (weaponExistsFlag) {
        console.log(`Weapon already exists: ${weapon.name}`);
        continue;  // Skip creating this weapon, but continue to the next weapon
      } else {
        try {
          // Create the weapon if it doesn't exist
          const { errors: weaponErrors, data: newWeapon } = await client.models.Weapon.create({
            name: weapon.name,
            description: weapon.description,
            price: weapon.price,
            affiliateLink: weapon.affiliateLink,
          });

          if (weaponErrors) {
            console.error('Error creating weapon:', weaponErrors);
          } else {
            console.log('Weapon created:', newWeapon);
          }
        } catch (error) {
          console.error('Error creating weapon:', error);
        }
      }

      // Link the weapon to the movie if it doesn't already exist in WeaponMovie
      const relationshipExists = await weaponMovieExists(movie.id, weapon.id);
      if (!relationshipExists) {
        try {
          const { errors: weaponMovieErrors, data: newWeaponMovie } = await client.models.WeaponMovie.create({
            movieId: movie.id,      // Link the movie to this weapon
            weaponId: weapon.id,    // Link the weapon to this movie
          });

          if (weaponMovieErrors) {
            console.error('Error creating WeaponMovie relationship:', weaponMovieErrors);
          } else {
            console.log('WeaponMovie relationship created:', newWeaponMovie);
          }
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
