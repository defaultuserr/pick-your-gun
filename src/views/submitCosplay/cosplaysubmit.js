
import { defineComponent, ref } from 'vue';
import {VTextarea,VCardTitle,VFileInput,VCardText,VCard, VSelect, VTextField,VForm, VIcon, VContainer, VRow, VCol, VSnackbar, VBtn, VProgressCircular  } from 'vuetify/components';



export default defineComponent({
    components: {
        VBtn,
        VTextarea,
        VCardTitle,
        VTextField, 
        VFileInput,
        VContainer,
        VRow,
        VCardText,
        VCard,
      VSelect,
        VIcon,
        VCol,
        VForm,
        VSnackbar,
        VProgressCircular 
      },
    data() {
      return {
        formValid: false,
        form: {
          character: "",
          media_type: "",
          media_title: "",
          difficulty: "",
          item_links: [{ item_name: "", link: "" }],
          images: [],
          description: "",
        },
        mediaTypes: ["Video", "Game", "Manga", "Other"],
        difficultyLevels: ["Easy", "Medium", "Hard", "Expert"],
        rules: {
            required: (value) => !!value || "This field is required",
          }
      };
    },
    methods: {
      addItemLink() {
        this.form.item_links.push({ item_name: "", link: "" });
      },

      handleSubmit() {
        if (this.$refs.form.validate()) {
          // Form is valid, handle submission logic
          console.log("Form submitted successfully", this.form);
        } else {
          console.log("Form has validation errors");
        }
      },

      removeItemLink(index) {
        this.form.item_links.splice(index, 1);
      },
      async handleSubmit() {
        // Validate and prepare form data for submission
        const submissionData = {
          ...this.form,
          submissionDate: new Date().toISOString().split("T")[0], // AWSDate format
        };
  
        try {
          // Make an API call to submit the form
          await this.submitCosplay(submissionData);
          this.$refs.form.reset();
          this.resetForm();
          this.$emit("submission-success");
        } catch (error) {
          console.error("Error submitting cosplay:", error);
          this.$emit("submission-failure");
        }
      },
      async submitCosplay(data) {
        // Replace this with your API call logic
        console.log("Submitting cosplay:", data);
      },
      resetForm() {
        this.form = {
          character: "",
          media_type: "",
          media_title: "",
          difficulty: "",
          item_links: [{ item_name: "", link: "" }],
          images: [],
          description: "",
        };
      },
    },
  });