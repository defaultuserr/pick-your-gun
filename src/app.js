export default {
    name: 'App',
    data() {
      return {
        selectedCategory: '', // Tracks the selected filter
      };
    },
    methods: {
      filterContent() {
        // This method could trigger navigation or emit events to child components
        console.log(`Filtering content by category: ${this.selectedCategory}`);
      },
    },
  };