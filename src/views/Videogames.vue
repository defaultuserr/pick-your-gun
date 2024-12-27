<template>
  <div>
    <h1>Video Games List</h1>
    <div class="game-list">
      <div class="game-card" v-for="game in videoGames" :key="game.id">
        <div class="game-card-content">
          <h2>{{ game.title }}</h2>
          <p>{{ game.year }}</p>
          <p>{{ game.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';

export default defineComponent({
  name: 'VideoGames',
  setup() {
    const client = generateClient();
    const videoGames = ref([]);

    const fetchVideoGames = async () => {
      try {
        const { data, errors } = await client.models.VideoGame.list();
        if (errors) {
          console.error('Error fetching video games:', errors);
        } else {
          videoGames.value = data;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    onMounted(fetchVideoGames);

    return {
      videoGames,
    };
  },
});
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.game-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-5px);
}

.game-card-content h2 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #333;
}

.game-card-content p {
  font-size: 1em;
  color: #666;
}
</style>
