<template>
  <div>
    <h1>Movies List</h1>

    <div class="filter-bar">
      <!-- Media Type Filter -->
      <div class="filter-group">
        <label for="media-type-filter" class="media-filter-label">
          Filter by Media Type:
        </label>
        <select id="media-type-filter" v-model="selectedMediaType" @change="fetchMovies">
          <option value="">All</option>
          <option v-for="type in mediaTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>

      <!-- Genre Filter -->
      <div class="filter-group">
        <label for="genre-filter">Filter by Genre:</label>
        <select id="genre-filter" v-model="selectedGenre" @change="fetchMovies">
          <option value="">All</option>
          <option v-for="genre in genres" :key="genre" :value="genre">
            {{ genre }}
          </option>
        </select>
      </div>
    </div>

    <!-- If initial load, show skeleton placeholders -->
    <div v-if="isInitialLoad" class="loading-indicator">
      <p>Loading initial data, please wait...</p>
      <div
        v-for="placeholderIndex in 6"
        :key="placeholderIndex"
        class="movie-card skeleton-card"
      >
        <div class="movie-card-content">
          <h2 class="skeleton-title"></h2>
          <p class="skeleton-subtitle"></p>
          <p class="skeleton-description"></p>
        </div>
      </div>
    </div>

    <!-- Once we have data, render movie list -->
    <div v-else class="movie-list-container">
      <!-- Overlay spinner if we’re refreshing data (after initial) -->
      <div v-if="isRefreshing" class="refresh-overlay">
        <div class="spinner"></div>
        <div class="spinner-text">Refreshing data...</div>
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
  </div>
</template>

<script>
import defineComponent from './media.js';

export default {
  // Spread in the logic from media.js
  ...defineComponent,
};
</script>

<style scoped>
/* ===== Common Headline ===== */
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

/* ===== Filter Bar Styling ===== */
.filter-bar {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-bar select {
  width: 150px;
  padding: 5px 10px;
  font-size: 16px;
}

.filter-bar label {
  font-size: 16px;
}

.media-filter-label {
  margin-left: 0;
}

/* ===== Loading Indicator / Skeleton Styles (for initial load) ===== */
.loading-indicator {
  text-align: center;
  font-size: 1.2rem;
  color: #999;
}

/* Simple "skeleton" look */
.skeleton-card {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
}

.skeleton-title {
  width: 80%;
  height: 20px;
  background-color: #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
}

.skeleton-subtitle {
  width: 60%;
  height: 15px;
  background-color: #ddd;
  margin-bottom: 10px;
  border-radius: 4px;
}

.skeleton-description {
  width: 100%;
  height: 10px;
  background-color: #ddd;
  margin-bottom: 5px;
  border-radius: 4px;
}

/* ===== Movie List Styling (when data is loaded) ===== */
.movie-list-container {
  position: relative; /* needed for the refresh overlay */
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

/* ===== Refresh Overlay & Spinner (for subsequent loads) ===== */
.refresh-overlay {
  /* Cover the entire .movie-list-container */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  /* Semi-transparent white background */
  background-color: rgba(255, 255, 255, 0.7);

  /* Center its contents */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  z-index: 10; /* On top of the movie list */
}

/* A simple spinner using a rotating border approach */
.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;  /* Light grey border */
  border-top-color: #333;  /* Dark top border for contrast */
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-bottom: 10px;
}

.spinner-text {
  font-size: 1.1rem;
  color: #333;
}

/* Keyframes for the spinner rotation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
