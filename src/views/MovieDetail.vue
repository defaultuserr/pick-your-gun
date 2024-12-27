<template>
  <div v-if="movie">
    <h1>{{ movie.title }}</h1>
    <p>{{ movie.description }}</p>
    <h2>Weapons in this Movie</h2>
    <div v-if="weapons.length > 0">
      <ul>
        <li v-for="weapon in weapons" :key="weapon.id">
          <h3>{{ weapon.name }}</h3>
          <p>{{ weapon.description }}</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No weapons found for this movie.</p>
    </div>
  </div>
  <div v-else>
    <p>Loading movie details...</p>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MovieDetail',
  setup() {
    const route = useRoute();
    const client = generateClient();
    const movie = ref(null);
    const weapons = ref([]);

    const fetchMovieDetails = async () => {
      try {
        // Get the movie ID from the route params
        const movieId = route.params.id;

        // Fetch the movie details
        const { data: movieData, errors: movieErrors } = await client.models.Movie.get({ id: movieId });
        if (movieErrors) {
          console.error('Error fetching movie:', movieErrors);
        } else {
          movie.value = movieData;

          // Fetch weapon relationships associated with the movie by movieId
          const { data: weaponMoviesData, errors: weaponMoviesErrors } = await client.models.WeaponMovie.list({
            filter: { movieId: { eq: movieId } }, // Filter by movieId
          });

          if (weaponMoviesErrors) {
            console.error('Error fetching WeaponMovie relationships:', weaponMoviesErrors);
          } else {
            // Extract weapon IDs from the relationships
            const weaponIds = weaponMoviesData.map((wm) => wm.weaponId);

            // Iterate over weaponIds and fetch each weapon separately
            for (const weaponId of weaponIds) {
              const { data: weaponData, errors: weaponErrors } = await client.models.Weapon.get({
                id: weaponId,
              });

              if (weaponErrors) {
                console.error(`Error fetching weapon ${weaponId}:`, weaponErrors);
              } else {
                weapons.value.push(weaponData); // Add the fetched weapon data to the list
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching movie details or weapons:', error);
      }
    };

    onMounted(fetchMovieDetails);

    return {
      movie,
      weapons,
    };
  },
});
</script>

<style scoped>
/* Add some styling to enhance the look */
h1 {
  color: #333;
  font-size: 2em;
}

h2 {
  color: #555;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f4f4f4;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

h3 {
  font-size: 1.2em;
  margin: 0;
}

p {
  color: #666;
}
</style>
