<template>
  <div v-if="weapon">
    <h1>{{ weapon.name }}</h1>
    <p>{{ weapon.description }}</p>
    <p><strong>Price:</strong> {{ weapon.price }}</p>
    <p><strong>Affiliate Link:</strong> <a :href="weapon.affiliateLink" target="_blank">Buy Now</a></p>
  </div>
  <div v-else>
    <p>Loading weapon details...</p>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'WeaponDetail',
  setup() {
    const route = useRoute();
    const client = generateClient();
    const weapon = ref(null);

    const fetchWeaponDetails = async () => {
      try {
        const weaponId = route.params.id; // Get the weapon ID from the route params

        // Fetch the weapon details using the weapon ID
        const { data: weaponData, errors: weaponErrors } = await client.models.Weapon.get({ id: weaponId });

        if (weaponErrors) {
          console.error('Error fetching weapon details:', weaponErrors);
        } else {
          weapon.value = weaponData; // Set the fetched weapon data
        }
      } catch (error) {
        console.error('Error fetching weapon details:', error);
      }
    };

    onMounted(fetchWeaponDetails);

    return {
      weapon,
    };
  },
});
</script>

<style scoped>
/* Styling for the weapon detail page */
h1 {
  color: #333;
  font-size: 2em;
}

p {
  color: #666;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
