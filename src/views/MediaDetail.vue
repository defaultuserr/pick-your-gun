<template>
  <div v-if="movie">
    <h1>{{ movie.title }}</h1>
    <p>{{ movie.description }}</p>
    <h2>Characters in this Movie</h2>

    <!-- 1) Show skeleton placeholders while isLoadingCharacters is true -->
    <div v-if="isLoadingCharacters">
      <div
        v-for="index in characterPlaceholderCount"
        :key="index"
        class="character-placeholder"
      >
        <div class="character-placeholder-name"></div>
        <div class="character-placeholder-description"></div>
      </div>
    </div>

    <!-- 2) Once loading is finished, show the actual characters -->
    <div v-else-if="characters.length > 0">
      <ul>
        <router-link
          v-for="character in characters"
          :key="character.id"
          :to="'/character/' + character.id"
          class="character-item-link"
        >
          <li class="character-item">
            <div class="character-header">
              <img
                :src="character.image_url"
                :alt="character.name"
                class="character-thumbnail"
              />
              <h3>{{ character.name }}</h3>
            </div>
            <p>{{ character.description }}</p>
          </li>
        </router-link>
      </ul>
    </div>

    <!-- 3) If no characters at all -->
    <div v-else>
      <p>No characters found for this movie.</p>
    </div>
  </div>
</template>

<script>
import defineComponent from './mediadetail.js';

export default {
  ...defineComponent,
};
</script>

<style scoped>
h1 {
  color: #333;
  font-size: 2em;
}

h2 {
  color: #555;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f4f4f4;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  transition: transform 0.3s ease; /* Smooth transition for the hover effect */
}

/* Hover effect for the character card */
.character-item:hover {
  transform: translateY(-5px); /* Move the item upwards on hover */
}

/* Styling for router-link around the whole list item */
.character-item-link {
  text-decoration: none; /* Remove the default link underline */
  display: block; /* Ensure the entire li is clickable */
  color: inherit; /* Use the default color */
}

.character-placeholder {
  background-color: #f4f4f4;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.character-placeholder-name {
  height: 20px;
  background-color: #ddd;
  width: 80%;
  margin-bottom: 10px;
}

.character-placeholder-description {
  height: 15px;
  background-color: #ddd;
  width: 90%;
}

@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}

.character-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* some spacing around the header */
}

.character-thumbnail {
  width: 40px;          /* Adjust to your preferred size */
  height: 40px;         /* Adjust to your preferred size */
  object-fit: cover;    /* Crops the image to fit the container */
  border-radius: 50%;   /* Makes the image circular; remove if you want a square */
  margin-right: 10px;   /* Spacing between image and the character name */
}

/* Example skeleton styles */
.character-placeholder {
  background-color: #f4f4f4;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}
.character-placeholder-name {
  height: 20px;
  background-color: #ddd;
  width: 80%;
  margin-bottom: 10px;
}
.character-placeholder-description {
  height: 15px;
  background-color: #ddd;
  width: 90%;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}
</style>