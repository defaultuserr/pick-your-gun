import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { useRoute } from 'vue-router';
import defaultImage from '@/assets/images/ranger.jpg'; 
import defaultImageItem from '@/assets/images/item1.jpg'; 

const images = import.meta.glob('@/assets/images/*.jpg', { eager: true });
const randomImagePaths = Object.values(images).map((image) => image.default);



export default defineComponent({
  name: 'CharacterDetail',
  setup() {
    const route = useRoute();
    const client = generateClient();
    const character = ref(null);

    const fetchCharacterDetails = async () => {
      try {
        const characterId = route.params.id;
        const { data, errors } = await client.models.CosplayRecommendation.get({ id: characterId });
        if (errors) {
          console.error('Error fetching character details:', errors);
        } else {
          data.key_items = transformKeyItems(data.key_items)
          character.value = data;
          console.log("my key items");
        }
      } catch (error) {
        console.error('Error fetching character details:', error);
      }
    };

    const logItem = (item) => {
      console.log('Clicked Item:', item);
    };

    const getRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * randomImagePaths.length);
      return randomImagePaths[randomIndex];
    };

    function transformKeyItems(stringsArray) {
      return stringsArray.map((str) => {
        if (typeof str !== "string") {
          console.error("Invalid item; expected a string:", str);
          return null; // Skip non-string items
        }
    
        // Remove curly braces and split into key-value pairs
        const withoutBraces = str.slice(1, -1);
        const keyValuePairs = withoutBraces.split(", ");
    
        // Create an object from the key-value pairs
        const obj = {};
        keyValuePairs.forEach((pair) => {
          const [key, value] = pair.split("=");
          obj[key] = value; // Assign the key and value to the object
        });
    
        return obj;
      }).filter((item) => item !== null); // Remove null items
    }

    onMounted(fetchCharacterDetails);

    return {
      character,
      logItem,
      defaultImage, 
      defaultImageItem,
      getRandomImage,
    };
  },
});
