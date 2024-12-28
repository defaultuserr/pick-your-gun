import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';

export default defineComponent({
  name: 'Movies',
  setup() {
    const client = generateClient();
    const movies = ref([]);

    const fetchMovies = async () => {
      try {
    
        const { data, errors } = await client.models.Movie.list();
        if (errors) {
          console.error('Error fetching movies:', errors);
        } else {
          movies.value = data;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    onMounted(fetchMovies);

    return {
      movies,
    };
  },
});