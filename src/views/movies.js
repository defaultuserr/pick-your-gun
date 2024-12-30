import { defineComponent, ref, onMounted, watch } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { fetchAllPaginatedData } from '../shared.js';

export default defineComponent({
  name: 'Movies',
  setup() {
    const client = generateClient();
    const movies = ref([]);
    const genres = ref([]); // Holds the dynamic genres list
    const mediaTypes = ref(['Movies',  'Videogames']); // Static media types
    const selectedGenre = ref('');
    const selectedMediaType = ref(''); // New state for media type filtering

    const fetchMovies = async () => {
      try {
        const filter = {};
    
    
    
        // Apply genre filter
        if (selectedGenre.value) {
          filter.genre_search = { contains: selectedGenre.value.toLowerCase() }; // Filter by genre
        }
    
      
    
        // Fetch movies dynamically based on selected media type
        const mediaTypeModel = selectedMediaType.value || 'Movie'; // Default to 'Movie' if no media type is selected
      
        let type_value = "";
        switch (mediaTypeModel) {
          case 'Movies':
            type_value = "movie";
            break;
          case 'Videogames':
            type_value = "game";
            break;
          case 'All':
            type_value = "";
          default:
            type_value = "";
        }
        // add type to filter
      
       filter.type = { eq: type_value }
       console.log("my filter")
       console.log(filter)
      const result = await fetchAllPaginatedData(client, "Movie", filter);
        
        console.log('Fetched movies:', result);
        movies.value = result;
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        console.log("Fetching genres...");
        let genres_list = await client.models.MovieGenre.list();
        genres.value = genres_list.data; // Fetch unique genres dynamically
        const genres_list_cleaned = genres_list.data.map(item => item.genre);
        genres.value = genres_list_cleaned;
        console.log(genres_list_cleaned);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    onMounted(async () => {
      await fetchGenres(); // Fetch genres on mount
      await fetchMovies(); // Fetch movies on mount
    });

    watch([selectedGenre, selectedMediaType], () => {
      console.log('Filters updated:', { genre: selectedGenre.value, mediaType: selectedMediaType.value });
      fetchMovies(); // Refetch movies when filters change
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
