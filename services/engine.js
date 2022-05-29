import axios from "axios";
const BASE_URL = "https://space-buddies-nft-engine.herokuapp.com";
// const BASE_URL = "http://192.168.0.112:4000";

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
      const response = await axios.get(`${BASE_URL}/generate/${collectionId}`, {
        responseType: "arraybuffer",
      });
      const blob = new Blob([response.data], { type: "application/zip" });
      return blob;
    } catch (error) {
      console.log(error);
    }
  },
};

export default engine;
