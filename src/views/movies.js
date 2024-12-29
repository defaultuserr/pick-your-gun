import { defineComponent, ref, onMounted, watch } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { fetchAllPaginatedData } from '../shared.js';


export default defineComponent({
  name: 'Movies',
  setup() {
    const client = generateClient();
    const movies = ref([]);
    const genres = ref([]); // Holds the dynamic genres list
    const selectedGenre = ref('');

    const fetchMovies = async () => {
      try {
        const filter = { type: { eq: 'movie' } };
        if (selectedGenre.value) {
          let filter_to_lower = selectedGenre.value.toLowerCase()
          filter.genre_search = { contains: filter_to_lower }; // Dynamically filter by genre
        }
        console.log('Filter applied:', filter);
        const result = await fetchAllPaginatedData(client, 'Movie', filter);
        console.log('Fetched movies:', result);
        movies.value = result;
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        console.log("helper")
        let genres_list = await client.models.MovieGenre.list()
   
        genres.value = genres_list.data; // Fetch unique genres dynamically
        const genres_list_cleaned = genres_list.data.map(item => item.genre);
        genres.value = genres_list_cleaned
        console.log(genres_list_cleaned)
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    onMounted(async () => {
      await fetchGenres(); // Fetch genres on mount
      await fetchMovies(); // Fetch movies on mount
    });

    watch(selectedGenre, () => {
      console.log('Selected genre:', selectedGenre.value);
      fetchMovies();
    });

    return {
      movies,
      genres, // Expose genres for use in the template
      selectedGenre,
      fetchMovies,
    };
  },
});
