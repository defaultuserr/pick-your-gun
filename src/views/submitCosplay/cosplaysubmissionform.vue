<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-h5">Submit Your Cosplay</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="handleSubmit">
          <!-- Character Name -->
          <v-text-field
            label="Character Name"
            v-model="form.character"
            outlined
            :rules="[rules.required]"
            required
          ></v-text-field>

          <!-- Media Type -->
          <v-select
            label="Media Type"
            v-model="form.media_type"
            :items="mediaTypes"
            outlined
            :rules="[rules.required]"
            required
          ></v-select>

          <!-- Media Title -->
          <v-text-field
            label="Media Title"
            v-model="form.media_title"
            outlined
            :rules="[rules.required]"
            required
          ></v-text-field>

          <!-- Difficulty Level -->
          <v-select
            label="Difficulty Level"
            v-model="form.difficulty"
            :items="difficultyLevels"
            outlined
            :rules="[rules.required]"
            required
          ></v-select>

          <!-- Item Links -->
          <div>
            <p class="text-subtitle-1">Item Links</p>
            <v-row
              v-for="(link, index) in form.item_links"
              :key="index"
              align="center"
              class="d-flex"
            >
              <!-- Item Name -->
              <v-col cols="5">
                <v-text-field
                  label="Item Name"
                  v-model="link.item_name"
                  outlined
                  dense
                  class="item-input"
                ></v-text-field>
              </v-col>

              <!-- URL -->
              <v-col cols="5">
                <v-text-field
                  label="URL"
                  v-model="link.link"
                  outlined
                  dense
                  placeholder="https://example.com/item"
                  class="item-input"
                ></v-text-field>
              </v-col>

              <!-- Delete Button -->
              <v-col cols="2" class="d-flex align-center justify-center">
                <v-btn
                  icon
                  color="red"
                  @click="removeItemLink(index)"
                  style="min-width: 36px; height: 36px; padding: 0;"
                >
                  <v-icon size="20">mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-btn
              @click="addItemLink"
              color="primary"
              outlined
              class="mt-4 mb-4"
            >
              Add Item Link
            </v-btn>
          </div>

          <!-- Image Upload -->
          <v-file-input
            label="Upload Images"
            v-model="form.images"
            multiple
            outlined
            accept="image/*"
          ></v-file-input>

          <!-- Description -->
          <v-textarea
            label="Description"
            v-model="form.description"
            outlined
            rows="5"
            placeholder="Tell us more about your cosplay..."
          ></v-textarea>

          <!-- Submit Button -->
          <v-btn
            type="submit"
            color="primary"
            block
            class="mt-4"
            :disabled="!formValid"
          >
            Submit Cosplay
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<script>
import '@aws-amplify/ui-vue/styles.css';

import defineComponent from './cosplaysubmit.js';

export default {
  ...defineComponent,
};
</script>
<style scoped>
/* Main Styling for Container */
.v-container {
  max-width: 600px;
  margin: 0 auto;
}

/* Styling for Submission Form */
.cosplay-submission {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

/* Styling for Form Elements */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Styling for Item Links Section */
.item-link {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

/* Styling for Submit Button */
.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.delete-btn {
  color: #ff0000; /* Red color */
  transition: color 0.3s;
}

.delete-btn:hover {
  color: #ff4d4d; /* Lighter red on hover */
}
.submit-btn:hover {
  background-color: #0056b3;
}

.item-input {
  height: 56px; /* Same as the height of dense v-text-field */
}

.v-btn {
  height: 36px; /* Adjust button height to match v-text-field */
  line-height: 36px; /* Center the icon */
}

</style>
