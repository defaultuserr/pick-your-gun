import { useRouter } from 'vue-router';

export default {
  name: 'LandingPage',
  data() {
    return {
      imageFile: null,
      recommendation: null,
    };
  },
  setup() {
    const router = useRouter();

    const redirectToSignIn = () => {
      router.push('/sign-in');
    };

    return {
      redirectToSignIn,
    };
  },
  methods: {
    exploreCosplays() {
      console.log('Redirecting to explore cosplays');
    },
    handleFileUpload(event) {
      this.imageFile = event.target.files[0];
    },
    async getRecommendation() {
      if (!this.imageFile) return;

      const formData = new FormData();
      formData.append('image', this.imageFile);

      try {
        const response = await fetch('/api/recommend-cosplay', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to get recommendation');

        const data = await response.json();
        this.recommendation = data.recommendation;
      } catch (error) {
        console.error('Error getting cosplay recommendation:', error);
      }
    },
  },
};