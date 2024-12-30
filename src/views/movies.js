import { defineComponent, ref, onMounted, watch } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { fetchAllPaginatedData } from '../shared.js';

export default defineComponent({
  name: 'MediaBrowser',
  setup() {
    const client = generateClient();
    const movies = ref([]);
    const genres = ref([]); // Holds the dynamic genres list
    const mediaTypes = ref(['Movies', 'Videogames']); // Static media types
    const selectedGenre = ref('');
    const selectedMediaType = ref(''); // State for media type filtering

    const fetchMovies = async () => {
      try {
        const filter = {};

        // Apply genre filter
        if (selectedGenre.value) {
          filter.genre_search = { contains: selectedGenre.value.toLowerCase() }; // Filter by genre
        }

        // Determine the media type for filtering
        let type_value = '';
        switch (selectedMediaType.value) {
          case 'Movies':
            type_value = 'movie';
            break;
          case 'Videogames':
            type_value = 'game';
            break;
          case 'All':
            type_value = ''; // No specific type
            break;
          default:
            type_value = ''; // Default to all if no type selected
        }

        // Add type filter if applicable
        if (type_value) {
          filter.type = { eq: type_value };
        }

        console.log('Filter applied:', filter);

        // Fetch movies dynamically based on selected media type
        const result = await fetchAllPaginatedData(client, 'Movie', filter);

        console.log('Fetched movies:', result);
        movies.value = result;
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        console.log('Fetching genres...');
        if (!selectedMediaType.value) {
          genres.value = []; // Clear genres if no media type is selected
          return;
        }

        // Fetch genres based on media type
        let genreModel = '';
        switch (selectedMediaType.value) {
          case 'Movies':
            genreModel = 'MovieGenre';
            break;
          case 'Videogames':
            genreModel = 'GameGenre';
            break;
          default:
            genres.value = [];
            return;
        }

        const genresList = await client.models[genreModel].list();
        const cleanedGenres = genresList.data.map((item) => item.genre);
        genres.value = cleanedGenres;

        console.log('Fetched genres:', cleanedGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    onMounted(async () => {
      await fetchGenres(); // Fetch genres on mount
      await fetchMovies(); // Fetch movies on mount
    });

    watch(selectedMediaType, async () => {
      console.log('Selected media type changed:', selectedMediaType.value);
      await fetchGenres(); // Refetch genres when media type changes
      await fetchMovies(); // Refetch movies when media type changes
    });

    watch(selectedGenre, async () => {
      console.log('Selected genre changed:', selectedGenre.value);
      await fetchMovies(); // Refetch movies when genre changes
    });

    return {
      movies,
      genres, // Expose genres for use in the template
      mediaTypes, // Expose media types for use in the template
      selectedGenre,
      selectedMediaType, // Expose selected media type
      fetchMovies,
    };
  },
});
