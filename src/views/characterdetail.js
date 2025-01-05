import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { useRoute } from 'vue-router';
import defaultImage from '@/assets/images/ranger.jpg'; 
import defaultImageItem from '@/assets/images/item1.jpg'; 
import { getPresignedUrl } from '../shared.js';
const images = import.meta.glob('@/assets/images/*.jpg', { eager: true });
const randomImagePaths = Object.values(images).map((image) => image.default);



export default defineComponent({
  name: 'CharacterDetail',
  setup() {
    const route = useRoute();
    const client = generateClient();
    const character = ref(null);
    const loading = ref(true); // State for skeleton loader
    const characterImage = ref(null);

    const fetchCharacterDetails = async () => {
      try {
        const characterId = route.params.id;
        const { data, errors } = await client.models.CosplayRecommendation.get({ id: characterId });
        if (errors) {
          console.error('Error fetching character details:', errors);
        } else {
          data.key_items = transformKeyItems(data.key_items);
          character.value = data;

          // Fetch the presigned URL for the character image
          characterImage.value = await getCharacterImage(data.image_url);
          console.log('Character:', characterImage.value);
          loading.value = false; // Stop loading skeleton once the character details are fetched
        }
      } catch (error) {
        console.error('Error fetching character details:', error);
      } 
    };

    const getCharacterImage = async (path) => {
      try {
        const presignedUrl = await getPresignedUrl(path);
        return presignedUrl || defaultImage;
      } catch (error) {
        console.error('Error fetching character image:', error);
        return defaultImage;
      }
    };

    const onImageLoad = () => {
      loading.value = false; // Stop loading skeleton once the image is loaded
    };

    const logItem = (item) => {
      console.log('Clicked Item:', item);
    };

    function transformKeyItems(stringsArray) {
      return stringsArray.map((str) => {
        if (typeof str !== "string") {
          console.error("Invalid item; expected a string:", str);
          return null;
        }

        const withoutBraces = str.slice(1, -1);
        const keyValuePairs = withoutBraces.split(", ");

        const obj = {};
        keyValuePairs.forEach((pair) => {
          const [key, value] = pair.split("=");
          obj[key] = value;
        });

        return obj;
      }).filter((item) => item !== null);
    }

    onMounted(fetchCharacterDetails);

    return {
      character,
      logItem,
      defaultImage,
      characterImage,
      defaultImageItem,
      loading, // Expose the loading state
      onImageLoad,
    };
  },
});
