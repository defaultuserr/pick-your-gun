<template>
<div v-if="character" class="character-card">
  <!-- Skeleton for character image -->
  <div class="image-wrapper">
    <div v-if="loading" class="skeleton-image"></div>
    <img 
      v-else 
      :src="characterImage || defaultImage" 
      alt="Character Image" 
      class="character-image" 
      @load="onImageLoad" 
    
    />
  </div>

  <div class="character-info">
    <h1>{{ character.character }}</h1>
    <p><strong>Difficulty:</strong> {{ character.difficulty }}</p>
    <p><strong>Key Items:</strong></p>
    <div class="key-items">
      <!-- Skeletons for key items -->
      <div v-if="loading" class="key-item-card placeholder" v-for="i in 3" :key="'placeholder-' + i">
        <div class="placeholder-image"></div>
        <p class="placeholder-title">Loading...</p>
      </div>

      <!-- Actual key items -->
      <div 
        v-else 
        v-for="item in character.key_items" 
        :key="item.item" 
        class="key-item-card"
      >
        <a :href="item.affiliate_link" target="_blank" @click.prevent="logItem(item)">
          <img :src="item.image || defaultImageItem" :alt="item.item" class="key-item-image" />
          <p class="key-item-title">{{ item.item || 'Placeholder Title' }}</p>
        </a>
      </div>
    </div>
  </div>
</div>
</template>



<script>
import defineComponent from './characterdetail.js';

export default {
  ...defineComponent,
};
</script>

<style scoped>
.character-details {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}
.item-title {
  font-size: 1em;
  font-weight: bold;
  text-align: center;
  margin-top: 5px;
  color: #333;
}

.key-item-image {
  width: 80px; /* Adjust size to fit design */
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 5px;
}
.key-item-card {
  text-align: center;
  padding: 10px;
}
.key-item-card p {
  font-size: 14px;
  font-weight: bold;
}
.key-item-title {
  font-size: 1em;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-top: 5px;
}

.character-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
  width: 100%;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.character-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.character-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

.character-info {
  text-align: center;
}

h1 {
  color: #333;
  font-size: 1.8em;
  margin-bottom: 10px;
}

p {
  color: #555;
  margin-bottom: 10px;
}

.key-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.key-item-card {
  background-color: #e9ecef;
  border-radius: 8px;
  padding: 10px 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.key-item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.key-item-card p {
  margin: 0;
  color: #333;
  font-size: 1em;
  font-weight: bold;
  text-align: center;
}

.placeholder {
  background-color: #f0f0f0;
  border-radius: 8px;
  text-align: center;
  padding: 10px;
  opacity: 0.7;
}

.placeholder-image {
  width: 80px;
  height: 80px;
  background-color: #ddd;
  border-radius: 5px;
  margin-bottom: 5px;
}

.placeholder-title {
  color: #999;
  font-size: 14px;
}
.image-wrapper {
  position: relative;
  width: 100%;
  height: auto;
}

/* Skeleton loader */
.skeleton-image {
  width: 100%;
  height: 300px; /* Adjust height to match character image dimensions */
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 10px;
}

/* Actual image */
.character-image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
}

/* Key items skeleton */
.placeholder {
  background-color: #f0f0f0;
  border-radius: 8px;
  text-align: center;
  padding: 10px;
  opacity: 0.7;
}

.placeholder-image {
  width: 80px;
  height: 80px;
  background-color: #ddd;
  border-radius: 5px;
  margin-bottom: 5px;
}

.placeholder-title {
  color: #999;
  font-size: 14px;
}

/* Skeleton animation */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.character-image {
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 4; /* Adjust based on your image dimensions */
  object-fit: cover;
}
</style>
