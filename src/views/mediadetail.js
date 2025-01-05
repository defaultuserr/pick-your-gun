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
    const characters = ref([]); 
    const isLoadingCharacters = ref(true);
    const characterPlaceholderCount = ref(3);

    /**
     * Helper: Preload an image URL in the browser. 
     * Returns a promise that resolves on successful load, rejects on error.
     */
    const checkImageLoaded = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);      // success
        img.onerror = () => reject(new Error(`Error loading image: ${url}`));
        img.src = url;
      });
    };

    /**
     * Fetch movie details and associated character data.
     * Waits for all character images to load before showing them.
     */
    const fetchMediaDetails = async () => {
      try {
        const movieId = route.params.id;

        // 1. Fetch the movie itself
        const { data: mediaData, errors: movieErrors } = await client.models.Media.get({ id: movieId });
        if (movieErrors) {
          console.error('Error fetching movie:', movieErrors);
          return;
        }
 
        movie.value = mediaData;

        // 2. Fetch the Cosplay Recommendations (characters)
        const { data: recommendations, errors: cosplayErrors } = await mediaData.cosplay_recommendations();
        if (cosplayErrors) {
          console.error('Error fetching characters:', cosplayErrors);
          return;
        }
        
        // 3. For each recommendation:
        //    - Get presigned image URL or fallback
        //    - Preload the image 
        //    - Return a character object
        const characterPromises = recommendations.map(async (recommendation) => {
          let presignedUrl;
          try {
            presignedUrl = await getPresignedUrl(recommendation.image_url);
          } catch (err) {
            console.error('Error getting presigned URL:', err);
          }

          const finalImageUrl = presignedUrl || defaultImage;
          console.log("presignedUrl", presignedUrl)
          // Wait for the browser to load this image
          await checkImageLoaded(finalImageUrl);

          return {
            id: recommendation.id,
            name: recommendation.character,
            description: recommendation.description || '',
            image_url: finalImageUrl,
          };
        });

        // 4. Wait for ALL images to finish loading before updating characters
        const fullyLoadedCharacters = await Promise.all(characterPromises);

        // 5. Now we have a complete list with guaranteed loaded images
        characters.value = fullyLoadedCharacters;
      } catch (error) {
        console.error('Error fetching movie details or characters:', error);
      } finally {
        // Only now do we say "characters are done loading"
        isLoadingCharacters.value = false;
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
