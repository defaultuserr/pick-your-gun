import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { useRoute } from 'vue-router';
import defaultImage from '@/assets/images/ranger.jpg'; // Adjust path as necessary

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
          character.value = data;
        }
      } catch (error) {
        console.error('Error fetching character details:', error);
      }
    };

    onMounted(fetchCharacterDetails);

    return {
      character, defaultImage, 
    };
  },
})