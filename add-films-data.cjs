// Import necessary modules
const fs = require('fs');
const { generateClient } = require('aws-amplify/data');
const { Amplify } = require('aws-amplify');
const outputs = require('./amplify_outputs.json');  // Use require for JSON in CommonJS

// Configure Amplify with the outputs
Amplify.configure(outputs);

// Generate the client
const client = generateClient();

// Load movie data from a JSON file
fs.readFile('movie-list.json', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON data
  const movies = JSON.parse(data);

  // Function to display movie details along with weapons
  function displayMovieDetails(movie) {
    console.log(`Movie Title: ${movie.title}`);
    console.log(`Year: ${movie.year}`);
    console.log(`Genre: ${movie.genre}`);
    console.log(`Rating: ${movie.rating}`);
    console.log(`Weapons Featured:`);
    
    if (movie.weapons && movie.weapons.length > 0) {
      movie.weapons.forEach(weapon => {
        console.log(`- ${weapon.name}: ${weapon.description}, Price: ${weapon.price}`);
      });
    } else {
      console.log("No weapons listed.");
    }

    console.log('----------------------');
  }

  // Loop through all movies, display details, and add to DynamoDB
  for (let movie of movies) {
    // Display the movie details
    displayMovieDetails(movie);

    try {
      // Check if movie already exists
      const { errors: movieErrors, data: existingMovieData } = await client.models.Movie.list({
        title: movie.title,
        year: movie.year,
      });

      let movieData;
      if (existingMovieData && existingMovieData.length > 0) {
        // Movie exists, use the existing movie data
        movieData = existingMovieData[0];
        console.log(`Movie "${movie.title}" already exists, using existing movie.`);
      } else {
        // Movie doesn't exist, create a new movie
        const { errors: newMovieErrors, data: newMovieData } = await client.models.Movie.create({
          title: movie.title,
          year: movie.year,
          genre: movie.genre,
          rating: movie.rating,
        });

        if (newMovieErrors) {
          console.error('Error creating movie:', newMovieErrors);
          continue;
        }
        movieData = newMovieData;
        console.log(`Movie "${movie.title}" created successfully.`);
      }

      // Iterate over weapons in the movie
      if (movie.weapons && movie.weapons.length > 0) {
        for (let weapon of movie.weapons) {
          // Check if weapon already exists.
          const { errors: weaponErrors, data: existingWeaponData } = await client.models.Weapon.list({
            name: weapon.name,
          });

          let weaponData;
          if (existingWeaponData && existingWeaponData.length > 0) {
            // Weapon exists, use the existing weapon data
            weaponData = existingWeaponData[0];
            console.log(`Weapon "${weapon.name}" already exists, using existing weapon.`);
          } else {
            // Weapon doesn't exist, create a new weapon
            const { errors: newWeaponErrors, data: newWeaponData } = await client.models.Weapon.create({
              name: weapon.name,
              description: weapon.description,
              price: weapon.price,
              affiliateLink: weapon.affiliateLink,
            });

            if (newWeaponErrors) {
              console.error('Error creating weapon:', newWeaponErrors);
              continue;
            }
            weaponData = newWeaponData;
            console.log(`Weapon "${weapon.name}" created successfully.`);
          }

          // Create the Weapon-Movie relationship using the correct model `WeaponMovie`
          const { errors: weaponMovieErrors } = await client.models.WeaponMovie.create({
            weaponId: weaponData.id,
            movieId: movieData.id,
          });

          if (weaponMovieErrors) {
            console.error('Error creating Weapon-Movie relationship:', weaponMovieErrors);
          }
        }
      }

      console.log(`Movie "${movie.title}" processed successfully.`);
    } catch (error) {
      console.error(`Error saving data for ${movie.title}: `, error);
    }
  }
});
