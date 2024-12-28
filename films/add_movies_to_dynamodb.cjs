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
const filePath = './movie-list.json';
const movieData = readJsonFile(filePath);

// Function to check if a movie exists by its title
const movieExists = async (title) => {
  const result = await client.models.Movie.list({
    filter: { title: { eq: title } }
  });
  return result.data && result.data.length > 0;
};

// Function to check if a weapon exists by its name
const weaponExists = async (name) => {
  const result = await client.models.Weapon.list({
    filter: { name: { eq: name } }
  });
  return result.data && result.data.length > 0;
};

// Function to check if a Weapon-Movie relationship exists
const weaponMovieExists = async (movieIdValue, weaponIdValue) => {
  const result = await client.models.WeaponMovie.list({
    filter: {
      and: [
        { movieId: { eq: movieIdValue } },
        { weaponId: { eq: weaponIdValue } }
      ]
    }
  });
  
  return result.data && result.data.length > 0;
};

// Function to process movies and weapons asynchronously
const processMoviesAndWeapons = async () => {
  for (const movie of movieData) {
    console.log(`Processing Movie: ${movie.title}`);
    console.log(`Year: ${movie.year}`);
    console.log(`Genre: ${movie.genre}`);
    console.log(`Rating: ${movie.rating}`);

    // Check if the movie already exists in the database
    let movieId;
    const movieExistsFlag = await movieExists(movie.title);
    if (movieExistsFlag) {
      console.log(`Movie already exists: ${movie.title}`);
      // Fetch the existing movie ID
      const result = await client.models.Movie.list({
        filter: { title: { eq: movie.title } }
      });
      movieId = result.data[0].id;  // Assuming the movie ID is in the first result
    } else {
      // Create the movie if it doesn't exist
      try {
        const { errors: movieErrors, data: newMovie } = await client.models.Movie.create({
          id: uuidv4(),  // Generate a new ID for the movie
          title: movie.title,
          year: movie.year,
          genre: movie.genre,
          rating: movie.rating,
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
        const result = await client.models.Weapon.list({
          filter: { name: { eq: weapon.name } }
        });
        weaponId = result.data[0].id;  // Assuming the weapon ID is in the first result
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
      }else {
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
