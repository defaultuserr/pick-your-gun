<template>
  <footer class="footer">
    <p>&copy; {{ currentYear }} Firearm Recommendations. All rights reserved.</p>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
    </nav>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
});
</script>

<style>
.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 15px 10px;
  margin-top: 20px;
}
.footer ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  gap: 15px;
}
.footer li {
  margin: 0;
}
.footer a {
  color: white;
  text-decoration: none;
}
</style>
