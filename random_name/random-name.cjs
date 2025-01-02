const fs = require('fs');

// File paths
const adjectivesFilePath = './funny_adjectives.json';
const scientistsFilePath = './scientists.json';

// Function to generate a random username
function generateRandomUsername() {
  try {
    // Read and parse the adjectives file
    const adjectivesData = JSON.parse(fs.readFileSync(adjectivesFilePath, 'utf-8'));
    const adjectives = adjectivesData.adjectives;

    // Read and parse the scientists file
    const scientistsData = JSON.parse(fs.readFileSync(scientistsFilePath, 'utf-8'));
    const scientists = scientistsData.scientists;

    // Select a random adjective and scientist
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomScientist = scientists[Math.floor(Math.random() * scientists.length)];

    // Return the combined string
    return `${randomAdjective}_${randomScientist}`;
  } catch (error) {
    console.error('Error generating username:', error);
    return null;
  }
}

// Example usage
console.log(generateRandomUsername());
