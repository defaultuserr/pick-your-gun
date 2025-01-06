<template>
  <div class="home">
    <h1 class="title">Cosplay Character Matcher</h1>
    <div class="upload-container">
      <label class="upload-label">
        <input type="file" @change="handleFileUpload" accept="image/*" />
        Choose a Photo
      </label>
      <button class="btn-primary" @click="submitPhoto">Find My Match!</button>
    </div>
    <div class="preview-container">
      <img v-if="uploadedImage" :src="uploadedImage" class="uploaded-image" />
    </div>
    <canvas id="canvasOutput"></canvas>
  </div>
</template>

<script>
import '@aws-amplify/ui-vue/styles.css';

import defineComponent from './ai.js';

export default {
  ...defineComponent,
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-label {
  display: inline-block;
  padding: 10px 20px;
  background-color: #6200ea;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  transition: background-color 0.3s ease;
}

.upload-label:hover {
  background-color: #3700b3;
}

.upload-label input {
  display: none;
}

.btn-primary {
  padding: 10px 20px;
  background-color: #03dac6;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #018786;
}

.preview-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.uploaded-image {
  max-width: 100%;
  height: auto;
  border: 2px solid #6200ea;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

canvas {
  margin-top: 20px;
  max-width: 100%;
  display: block;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
