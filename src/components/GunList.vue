<template>
  <div>
    <h1>Firearms Collection</h1>

    <!-- Loading state -->
    <div v-if="loading">Loading...</div>

    <!-- Error state -->
    <div v-if="error" class="error">
      <p>Error: {{ error }}</p>
    </div>

    <!-- Guns data -->
    <div v-if="guns.length">
      <div v-for="gun in guns" :key="gun.id" class="gun-card">
        <h2>{{ gun.name }}</h2>
        <p>{{ gun.description }}</p>
        <p>Price: ${{ gun.price }}</p>
        <a :href="gun.affiliateLink" target="_blank">Affiliate Link</a>

        <!-- Movies section -->
        <div v-if="gun.movies && gun.movies.length">
          <h3>Movies Featuring This Gun:</h3>
          <ul>
            <li v-for="movie in gun.movies" :key="movie.id">
              {{ movie.title }} ({{ movie.year }}) - {{ movie.description }}
            </li>
          </ul>
        </div>

        <!-- Video Games section -->
        <div v-if="gun.videoGames && gun.videoGames.length">
          <h3>Video Games Featuring This Gun:</h3>
          <ul>
            <li v-for="game in gun.videoGames" :key="game.id">
              {{ game.title }} ({{ game.year }}) - {{ game.description }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { Amplify } from "aws-amplify";
// Define models as expected
interface Movie {
  id: string;
  title: string;
  year: number;
  description: string;
}

interface VideoGame {
  id: string;
  title: string;
  year: number;
  description: string;
}

interface Gun {
  id: string;
  name: string;
  description: string;
  price: number;
  affiliateLink: string;
  movies?: Movie[];
  videoGames?: VideoGame[];
}

export default defineComponent({
  name: 'GunList',
  setup() {
    const guns = ref<Gun[]>([]);
    const loading = ref<boolean>(true);
    const error = ref<string | null>(null);
    

    // Initialize the client
    const client = generateClient();

    // Function to fetch all guns from the database
    const fetchGuns = async () => {
      try {
        // List all weapons from the database
        const { data: weaponsData, errors } = await client.models.Weapon.list();
        
        if (errors) {
          throw new Error('Error fetching weapons data');
        }

        // For each weapon, query related movies and video games
        for (let gun of weaponsData) {
          // Query related movies
          const { data: moviesData } = await client.models.Movie.list({
            filter: { weaponId: { eq: gun.id } },
          });
          
          // Query related video games
          const { data: videoGamesData } = await client.models.VideoGame.list({
            filter: { weaponId: { eq: gun.id } },
          });

          // Attach the related movies and video games to the gun
          gun.movies = moviesData;
          gun.videoGames = videoGamesData;
        }

        // Set the gun data to be rendered
        guns.value = weaponsData;
      } catch (err) {
        console.error('Error:', err);
        error.value = 'An error occurred while fetching data.';
      } finally {
        loading.value = false;
      }
    };

    // Fetch data when the component is mounted
    onMounted(fetchGuns);

    return {
      guns,
      loading,
      error,
    };
  },
});
</script>

<style scoped>
.gun-card {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
}

.error {
  color: red;
}
</style>
