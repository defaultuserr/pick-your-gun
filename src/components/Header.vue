<template>
  <header class="header">
    <h1 @click="goHome">Firearm Recommendations</h1>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/category/movies">Movies</router-link></li>
        <li><router-link to="/category/videogames">Video Games</router-link></li>
        <li><router-link to="/category/hunting">Hunting</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style>
.header {
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header h1 {
  cursor: pointer;
}
.header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}
.header li {
  margin-right: 15px;
}
.header a {
  color: white;
  text-decoration: none;
}
</style>
