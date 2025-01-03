import { getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'vue-router';
import { fetchUserAttributes } from 'aws-amplify/auth';

export default {
  name: 'App',
  setup() {
    const router = useRouter();

    const redirectToSignIn = () => {
      router.push('/sign-in');
    };

    return {
      redirectToSignIn,
    };
  },

  data() {
    return {
      isLoggedIn: false,
      username: "",
      isLoading: true,
    };
  },

  async created() {
    this.isLoading = true;

    try {
      console.log("Checking user login state...");
      let user;
      try {
        user = await getCurrentUser();
      } catch (error) {
        if (error.name === "UserUnAuthenticatedException") {
          console.log("User is not authenticated");
        }
      }
      const user_attr = await fetchUserAttributes();
      if (user) {
        this.isLoggedIn = true;
      } else {
        console.log("No user is signed in.");
        this.isLoggedIn = false;
        return;
      }

      if (user_attr.nickname) {
        this.username = user_attr.nickname;
      } else {
        this.username = user.username;
      }
    } catch (error) {
      console.error("Error checking user login state:", error);
      this.isLoggedIn = false;
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    signIn() {
      if (this.isLoggedIn) {
        console.log("User is logged in");
      } else {
        console.log("User is not logged in");
      }

      console.log("Redirecting to sign-in page...");
    },

    handleUserUpdate({ username, isLoggedIn }) {
      // Update username and login state when emitted by child
      this.username = username;
      this.isLoggedIn = isLoggedIn;
    },
  },
};
