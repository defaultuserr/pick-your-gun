
import { defineComponent } from 'vue';
import {VAutocomplete,VFileInput,VCard, VCardText,VForm,  VTextarea, VIcon, VCombobox, VSelect, VCardTitle, VTextField, VContainer, VRow, VCol, VSnackbar, VBtn, VProgressCircular  } from 'vuetify/components';
import { fetchAllPaginatedData } from '../../shared.js';
import { generateClient } from 'aws-amplify/data';
export default defineComponent({
    components: {
        VAutocomplete,
        VFileInput,
        VTextarea,
        VCard,
        VCardText,
        VCombobox,
        VForm,
        VIcon,
        VSelect,
        VBtn,
        VCardTitle,
        VTextField,
        VContainer,
        VRow,
        VCol,
        VSnackbar,
        VProgressCircular 
      },
    
    data() {
      return {
        form: {
          characterName: "",
          mediaType: "",
          mediaTitle: "",
          difficulty: "",
          items: [
            { name: "", link: "" }
          ],
          image: null,
          description: ""
        },
        mediaTypes: ["Manga", "Movie", "Video Game", "Other"],
        mediaTitles: ["Naruto", "One Piece", "Final Fantasy", "Harry Potter"], // Replace with backend data
        difficultyLevels: ["Easy", "Medium", "Hard"]
      };
    },
    methods: {
        async fetchMediaTitles() {
            const client = generateClient();
            try {
              // Replace this URL with your backend endpoint
              let media  = await fetchAllPaginatedData(client, 'Media');
              console.log(media);
           
            
              this.mediaTitles = media; // Assuming the API returns an object with a `titles` array
            } catch (error) {
              console.error('Error fetching media titles:', error);
            }
          }
,          
      addItem() {
        this.form.items.push({ name: "", link: "" });
      },
      removeItem(index) {
        this.form.items.splice(index, 1);
      },
      submitForm() {
        console.log("Form submitted", this.form);
        // Add your form submission logic here, e.g., send data to backend
      }
    },
    created() {
        this.fetchMediaTitles();
      }
  });