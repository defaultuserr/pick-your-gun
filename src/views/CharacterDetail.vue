<template>
  <div v-if="character" class="character-details">
    <div class="character-card">
    
      <img :src="defaultImage" alt="Character Image" class="character-image" />

      <div class="character-info">
        <h1>{{ character.character }}</h1>
        <p><strong>Difficulty:</strong> {{ character.difficulty }}</p>
        <p><strong>Key Items:</strong></p>
        <div class="key-items">
          <div 
            v-for="item in character.key_items" 
            :key="item" 
            class="key-item-card"
          >
            <p>{{ item }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading character details...</p>
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
</style>
