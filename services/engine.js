import axios from "axios";
const BASE_URL = "https://space-buddies-nft-engine.herokuapp.com";

const engine = {
  setup: async (values) => {
    try {
      const response = await axios.post(`${BASE_URL}/setup`, values);
      return response.data.collectionId;
    } catch (error) {
      console.log(error);
    }
  },
  uploadFiles: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/upload-files`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.collectionId;
    } catch (error) {
      console.log(error);
    }
  },
  generate: async (collectionId) => {
    try {
      await axios.post(`${BASE_URL}/generate`, {
        collectionId,
      });
    } catch (error) {
      console.log(error);
    }
  },
};

export default engine;
