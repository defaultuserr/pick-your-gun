<template>
  <div id="app">
    <nav>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/movies" class="nav-link">Movies/Series</router-link>
      </div>
      <div class="auth-section">
        <template v-if="isLoading">
          <span>Loading...</span>
        </template>
        <template v-else-if="isLoggedIn">
          Welcome, <span class="nickname">{{ username }}</span>!
        </template>
        <template v-else>
          <button class="sign-in-btn" @click="redirectToSignIn">Sign In</button>
        </template>
      </div>
    </nav>

    <div class="content">
      <router-view @update-user="handleUserUpdate"></router-view>
    </div>
  </div>
</template>

<script>
import defineComponent from './app.js';

export default {
  ...defineComponent,
};
</script>

<style>
/* Global styles for the entire app */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  color: #333;
  line-height: 1.6;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  background-color: #333;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
}

.nav-link {
  color: white;
  text-decoration: none;
  margin: 0 15px;
  font-size: 18px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #f39c12;
}

.auth-section {
  color: white;
  font-size: 18px;
}

.nickname {
  font-weight: bold;
  color: #f39c12;
}

.sign-in-btn {
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sign-in-btn:hover {
  background-color: #d35400;
}

.content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
