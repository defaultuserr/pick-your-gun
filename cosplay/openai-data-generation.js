// index.js

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
// Recreate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the placeholder image
// Use a hosted image URL or a data URI since Node.js doesn't handle image imports directly

/**
 * Builds the prompt for the OpenAI API.
 * @returns {string} The prompt string.
 */
function buildPrompt() {
    const prompt = `Generate detailed cosplay recommendations for one media in the following JSON format. Identify popular movies, games, and series automatically from well-known franchises or trending media in the genres **Fantasy**, **Adventure**, **Science Fiction**, and **Action**. For each medium, include the following details:

    - **Characters**: 1 characters per medium.
      - **Character Name**
      - **Difficulty Level**: 'Easy', 'Medium', 'Hard', or 'Expert'
      - **Key Items**: Approximately 8 detailed and specific items for each character, each containing:
        - **Item Name**
        - **Affiliate Link**: URL to purchase or learn more about the item
        - **Image URL**: URL of the item's image
      - **Overall Image URL**: URL of the character's image
    
    **JSON Format:**
    {
      "media": [
        {
          "type": "string", // e.g., 'movie', 'game', or 'series'
          "title": "string", // e.g., 'Harry Potter and the Philosopher's Stone'
          "genre": ["string", "string"], // e.g., ["Fantasy", "Adventure"]
          "release_year": "integer", // e.g., 2001
          "cosplay_recommendations": [
            {
              "character": "string", // Character's name
              "difficulty": "string", // 'Easy', 'Medium', 'Hard', or 'Expert'
              "key_items": [
                {
                  "item": "string", // e.g., 'Sword'
                  "affiliate_link": "string", // URL
                  "image_url": "string" // URL
                }
              ],
              "image_url": "string" // Character image URL
            }
          ]
        }
      ]
    }
    
    **Instructions:**
    - Generate **only** the data in the above JSON format.
    - Do **not** include any additional explanations, comments, or text outside the JSON structure.
    -  URLs (**affiliate links** and **image URLs**) should be placeholders like example.com`;
    
    return prompt
}

/**
 * Sends the prompt to OpenAI's ChatCompletion API.
 * @param {string} prompt - The prompt to send.
 * @returns {Promise<string|null>} The response content or null if an error occurred.
 */
async function sendPromptToChatGPT(prompt) {
    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          });

    
        const response = await client.chat.completions.create({
            messages: [{ role: "system", content: "You are an assistant that generates cosplay data in JSON format." }, { role: "user", content: prompt }],
            model: 'gpt-4', 
            max_tokens: 3000, 
            stop : ["\n\n"]
          });
        console.log(response.choices[0].message)

        return response.choices[0].message.content.trim();
    } catch (error) {
        if (error.response) {
            console.error(`OpenAI API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`OpenAI API Error: ${error.message}`);
        }
        return null;
    }
}

/**
 * Validates the cosplay data structure.
 * @param {object} data - The JSON data to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateData(data) {
    const requiredKeys = new Set(["type", "title", "genre", "release_year", "cosplay_recommendations"]);
    const recommendationKeys = new Set(["character", "difficulty", "key_items", "image_url"]);
    const itemKeys = new Set(["item", "affiliate_link", "image_url"]);

    if (!data.media || !Array.isArray(data.media)) {
        console.error("Validation Error: 'media' field is missing or not an array.");
        return false;
    }

    for (const media of data.media) {
        // Check if 'media' is a valid object
        if (typeof media !== 'object' || media === null) {
            console.error("Validation Error: Each media item should be a valid object.");
            return false;
        }

        // Convert 'requiredKeys' Set to an array for processing
        const requiredKeysArray = Array.isArray(requiredKeys) ? requiredKeys : [...requiredKeys];

        // Identify missing keys in 'media'
        const missingMediaKeys = requiredKeysArray.filter(key => !Object.prototype.hasOwnProperty.call(media, key));

        if (missingMediaKeys.length > 0) {
            console.error(`Validation Error: Missing keys in media item: ${missingMediaKeys.join(", ")}`);
            return false;
        }

        if (!Array.isArray(media.cosplay_recommendations)) {
            console.error("Validation Error: 'cosplay_recommendations' should be an array.");
            return false;
        }

        for (const recommendation of media.cosplay_recommendations) {
            // Check if 'recommendation' is a valid object
            if (typeof recommendation !== 'object' || recommendation === null) {
                console.error("Validation Error: Each cosplay recommendation should be a valid object.");
                return false;
            }

            // Convert 'recommendationKeys' Set to an array
            const recommendationKeysArray = Array.isArray(recommendationKeys) ? recommendationKeys : [...recommendationKeys];

            // Identify missing keys in 'recommendation'
            const missingRecommendationKeys = recommendationKeysArray.filter(key => !Object.prototype.hasOwnProperty.call(recommendation, key));

            if (missingRecommendationKeys.length > 0) {
                console.error(`Validation Error: Missing keys in cosplay recommendation: ${missingRecommendationKeys.join(", ")}`);
                return false;
            }

            if (!Array.isArray(recommendation.key_items)) {
                console.error("Validation Error: 'key_items' should be an array.");
                return false;
            }

            for (const item of recommendation.key_items) {
                // Check if 'item' is a valid object
                if (typeof item !== 'object' || item === null) {
                    console.error("Validation Error: Each key item should be a valid object.");
                    return false;
                }

                // Convert 'itemKeys' Set to an array
                const itemKeysArray = Array.isArray(itemKeys) ? itemKeys : [...itemKeys];

                // Identify missing keys in 'item'
                const missingItemKeys = itemKeysArray.filter(key => !Object.prototype.hasOwnProperty.call(item, key));

                if (missingItemKeys.length > 0) {
                    console.error(`Validation Error: Missing keys in key item: ${missingItemKeys.join(", ")}`);
                    return false;
                }
            }
        }
    }

    return true;
}
/**
 * Main function to execute the script.
 */
async function main() {
    const prompt = buildPrompt();
    //console.log(`Sending prompt to OpenAI:\n${prompt}\n`);

    const response = await sendPromptToChatGPT(prompt);
    
    if (response) {
        try {
            const responseData = JSON.parse(response);

            if (validateData(responseData)) {
                const outputPath = path.join(__dirname, "cosplay_data_generated.json");
                await fs.writeFile(outputPath, JSON.stringify(responseData, null, 4), 'utf-8');
                console.log("Data successfully saved to cosplay_data_generated.json");
            } else {
                console.error("Validation failed. Saving raw response to failed_response.txt");
                const failedPath = path.join(__dirname, "failed_response.txt");
                await fs.writeFile(failedPath, response, 'utf-8');
            }
        } catch (error) {
            console.error("Failed to parse response as JSON. Saving raw response to failed_response.txt");
            console.error(error.message);

            const failedPath = path.join(__dirname, "failed_response.txt");
            await fs.writeFile(failedPath, response, 'utf-8');
        }
    } else {
        console.error("No response received from OpenAI API.");
    }
}

// Execute the main function
main();
