<template>
  <div class="gun-detail">
    <h1>{{ gun?.name }}</h1>
    <p>{{ gun?.description }}</p>
    <p><strong>Price: {{ gun?.price }}</strong></p>
    <a :href="gun?.affiliateLink" target="_blank" rel="noopener noreferrer" class="buy-link">
      Buy Now
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

interface Gun {
  id: string;
  name: string;
  description: string;
  price: string;
  affiliateLink: string;
}

export default defineComponent({
  name: "Gun",
  setup() {
    const route = useRoute();

    const guns: Gun[] = [
      {
        id: "1",
        name: "Glock 17",
        description: "A reliable handgun favored by law enforcement and civilians.",
        price: "$500",
        affiliateLink: "https://example.com/glock-17",
      },
      {
        id: "2",
        name: "AR-15",
        description: "A highly customizable semi-automatic rifle.",
        price: "$1000",
        affiliateLink: "https://example.com/ar-15",
      },
    ];

    // Fetch the gun based on the ID in the route
    const gun = guns.find((g) => g.id === route.params.id);

    return { gun };
  },
});
</script>

<style>
.gun-detail {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.gun-detail h1 {
  margin-bottom: 10px;
}
.gun-detail p {
  margin: 5px 0;
}
.buy-link {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}
.buy-link:hover {
  background-color: #0056b3;
}
</style>
