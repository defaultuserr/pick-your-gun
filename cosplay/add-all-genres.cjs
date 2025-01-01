


const { fetchAllPaginatedData } = require ('../src/shared.js');
const { generateClient } = require('aws-amplify/data');
const { Amplify } = require('aws-amplify');
const outputs = require('../amplify_outputs.json');  // Use require for JSON in CommonJS

Amplify.configure(outputs);
const client = generateClient();

async function check_in_genre_exists (genre_value, media_type)  {
    console.log("filter")
    console.log(media_type)
    console.log(genre_value)
const movies = await fetchAllPaginatedData(client, 'Genre', {
    and: [
      { type: { eq: media_type } },
      { genre_lowercase: { eq: genre_value.toLowerCase() } }
    ]
  });
  if (movies.length >= 1){
    return true
  }else {
    return false
  }
  
  


}
async function createGenresWithType(genre_value,type_value) {
const { errors: weaponErrors, data: genreData } = await client.models.Genre.create({
  type: type_value,
  genre_lowercase: genre_value.toLowerCase(),
  genre: genre_value,
});
console.log(genreData)
}


function parseGenresStringToObject(inputString) {
    // 1. Remove the square brackets
    const noBrackets = inputString.slice(1, -1);
    
    // 2. Split on commas
    const genresArray = noBrackets.split(",");
    
    // 3. Trim whitespace around each genre
    const trimmedGenres = genresArray.map(genre => genre.trim());
    
 
    return trimmedGenres
    ;
  }



const getAllGenres = async () => {
    const movies = await fetchAllPaginatedData(client, 'Media');
    
    for(item in movies) {

    let type = movies[item]["type"]
    genre_array = parseGenresStringToObject(movies[item]["genre"])
    for (genre in genre_array) {
        console.log(genre_array[genre])
        console.log(type)
        if (await check_in_genre_exists(genre_array[genre],type)) {

            console.log("genre exists")
        }  else {
          createGenresWithType(genre_array[genre], type)
        }
        
    }
    
    }

  };


getAllGenres()