import { defineComponent, ref, onMounted, watch } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { fetchAllPaginatedData } from '../shared.js';

export default defineComponent({
  name: 'MediaBrowser',
  setup() {
    const client = generateClient();

    const movies = ref([]);
    const genres = ref([]);
    const mediaTypes = ref(['Movies', 'Videogames', 'Series']);
    const selectedGenre = ref('');
    const selectedMediaType = ref('');

    // Track initial load vs. subsequent refresh
    const isInitialLoad = ref(true);
    const isRefreshing = ref(false);

    /**
     * Fetch the movies based on current filters
     */
    const fetchMovies = async () => {
      try {
        // If we've never loaded data before, show skeletons
        if (movies.value.length === 0) {
          isInitialLoad.value = true;
        } else {
          // Otherwise, show the overlay spinner
          isRefreshing.value = true;
        }

        const filter = {};

        // Genre filter
        if (selectedGenre.value) {
          filter.genre_lowercase = {
            contains: selectedGenre.value.toLowerCase(),
          };
        }

        // Media type filter
        let type_value = '';
        switch (selectedMediaType.value) {
          case 'Movies':
            type_value = 'movie';
            break;
          case 'Videogames':
            type_value = 'game';
            break;
          case 'Series':
            type_value = 'series';
            break;
          default:
            // If empty or "All," do nothing
            type_value = '';
        }
        if (type_value) {
          filter.type = { eq: type_value };
        }

        console.log('Filter applied:', filter);

        const result = await fetchAllPaginatedData(client, 'Media', filter);

        console.log('Fetched movies:', result);
        movies.value = result;
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        isInitialLoad.value = false;
        isRefreshing.value = false;
      }
    };

    /**
     * Fetch genres based on the selected media type
     */
    const fetchGenres = async () => {
      try {
        console.log('Fetching genres...');
        if (!selectedMediaType.value) {
          // If user picked "All" or left it empty, clear out genres
          genres.value = [];
          return;
        }

        let genreModel = '';
        switch (selectedMediaType.value) {
          case 'Movies':
            genreModel = 'movie';
            break;
          case 'Videogames':
            genreModel = 'game';
            break;
          case 'Series':
            genreModel = 'series';
            break;
          default:
            genres.value = [];
            return;
        }

        console.log('Mapping media type to genreModel:', genreModel);

        const genresList = await client.models.Genre.list({
          filter: {
            type: { eq: genreModel },
          },
          selectionSet: ['genre'],
        });

        const justGenres = genresList.data.map((item) => item.genre);
        console.log('Fetched genres:', justGenres);
        genres.value = justGenres;
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    /**
     * Initial load: fetch genres and movies
     */
    onMounted(async () => {
      await fetchGenres();
      await fetchMovies();
    });

    /**
     * Watch for changes in media type
     * -> update genres, reset selectedGenre
     */
    watch(selectedMediaType, async (newVal, oldVal) => {
      if (newVal !== oldVal) {
        // Reset the selected genre whenever media type changes
        selectedGenre.value = '';
        await fetchGenres();
      }
    });

    /**
     * SINGLE WATCH for both media type & genre -> fetch movies
     * This ensures only ONE call to fetchMovies() for any filter change
     */
    watch([selectedMediaType, selectedGenre], async () => {
      await fetchMovies();
    });

    // Return all reactive data and methods
    return {
      movies,
      genres,
      mediaTypes,
      selectedGenre,
      selectedMediaType,
      // Loading flags
      isInitialLoad,
      isRefreshing,
      // Methods
      fetchMovies,
    };
  },
});
