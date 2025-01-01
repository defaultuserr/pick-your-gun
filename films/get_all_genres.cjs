const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator
const { generateClient } = require('aws-amplify/data');
const { Amplify } = require('aws-amplify');
const outputs = require('../amplify_outputs.json');  
const { fetchAllPaginatedData } = require ('../src/shared.js');

async function getUniqueGenres(type) {
Amplify.configure(outputs);
  const client = generateClient();

  try {
    // Fetch all movies
    const result_movies = await fetchAllPaginatedData(client, 'Movie', {type: {eq : type}});
 


    // Extract unique genres
    const genresSet = new Set();
    result_movies.forEach((movie) => {
      if (movie.genre) {
        // Split genres by ',' and trim whitespace
        movie.genre.split(',').map((g) => genresSet.add(g.trim()));
      }
    });
 

    const uniqueGenres = Array.from(genresSet);
    for (item in uniqueGenres){
        console.log(uniqueGenres[item])
        let client_provided = {}
        if (type == "game"){
            client_provided = client.models.GameGenre
        }
        if (type == "movie"){
            client_provided = client.models.MovieGenre
        }


        
        createGenre(client_provided, uniqueGenres[item])

    }




    return uniqueGenres;
  } catch (error) {
    console.error('Error getting unique genres:', error);
    throw error;
  }
}


async function createGenre(type, data) {
    await type.create({
      genre: data,

    })
  }

movie_list =  getUniqueGenres("movie").catch(error => {
    console.error('Error processing movies and weapons:', error);
  });

  movie_list =  getUniqueGenres("game").catch(error => {
    console.error('Error processing movies and weapons:', error);
  });

