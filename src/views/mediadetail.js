import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { useRoute } from 'vue-router';
import defaultImage from '@/assets/images/ranger.jpg'; 

import { getPresignedUrl } from '../shared.js';
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
        

          // Populate characters array with fetched data
          for (const recommendation of recommendations) {
          
            characters.value.push({
              id: recommendation.id, // Ensure each character has a unique ID
              name: recommendation.character,
              description: recommendation.description || '', // Add a description if available
              image_url: await getPresignedUrl(recommendation.image_url) || "no url found", // Example property name
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
