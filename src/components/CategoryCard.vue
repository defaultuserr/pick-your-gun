<template>
  <div class="category-card" @click="goToCategory">
    <h3>{{ category.name }}</h3>
    <p>{{ category.description }}</p>
  </div>
</template>

<script>
export default {
  props: ["category"],
  methods: {
    goToCategory() {
      this.$router.push(`/category/${this.category.id}`);
    },
  },
};
</script>

<style>
.category-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.category-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
