import { getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'vue-router';


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
    };
  },
  async created() {

    
    try {
      console.log("Checking user login state...");
      let user;
      try {
       user = await getCurrentUser();} 
       catch (error) {
        if (error.name ==  "UserUnAuthenticatedException") {
          console.log("User is not authenticated")
        }
    
      }

      console.log(user)
      console.log("start if")
      if (user && user.username) {
        this.isLoggedIn = true;
        this.username = user.username;
      } else {
        console.log("No user is signed in.");
        this.isLoggedIn = false;
      }
    } catch (error) {
      console.error("Error checking user login state:", error);
      this.isLoggedIn = false;
    }
  },
  methods: {
    signIn() {
        if(this.isLoggedIn = true) {
            console.log("user is logged in")
        }else {
          console.log("user is not logged in")
        }

      // Redirect to the sign-in page or handle sign-in logic
      console.log("Redirecting to sign-in page...");
    },
  },
};