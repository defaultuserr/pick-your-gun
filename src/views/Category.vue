<template>
  <div>
    <h2>{{ categoryName }}</h2>
    <GunList :guns="guns" />
  </div>
</template>

<script>
import GunList from "../components/GunList.vue";

export default {
  components: { GunList },
  data() {
    return {
      categoryName: "Category Name", // This would normally be fetched
      guns: [
        { id: "1", name: "Glock 17", description: "A reliable handgun.", price: "$500" },
        { id: "2", name: "AR-15", description: "Versatile and customizable.", price: "$1000" },
      ],
    };
  },
};
</script>
