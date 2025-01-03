<template>
  <v-container class="user-profile" fluid>
    <authenticator :sign-up-attributes="['nickname']" :social-providers="['google']">
      <template v-slot="{ user, signOut }">
        <div class="user-profile">
          <!-- Conditionally display content based on loading state -->
          <div v-if="isLoading" class="loading-container">
            <v-progress-circular
              indeterminate
              color="primary"
              size="70"
              width="7"
            ></v-progress-circular>
            <p class="loading-text">Loading your profile...</p>
          </div>
          <div v-else>
            <!-- Edit box for changing the username -->
            <div class="edit-username">
              <v-row justify="center">
                <v-col cols="12" md="6">
                  <h1 class="text-center">Hello, {{ newUsername }}!</h1>

                  <v-text-field
                    label="Nickname others users see"
                    v-model="newUsername"
                    outlined
                    :rules="[rules.required]"
                    :error="!newUsername.trim() && isError"
                  ></v-text-field>

                  <v-btn
                    class="mt-4"
                    color="primary"
                    block
                    :disabled="!newUsername.trim()" 
                    @click="updateUsername"
                  >
                    Update Username
                  </v-btn>
                  <v-btn class="mt-4" color="error" block @click="signOut">
                    Sign Out
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
      </template>
    </authenticator>

    <v-snackbar v-model="snackbarVisible" :color="isError ? 'red' : 'green'" top>
      {{ feedbackMessage }}
      <template #actions>
        <v-btn text @click="snackbarVisible = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>



<script>import '@aws-amplify/ui-vue/styles.css';

import defineComponent from './signin.js';

export default {
  ...defineComponent,
};
</script>


<style scoped>
.user-profile {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
}

h1 {
  margin-bottom: 20px;
}

.edit-username {
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  padding: 8px;
  font-size: 16px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
}

button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.message {
  margin-top: 10px;
  font-weight: bold;
  color: green;
}

.user-profile {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-text {
  margin-top: 15px;
  font-size: 18px;
  color: #555;
}

.edit-username {
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  padding: 8px;
  font-size: 16px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
}

button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.message {
  margin-top: 10px;
  font-weight: bold;
  color: green;
}
</style>