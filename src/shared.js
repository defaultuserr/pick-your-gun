import { getUrl } from 'aws-amplify/storage';

export const sharedMethods = {
    greetGlobal() {
      console.log("Hello from a shared method!");
    },
  };
  
  export const sharedData = {
    sharedMessage: "This is shared data.",
  };
  export async function mediaExists   (client, title)  {
    const movies = await fetchAllPaginatedData(client, 'Media', { title: { eq: title } });
    console.log("in den movies")
    console.log(movies)
    console.log(title)
    console.log(movies.length > 0)
    return movies.length > 0;
  };

// Function to fetch JSON data from a URL
async function fetchJSON(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching JSON from ${filePath}:`, error);
    return null;
  }
}

// Function to generate a random username
export async function generateRandomUsername() {
  try {
    // Update the paths to point to your public folder or server endpoints
    const adjectivesPath = '../random_name/funny_adjectives.json';
    const scientistsPath = '../random_name/scientists.json';

    // Fetch adjectives and scientists
    const adjectivesData = await fetchJSON(adjectivesPath);
    const scientistsData = await fetchJSON(scientistsPath);

    if (!adjectivesData || !scientistsData) {
      return 'Default_User'; // Fallback username
    }

    const adjectives = adjectivesData.adjectives;
    const scientists = scientistsData.scientists;

    // Pick random elements
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomScientist = scientists[Math.floor(Math.random() * scientists.length)];

    // Combine into a username
    return `${randomAdjective}_${randomScientist}`;
  } catch (error) {
    console.error('Error generating random username:', error);
    return 'Default_User'; // Fallback username
  }
}





  export const fetchAllPaginatedData = async (client, modelName, filter = {}) => {
    let allData = [];
    let nextToken = null;
  
    do {
      const result = await client.models[modelName].list({
        filter: filter,
        nextToken: nextToken, // Pass the token for pagination
        
      });
  
      if (result.errors) {
        console.error(`Error fetching data for model ${modelName}:`, result.errors);
        break; // Exit loop on error
      }
  
      if (result.data && result.data.length > 0) {
        allData = [...allData, ...result.data]; // Accumulate the fetched data
      }
  
      nextToken = result.nextToken; // Update the token for the next iteration
    } while (nextToken); // Continue until nextToken is null
  
    return allData;
  };

  export const getPresignedUrl = async (file_path) => {
    console.log("file_path", file_path)
  const linkToStorageFile = await getUrl({
    path: file_path,
    // Alternatively, path: ({identityId}) => `album/{identityId}/1.jpg`
  });
  
  return linkToStorageFile.url.href;
}