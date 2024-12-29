export const sharedMethods = {
    greetGlobal() {
      console.log("Hello from a shared method!");
    },
  };
  
  export const sharedData = {
    sharedMessage: "This is shared data.",
  };
  
  export const fetchAllPaginatedData = async (client, modelName, filter = {}) => {
    let allData = [];
    let nextToken = null;
  
    do {
      const result = await client.models[modelName].list({
        filter: filter,
        nextToken: nextToken // Pass the token for pagination
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