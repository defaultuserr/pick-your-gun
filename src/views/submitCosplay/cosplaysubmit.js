
import { defineComponent } from 'vue';
import {VSlideYTransition,  VAutocomplete,VFileInput,VCard, VCardText,VForm,  VTextarea, VIcon, VCombobox, VSelect, VCardTitle, VTextField, VContainer, VRow, VCol, VSnackbar, VBtn, VProgressCircular, VAlert  } from 'vuetify/components';
import { fetchAllPaginatedData } from '../../shared.js';
import { generateClient } from 'aws-amplify/data';

import { uploadData } from "aws-amplify/storage";
export default defineComponent({
    components: {
VAlert,
        VSlideYTransition,
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
        difficultyLevels: ["Easy", "Medium", "Hard"],
        
        notifications : [],
        notification: {
            show: false,
            message: "",
            timeout: 3000
          }
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
      async submitForm() {
        let mediaId;
        const client = generateClient();
        console.log("Type of mediaTitle:", typeof this.form.mediaTitle);
  
        if (typeof this.form.mediaTitle === "string") {
          const { errors, data: newMedia } = await client.models.Media.create({
            type: this.form.mediaType,
            title: this.form.mediaTitle,
            genre: "default",
            genre_lowercase: "default",
            release_year: 1000,
          });
          if (newMedia) {
            mediaId = newMedia.id;
            this.addNotification(`Media ${newMedia.title} created successfully!`);
          } else {
            console.error(errors);
          }
        } else {
          mediaId = this.form.mediaTitle.id;
        }
     
        const fileReader = new FileReader();
        let  imagePath= ""
        fileReader.readAsArrayBuffer(this.form.image);
  
        fileReader.onload = async (event) => {
          try {
            
             imagePath = `images/users/${this.form.image.name}`;
            console.log("in the file reader")
            console.log(imagePath)
            await uploadData({
              data: event.target.result,
              path: imagePath,
            });
  
            this.$emit("success", "File uploaded successfully!")

                    //create character TODO make in another function
                        const { errors: characterErrors, data: newCharacter } = await client.models.CosplayRecommendation.create({
                    mediaId: mediaId,
                    character: this.form.characterName,
                    difficulty: this.form.difficulty,
                    key_items: this.form.items,
                    image_url: imagePath,
                    submittedBy: "Anonymous",
                });
                if (newCharacter) {
                    this.addNotification(`Character ${newCharacter.character} created successfully!`);
                } else {
                    console.error(characterErrors);
                }

          } catch (error) {
            console.error("Error uploading file:", error);
            this.$emit("error", "Failed to upload the file.");
          }
        };

        fileReader.onerror = () => {
            console.error("Error reading file.");
            this.$emit("error", "Failed to read the file.");
          };
 
   

        console.log("Form submitted", this.form);
        // Add your form submission logic here, e.g., send data to backend
    },
        addNotification(message) {
            const notification = { message };
            this.notifications.push(notification);
            setTimeout(() => {
              const index = this.notifications.indexOf(notification);
              if (index !== -1) {
                this.notifications.splice(index, 1);
              }
            }, 2000);
          }
        
    
    },
    created() {
        this.fetchMediaTitles();
      }
  });