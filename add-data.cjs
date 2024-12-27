// Import necessary modules
const fs = require('fs');
const { generateClient } = require('aws-amplify/data');
const { Amplify } = require('aws-amplify');
const outputs = require('./amplify_outputs.json');  // Use require for JSON in CommonJS

// Configure Amplify with the outputs
Amplify.configure(outputs);

// Generate the client
const client = generateClient();

// Load firearms data from a JSON file
fs.readFile('firearms_data.json', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON data
  const firearms = JSON.parse(data);

  // Function to display gun details along with movies and video games
  function displayGunDetails(gun) {
    console.log(`Gun Name: ${gun.name}`);
    console.log(`Description: ${gun.description}`);
    console.log(`Price: ${gun.price}`);
    console.log(`Affiliate Link: ${gun.affiliateLink}`);
    
    if (gun.movies && gun.movies.length > 0) {
      console.log("Movies Featuring This Gun:");
      gun.movies.forEach(movie => {
        console.log(`- ${movie.title} (${movie.year}): ${movie.description}`);
      });
    } else {
      console.log("No movies listed.");
    }

    if (gun.videoGames && gun.videoGames.length > 0) {
      console.log("Video Games Featuring This Gun:");
      gun.videoGames.forEach(game => {
        console.log(`- ${game.title} (${game.year}): ${game.description}`);
      });
    } else {
      console.log("No video games listed.");
    }

    console.log('----------------------');
  }

  // Loop through all firearms, display details, and add to DynamoDB
  for (let gun of firearms) {
    // Display the gun details
    displayGunDetails(gun);

    try {
      // Create a new Weapon in DynamoDB (using the Amplify client)
      const { errors: weaponErrors, data: weaponData } = await client.models.Weapon.create({
        name: gun.name,
        description: gun.description,
        price: gun.price,
        affiliateLink: gun.affiliateLink,
      });

      if (weaponErrors) {
        console.error('Error creating weapon:', weaponErrors);
        continue;
      }

      // Create join entries for Weapon and Movie if available
      if (gun.movies && gun.movies.length > 0) {
        for (let movie of gun.movies) {
          const { errors: movieErrors, data: movieData } = await client.models.Movie.create({
            title: movie.title,
            description: movie.description,
            year: movie.year,
          });

          if (movieErrors) {
            console.error('Error creating movie:', movieErrors);
            continue;
          }

          // Create the Weapon-Movie relationship
          const { errors: weaponMovieErrors } = await client.models.WeaponMovie.create({
            weaponId: weaponData.id,
            movieId: movieData.id,
          });

          if (weaponMovieErrors) {
            console.error('Error creating WeaponMovie relationship:', weaponMovieErrors);
          }
        }
      }

      // Create join entries for Weapon and VideoGame if available
      if (gun.videoGames && gun.videoGames.length > 0) {
        for (let game of gun.videoGames) {
          const { errors: gameErrors, data: videoGameData } = await client.models.VideoGame.create({
            title: game.title,
            description: game.description,
            year: game.year,
          });

          if (gameErrors) {
            console.error('Error creating video game:', gameErrors);
            continue;
          }

          // Create the Weapon-VideoGame relationship
          const { errors: weaponVideoGameErrors } = await client.models.WeaponVideoGame.create({
            weaponId: weaponData.id,
            videoGameId: videoGameData.id,
          });

          if (weaponVideoGameErrors) {
            console.error('Error creating WeaponVideoGame relationship:', weaponVideoGameErrors);
          }
        }
      }

      console.log(`Weapon ${gun.name} added successfully.`);
    } catch (error) {
      console.error(`Error saving data for ${gun.name}: `, error);
    }
  }
});
