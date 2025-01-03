import { generateRandomUsername} from '../../shared.js';
import { defineComponent, ref } from 'vue';
import { fetchUserAttributes, updateUserAttribute } from 'aws-amplify/auth';
import { VTextField, VContainer, VRow, VCol, VSnackbar, VBtn, VProgressCircular  } from 'vuetify/components';
export default  defineComponent({
  props: {
    username: String,
    isLoggedIn: Boolean,
  },
  emits: ['update-user'],
  components: {
    VBtn,
    VTextField,
    VContainer,
    VRow,
    VCol,
    VSnackbar,
    VProgressCircular 
  },
  setup (props,  { emit }) {
    const newUsername = ref('');
    const feedbackMessage = ref('');
    const snackbarVisible = ref(false); // Snackbar visibility
    const isError = ref(false);
    const isLoading = ref(true);
    const signOutUser = async () => { 
      await signOut();
      emit('update-user', { username:"" || "", isLoggedIn: false });


    const updateUsername = async () => {
      if (!rules.required(newUsername.value)) {
        feedbackMessage.value = "The username field cannot be empty. Please enter a valid username.";
        isError.value = true;
        return;
      }
      
      try {
        const output = await updateUserAttribute({
          userAttribute: {
            attributeKey: "nickname",
            value: newUsername.value,
          },
        });
        if (output.isUpdated) {
          feedbackMessage.value = `Your nickname was successfully updated to "${newUsername.value}". 🎉`;
          isError.value = false;
          snackbarVisible.value = true;
          emit('update-user', { username: newUsername.value, isLoggedIn: true });
        } else {
          feedbackMessage.value = 'Failed to update nickname. Please try again.';
          isError.value = true;
          snackbarVisible.value = true;

          
        }
        console.log("Update result:", output);
      } catch (error) {
        console.error('Error updating nickname:', error);
        feedbackMessage.value = 'An unexpected error occurred. Please try again.';
        isError.value = true;
        snackbarVisible.value = true; 
      }
    };


    const rules = {
      required: (value) => !!value.trim() || 'This field is required.',
    };

    const loadUserData = async () => {
      try {
        const user_attr = await fetchUserAttributes();
        if (user_attr.nickname) {
          newUsername.value = user_attr.nickname;
        } else {
          newUsername.value =  await generateRandomUsername();

          updateUsername(newUsername);
        }
        
       // Emit the loaded user data to the parent
       emit('update-user', { username: newUsername.value, isLoggedIn: true });
      }
       catch (error) {
        console.error('Error fetching user attributes:', error);
        emit('update-user', { username: '', isLoggedIn: false }); // Notify parent if no user data
      } finally {
        console.log("User data loaded successfully.")
        isLoading.value = false; // Set loading to false once data fetching is complete
      }
    };


    loadUserData();


    return {
      rules,
      updateUsername, 
      snackbarVisible,
      feedbackMessage,
      isError,
      newUsername,
      isLoading,
      signOutUser
   
    }
  },
 
 
 

});