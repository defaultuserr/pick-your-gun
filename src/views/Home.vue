<template>
  <div>
    <h2>Choose a Category</h2>
    <div class="categories">
      <CategoryCard v-for="category in categories" :key="category.id" :category="category" />
    </div>
  </div>
</template>

<script>
import CategoryCard from "../components/CategoryCard.vue";

export default {
  components: { CategoryCard },
  data() {
    return {
      categories: [
        { id: "movies", name: "Movies", description: "Guns from famous movies" },
        { id: "videogames", name: "Video Games", description: "Weapons from iconic games" },
        { id: "hunting", name: "Hunting", description: "Best firearms for hunting" },
      ],
    };
  },
};
</script>

<style>
.categories {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  padding: 20px;
}
</style>
