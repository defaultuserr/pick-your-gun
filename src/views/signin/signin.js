import { generateRandomUsername} from '../../shared.js';
import { defineComponent, ref } from 'vue';
import { fetchUserAttributes, updateUserAttribute } from 'aws-amplify/auth';
import { VTextField, VContainer, VRow, VCol, VSnackbar, VBtn } from 'vuetify/components';
export default  defineComponent({
  components: {
    VBtn,
    VTextField,
    VContainer,
    VRow,
    VCol,
    VSnackbar,
  },
  setup () {
    const newUsername = ref('');
    const feedbackMessage = ref('');
    const snackbarVisible = ref(false); // Snackbar visibility
    const isError = ref(false);
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
    return {
      rules,
      updateUsername, 
      snackbarVisible,
      feedbackMessage,
      isError,
      newUsername
   
    }
  },
 
  async mounted() {
    // Generate a random username when the site loads
    this.newUsername = await generateRandomUsername();
  },
 

});