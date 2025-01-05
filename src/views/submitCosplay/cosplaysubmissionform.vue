<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Submit a Cosplay Recommendation</v-card-title>
      <v-card-text>
        <v-form>
          <!-- Character Name -->
          <v-text-field
            v-model="form.characterName"
            label="Character Name"
            outlined
            required
          ></v-text-field>

          <!-- Media Type -->
          <v-select
            v-model="form.mediaType"
            :items="mediaTypes"
            label="Media Type"
            outlined
            required
          ></v-select>

          <!-- Media Title -->
          <v-combobox
            v-model="form.mediaTitle"
            :items="mediaTitles"
            label="Media Title"
            outlined
            clearable
            chips
            hint="Select a media title or add your own"
          ></v-combobox>

          <!-- Difficulty Level -->
          <v-select
            v-model="form.difficulty"
            :items="difficultyLevels"
            label="Difficulty Level"
            outlined
            required
          ></v-select>

          <!-- Items -->
               <v-card class="pa-3 mt-3">
            <v-card-title>Items</v-card-title>
            <v-card-text>
              <div v-for="(item, index) in form.items" :key="index" class="d-flex align-center mb-2">
                <v-text-field
                  v-model="item.name"
                  label="Item Name"
                  outlined
                  class="mr-2"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="item.link"
                  label="Item Link"
                  outlined
                  class="mr-2"
                  required
                ></v-text-field>
                <v-btn icon color="red" class="ml-2 align-self-center" @click="removeItem(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
              <v-btn color="primary" @click="addItem">Add Item</v-btn>
            </v-card-text>
          </v-card>

          <!-- Upload Image -->
          <v-card class="pa-3 mt-3">
            <v-card-title>Upload Cosplay Image</v-card-title>
            <v-card-text>
              <v-file-input
                v-model="form.image"
                label="Upload Cosplay Image"
                accept="image/*"
                outlined
              ></v-file-input>
            </v-card-text>
          </v-card>

          <!-- Description -->
          <v-textarea
            v-model="form.description"
            label="Description"
            outlined
            rows="4"
          ></v-textarea>

          <!-- Submit Button -->
          <v-btn color="success" class="mt-4" @click="submitForm">Submit</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

      <div class="notificationContainer">
      <v-slide-y-transition group>
        <v-alert
          v-for="(notification, index) in notifications"
          :key="index"
          theme="dark"
          type="success"
        >
          {{ notification.message }}
        </v-alert>
      </v-slide-y-transition>
    </div>

  </v-container>
</template>
<script>import '@aws-amplify/ui-vue/styles.css';

import defineComponent from './cosplaysubmit.js';

export default {
  ...defineComponent,
};
</script>

<style>
.v-card {
  max-width: 600px;
  margin: auto;
}
.notificationContainer {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-gap: 0.5em;
  z-index: 99;
}

.v-card .pa-3 {
  padding: 16px;
}
</style>