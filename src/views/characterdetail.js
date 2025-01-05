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
    const loading = ref(true); // New loading state
    let characterImage = ref(null);

    const fetchCharacterDetails = async () => {

      try {
        const characterId = route.params.id;
        const { data, errors } = await client.models.CosplayRecommendation.get({ id: characterId });
        if (errors) {
          console.error('Error fetching character details:', errors);
        } else {
          data.key_items = transformKeyItems(data.key_items);
          character.value = data;
          characterImage.value = await getCharacterImage(data.image_url);

          
        }
      } catch (error) {
        console.error('Error fetching character details:', error);
      } finally {
        loading.value = false; // Set loading to false after fetching
      }
    };

    const logItem = (item) => {
      console.log('Clicked Item:', item);
    };

    const getRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * randomImagePaths.length);
      return randomImagePaths[randomIndex];
    };

    const getCharacterImage = async (path) => {

      let presignedUrl = await getPresignedUrl(path);
      console.log("Presigned URL: ");
      console.log(presignedUrl);
      return presignedUrl || defaultImage;
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
      getRandomImage,
      getCharacterImage,
      loading, // Expose the loading state
    };
  },
});
