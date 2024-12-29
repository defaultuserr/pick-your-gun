import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { useRoute } from 'vue-router';
import { fetchAllPaginatedData } from '../shared.js'; // Adjust the path as needed
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

          const { data: weaponMoviesData1, errors: weaponMoviesErrors } = await client.models.WeaponMovie.list({
            filter: { movieId: { eq: movieId } },
        });
        const weaponMoviesData = await fetchAllPaginatedData(client, 'WeaponMovie', { movieId: { eq: movieId }});
        console.log(weaponMoviesData)
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