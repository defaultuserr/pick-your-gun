<template>
  <div id="app">
    <nav>
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/movies" class="nav-link">Movies</router-link>
      <router-link to="/video-games" class="nav-link">Video Games</router-link>
    </nav>
    <div class="content">
      <router-view></router-view> <!-- This is where the routed components will be displayed -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
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
  justify-content: center;
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

.content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
