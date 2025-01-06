
import { getPresignedUrl } from '../../shared';
async function classifyHuman(rekognitionResponse) { 
    const human = {}
    human.ageRange = rekognitionResponse.FaceDetails[0].AgeRange;
    // Example Output: { Low: 15, High: 25 }
    human.gender = rekognitionResponse.FaceDetails[0].Gender.Value;
    // Example Output: "Male"
    human.emotions = rekognitionResponse.FaceDetails[0].Emotions
      .sort((a, b) => b.Confidence - a.Confidence) // Sort by confidence
      .slice(0, 2) // Top 2 emotions
      .map(emotion => emotion.Type);
    // Example Output: ["HAPPY", "DETERMINED"]
    human.eyewear = rekognitionResponse.FaceDetails[0].Eyeglasses.Value;
    // Example Output: false
    human.facialHair = rekognitionResponse.FaceDetails[0].Beard.Value || rekognitionResponse.FaceDetails[0].Mustache.Value
      ? "Yes"
      : "None";
    // Example Output: "None"
    human.pose = rekognitionResponse.FaceDetails[0].Pose;
    human.isDynamic = human.pose.Yaw > 10 || human.pose.Pitch > 10 ? "Dynamic" : "Neutral";
    // Example Output: "Dynamic"
    human.brightness = rekognitionResponse.FaceDetails[0].Quality.Brightness;
    human.brightnessPreference = human.brightness > 80 ? [80, 100] : [60, 80];
    // Example Output: [80, 100]
    return human;
}
function getFaceShape(landmarks) {
    const chinBottom = landmarks.find(l => l.Type === "chinBottom");
    const eyeLeft = landmarks.find(l => l.Type === "eyeLeft");
    const eyeRight = landmarks.find(l => l.Type === "eyeRight");
  
    const faceWidth = eyeRight.X - eyeLeft.X;
    const faceHeight = chinBottom.Y - eyeLeft.Y;
  
    if (faceHeight / faceWidth > 1.5) return "Oval";
    if (faceHeight / faceWidth < 1.3) return "Round";
    return "Square";
  }
  

async function returnImageData(presignedUrl) {
  const  cvInstance = await cv;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Allow cross-origin image fetching
    img.src = presignedUrl;

    img.onload = () => {
      try {
        const canvas = document.getElementById("canvasOutput");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        console.log("img", img);
        console.log("canvas", canvas);

        ctx.drawImage(img, 0, 0);

        console.log("cv",  cv)
        const src = cvInstance.imread(canvas); // Load the image into OpenCV.js
        const imgWidth = img.width;
        const imgHeight = img.height;
        
        resolve({ src, imgWidth, imgHeight, ctx }); // Resolve with required data
      } catch (error) {
        reject(new Error("Failed to process image: " + error.message));
      }
    };

    img.onerror = (err) => {
      reject(new Error("Failed to load image: " + err.message));
    };
  });
}
function drawRegion(ctx, x, y, width, height, color = "red") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}

function getHairRegion(ctx, imgWidth, imgHeight, landmarks) {
  // Landmarks for eyebrows
  const leftBrow = landmarks.find(l => l.Type === "leftEyeBrowLeft");
  const rightBrow = landmarks.find(l => l.Type === "rightEyeBrowRight");

  // Define a region above the eyebrows for hair
  const top = Math.min(leftBrow.Y, rightBrow.Y) * imgHeight - 80; // Extend upwards
  const bottom = Math.min(leftBrow.Y, rightBrow.Y) * imgHeight - 20; // Just above eyebrows
  const left = Math.min(leftBrow.X, rightBrow.X) * imgWidth - 20; // Slightly wider
  const right = Math.max(leftBrow.X, rightBrow.X) * imgWidth + 20;

  // Visualize the region
  drawRegion(ctx, left, top, right - left, bottom - top, "blue");

  // Return the image data for the adjusted region
  return ctx.getImageData(left, top, right - left, bottom - top);
}

export async function process_reko(jsonData, imagePath) {

  try {
     
    
      let human = classifyHuman(jsonData); // Pass data to another function
      console.log("human", human)
      let face_shape = getFaceShape(jsonData.FaceDetails[0].Landmarks);
      console.log("face shape", face_shape)
      let image  = await getPresignedUrl(imagePath);
      console.log("presigne durl", image)
      let imageData = await returnImageData(image);
      const { src, imgWidth, imgHeight, ctx } = await returnImageData(image);
      console.log("image data", jsonData)
    } catch (err) {
      console.error('Failed to process the JSON file:', err);
  }

}


