import axios from "axios";
// const BASE_URL = "https://space-buddies-nft-engine.herokuapp.com";
const BASE_URL = "http://192.168.86.33:4000";

const engine = {
  setup: async (values) => {
    const response = await axios.post(`${BASE_URL}/setup`, values);
    return response.data.collectionId;
  },
  uploadFiles: async (data) => {
    const response = await axios.post(`${BASE_URL}/upload-files`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.collectionId;
  },
  generate: async (collectionId) => {
    const response = await axios.get(`${BASE_URL}/generate/${collectionId}`, {
      responseType: "arraybuffer",
    });
    const blob = new Blob([response.data], { type: "application/zip" });
    return blob;
  },
};

export default engine;
