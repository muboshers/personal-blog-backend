import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const TextToVoice = async (text) => {
  try {
    const response = await axios.post(
      "https://studio.mohir.ai/api/v1/tts",
      { text: text, model: "dilfuza" },
      {
        headers: {
          Authorization: process.env.MOHIR_AI_KEY,
        },
      }
    );
    return response.data?.result?.url;
  } catch (error) {
    console.log("MOHIR AI error ", error.message);
  }
};
