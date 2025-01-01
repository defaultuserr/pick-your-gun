import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { useRoute } from 'vue-router';
import defaultImage from '@/assets/images/ranger.jpg'; 
export default defineComponent({
  name: 'MediaDetail',
  setup() {
    const route = useRoute();
    const client = generateClient();
    const movie = ref(null);
    const characters = ref([]); // Store the characters
    const isLoadingCharacters = ref(true); // Track the loading state for characters
    const characterPlaceholderCount = ref(5); // Number of placeholder characters to show

    const fetchMediaDetails = async () => {
      try {
        const movieId = route.params.id;

        // Fetch movie details
        const { data: mediaData, errors: movieErrors } = await client.models.Media.get({ id: movieId });
        if (movieErrors) {
          console.error('Error fetching movie:', movieErrors);
        } else {
          movie.value = mediaData;

          // Fetch related cosplay recommendations
          const { data: recommendations } = await mediaData.cosplay_recommendations();
          console.log('Fetched recommendations:', recommendations);

          // Populate characters array with fetched data
          for (const recommendation of recommendations) {
            console.log(`Character: ${recommendation.character}`);
            characters.value.push({
              id: recommendation.id, // Ensure each character has a unique ID
              name: recommendation.character,
              description: recommendation.description || '', // Add a description if available
              image: recommendation.image_url || defaultImage, // Example property name
            });
          }
        }
      } catch (error) {
        console.error('Error fetching movie details or characters:', error);
      } finally {
        isLoadingCharacters.value = false; // Loading complete
      }
    };

    onMounted(fetchMediaDetails);

    return {
      movie,
      characters,
      isLoadingCharacters,
      characterPlaceholderCount,
    };
  },
});
