<template>
  <authenticator :sign-up-attributes="['nickname']" :social-providers="['google']">
    <template v-slot="{ user, signOut }">
      <div class="user-profile">
        <!-- Display current username -->
        <h1>Hello {{ user.username || 'User' }}!</h1>

        <!-- Edit box for changing the username -->
        <div class="edit-username">
          <label for="username">Edit Username:</label>
          <input
            id="username"
            type="text"
            v-model="newUsername"
            :placeholder=user.username
          />
          <button @click="updateUsername">Update Username</button>
        </div>

        <!-- Confirmation message -->
        <p v-if="message" class="message">{{ message }}</p>

        <!-- Sign out button -->
        <button @click="signOut">Sign Out</button>
      </div>
    </template>
  </authenticator>
</template>

<script>import '@aws-amplify/ui-vue/styles.css';
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
</style>