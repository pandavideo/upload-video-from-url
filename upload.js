const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const WebSocket = require("ws");
const WebSocketAsPromised = require("websocket-as-promised");

// Header
const API_KEY = "API_KEY"; // (required)

// Body
const folder_id = null; // (optional) | obs: The folder you wanna put your video
const video_id = uuidv4(); // (optional) | obs: You can put an especific uuid for your video, or let it generate one.
const title = "video name"; // (optional) | obs: title is your video name
const description = "video description"; // (optional)
const url = "https://.."; // (required) | obs: url is an external video url

// This will console log all the video progress if (true)
const showVideoProgress = true;

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

    const websocket = response.data.websocket_url;

    if (!showVideoProgress) {
      console.log(
        "UPLOAD IN PROGRESS, you can check upload status in:",
        websocket
      );
    } else {
      const webSocketConnect = async (endpoint) => {
        return new Promise((resolve, reject) => {
          const wsp = new WebSocketAsPromised(endpoint, {
            createWebSocket: (url) => new WebSocket(url),
            extractMessageData: (event) => event,
          });
          wsp
            .open()
            .then(() => {
              wsp.onMessage.addListener((data) => {
                const obj = JSON.parse(data.toString("utf8"));
                console.log(
                  `Upload status: ${obj.action} ${
                    obj.action === "progress"
                      ? Math.floor(obj.payload.progress) + "%"
                      : ""
                  }`
                );
                if (obj.action === "success") {
                  resolve(true);
                  wsp.close();
                } else if (obj.action == "error") {
                  resolve(false);
                  wsp.close();
                }
              });
            })
            .catch((e) => {
              resolve(false);
            });
        });
      };

      webSocketConnect(websocket);
    }
  } catch (error) {
    console.log("UPLOAD ERROR:", error.response.data);
  }
};

uploadVideo();
