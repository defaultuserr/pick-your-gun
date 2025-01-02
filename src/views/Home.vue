<template>
  <div class="landing-page">
    <!-- Existing Sections -->
    <section class="hero">
      <div class="hero-content">
        <h1>Share Your Cosplay. Inspire the Community. Earn Rewards!</h1>
        <p>Upload your amazing cosplay creations, share the products you used, and connect with fellow fans.</p>
        <div class="hero-buttons">
          <button @click="redirectToSignIn">Sign Up to Upload</button>
          <button @click="exploreCosplays">Explore Cosplays</button>
        </div>
      </div>
    </section>

    <!-- New Feature Section: Cosplay Recommendation -->
    <section class="cosplay-recommendation">
      <h2>Get a Cosplay Recommendation</h2>
      <p>Upload an image, and we'll recommend a cosplay that suits you!</p>
      <form @submit.prevent="getRecommendation">
        <input type="file" @change="handleFileUpload" />
        <button type="submit" :disabled="!imageFile">Get Recommendation</button>
      </form>
      <div v-if="recommendation" class="recommendation-result">
        <h3>Recommended Cosplay:</h3>
        <p>{{ recommendation }}</p>
      </div>
    </section>

    <!-- Existing Sections -->
    <footer class="footer">
      <p>ABOUT US | PRIVACY POLICY | CONTACT | SOCIAL MEDIA</p>
      <p>Subscribe to our newsletter for updates!</p>
    </footer>
  </div>
</template>

<script>
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
</script>

<style scoped>

/* Add some styles for the new section */
.cosplay-recommendation {
  margin: 20px 0;
  text-align: center;
}

.cosplay-recommendation form {
  margin-top: 10px;
}

.recommendation-result {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.landing-page {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  text-align: center;
  padding: 20px;
}

.hero {
  background-color: #f4f4f4;
  padding: 40px 20px;
  margin-bottom: 20px;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-buttons button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.features, .how-it-works, .community-spotlight {
  margin: 20px 0;
}

.features ul, .how-it-works ol {
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
}

.spotlight-placeholder {
  height: 200px;
  background-color: #eaeaea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  border: 1px dashed #ccc;
}

.footer {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
}

.close-modal {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 14px;
  background-color: #f44;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
