<template>
  <div>
    <h1>Movies List</h1>

   <div class="filter-bar">



      <!-- Media Type Filter -->
      <label for="media-type-filter" class="media-filter-label">Filter by Media Type:</label>
     <select id="media-type-filter" v-model="selectedMediaType" @change="fetchMovies">
  <option value="">All</option>
  <option v-for="type in mediaTypes" :key="type" :value="type">
    {{ type }}
  </option>
</select>


    <label for="genre-filter">Filter by Genre:</label>
    <select id="genre-filter" v-model="selectedGenre" @change="fetchMovies">
      <option value="">All</option> <!-- Default option -->
      <option v-for="genre in genres" :key="genre" :value="genre">
        {{ genre }}
      </option>
    </select>

  </div>


  
    <div class="movie-list">
      <div class="movie-card" v-for="movie in movies" :key="movie.id">
        <div class="movie-card-content">
          <router-link :to="'/media/' + movie.id">
            <h2>{{ movie.title }}</h2>
            <p>{{ movie.year }}</p>
            <p>{{ movie.description }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defineComponent from './media.js';

export default {
  ...defineComponent,
};
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

.filter-bar {
  margin-bottom: 20px;
  text-align: center;
}

.filter-bar label {
  margin-right: 10px;
  font-size: 16px;
}

.filter-bar select {
  padding: 5px 10px;
  font-size: 16px;
}

.media-filter-label {
  margin-left: 20px;
}
</style>