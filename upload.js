const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Header
const API_KEY = "API_KEY"; // (required)

// Body
const folder_id = null; // (optional) | obs: The folder you wanna put your video
const video_id = uuidv4(); // (optional) | obs: You can put an especific uuid for your video, or let it generate one.
const title = "video name"; // (optional) | obs: title is your video name
const description = "video description"; // (optional)
const url = "https://.."; // (required) | obs: url is an external video url

const uploadVideo = async () => {
  try {
    const data = {
      folder_id,
      video_id,
      title,
      description,
      url,
    };

    const response = await axios.post(
      "https://import.pandavideo.com:9443/videos",
      data,
      {
        headers: {
          authorization: API_KEY,
        },
      }
    );

    console.log(
      "UPLOAD IN PROGRESS, you can check upload status in:",
      response.data.websocket_url
    );
  } catch (error) {
    console.log("UPLOAD ERROR:", error.response.data);
  }
};

uploadVideo();
