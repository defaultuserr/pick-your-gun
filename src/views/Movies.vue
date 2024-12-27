<template>
  <div>
    <h1>Movies List</h1>
    <div class="movie-list">
      <div class="movie-card" v-for="movie in movies" :key="movie.id">
        <div class="movie-card-content">
          <h2>{{ movie.title }}</h2>
          <p>{{ movie.year }}</p>
          <p>{{ movie.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';

export default defineComponent({
  name: 'Movies',
  setup() {
    const client = generateClient();
    const movies = ref([]);

    const fetchMovies = async () => {
      try {
        const { data, errors } = await client.models.Movie.list();
        if (errors) {
          console.error('Error fetching movies:', errors);
        } else {
          movies.value = data;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    onMounted(fetchMovies);

    return {
      movies,
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

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.movie-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-card-content h2 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #333;
}

.movie-card-content p {
  font-size: 1em;
  color: #666;
}
</style>
