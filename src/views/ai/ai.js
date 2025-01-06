import { uploadData } from "aws-amplify/storage";
import { generateClient } from 'aws-amplify/data';
import {  process_reko} from  './classify-human.js';
export default {
    setup () {
        

    },
    mounted() {
        console.log("in mounted")
        cv['onRuntimeInitialized'] = () => {
            console.log("OpenCV.js is ready!");
            this.opencvReady = true;
          };
    },

    data() {
      return {
        uploadedImage: null,
        file: null,
        imagePath: "",
        opencvReady: false,
      };
    },
    methods: {
      handleFileUpload(event) {
        
        this.file = event.target.files[0];
        this.uploadedImage = URL.createObjectURL(this.file);
        const fileReader = new FileReader();
       
        fileReader.readAsArrayBuffer(this.file);
  
        fileReader.onload = async (event) => {
          try {
            
             this.imagePath = `images/users/${this.file.name}`;
            console.log("in the file reader")
            console.log(this.imagePath)
            await uploadData({
              data: event.target.result,
              path: this.imagePath,
            });
  
            this.$emit("success", "File uploaded successfully!")
      
      } catch (error) { console.error("Error uploading file:",  error);}
   }},
      async submitPhoto() {
        const client = generateClient()
        const formData = new FormData();
        formData.append("photo", this.file);
        const { data } = await client.queries.identifyText({
            path: this.imagePath, // File name
          });
        console.log("passing to classify human", this.imagePath)
        process_reko(JSON.parse(data), this.imagePath);
      },
    },
   
  };