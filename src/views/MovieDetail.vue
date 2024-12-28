<template>
  <div v-if="movie">
    <h1>{{ movie.title }}</h1>
    <p>{{ movie.description }}</p>
    <h2>Weapons in this Movie</h2>

    <div v-if="isLoadingWeapons">
      <div v-for="index in weaponPlaceholderCount" :key="index" class="weapon-placeholder">
        <div class="weapon-placeholder-name"></div>
        <div class="weapon-placeholder-description"></div>
      </div>
    </div>

    <div v-else-if="weapons.length > 0">
      <ul>
        <!-- Wrap the entire li in router-link to make the whole card clickable -->
        <router-link 
          v-for="weapon in weapons" 
          :key="weapon.id" 
          :to="'/weapon/' + weapon.id" 
          class="weapon-item-link"
        >
          <li class="weapon-item">
            <!-- Weapon content -->
            <h3>{{ weapon.name }}</h3>
            <p>{{ weapon.description }}</p>
          </li>
        </router-link>
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
    const isLoadingWeapons = ref(true); // Track the loading state for weapons
    const weaponPlaceholderCount = ref(5); // Number of placeholder weapons to show

    const fetchMovieDetails = async () => {
      try {
        const movieId = route.params.id;

        const { data: movieData, errors: movieErrors } = await client.models.Movie.get({ id: movieId });
        if (movieErrors) {
          console.error('Error fetching movie:', movieErrors);
        } else {
          movie.value = movieData;

          const { data: weaponMoviesData, errors: weaponMoviesErrors } = await client.models.WeaponMovie.list({
            filter: { movieId: { eq: movieId } },
          });

          if (weaponMoviesErrors) {
            console.error('Error fetching WeaponMovie relationships:', weaponMoviesErrors);
          } else {
            const weaponIds = weaponMoviesData.map((wm) => wm.weaponId);

            if (weaponIds.length > 0) {
              const weaponFetchPromises = weaponIds.map((weaponId) =>
                client.models.Weapon.get({ id: weaponId })
              );

              const weaponResults = await Promise.all(weaponFetchPromises);

              weaponResults.forEach((result) => {
                if (result.errors) {
                  console.error(`Error fetching weapon ${result.data.id}:`, result.errors);
                } else {
                  weapons.value.push(result.data);
                }
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching movie details or weapons:', error);
      } finally {
        isLoadingWeapons.value = false;
      }
    };

    onMounted(fetchMovieDetails);

    return {
      movie,
      weapons,
      isLoadingWeapons,
      weaponPlaceholderCount,
    };
  },
});
</script>

<style scoped>
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
  transition: transform 0.3s ease; /* Smooth transition for the hover effect */
}

/* Hover effect for the weapon card */
.weapon-item:hover {
  transform: translateY(-5px); /* Move the item upwards on hover */
}

/* Styling for router-link around the whole list item */
.weapon-item-link {
  text-decoration: none; /* Remove the default link underline */
  display: block; /* Ensure the entire li is clickable */
  color: inherit; /* Use the default color */
}



.weapon-placeholder {
  background-color: #f4f4f4;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.weapon-placeholder-name {
  height: 20px;
  background-color: #ddd;
  width: 80%;
  margin-bottom: 10px;
}

.weapon-placeholder-description {
  height: 15px;
  background-color: #ddd;
  width: 90%;
}

@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}
</style>
