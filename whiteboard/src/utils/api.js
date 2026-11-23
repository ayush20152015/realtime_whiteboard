// utils/api.js
import axios from "axios";
import { API_URL } from "./config";

const API_BASE_URL = `${API_URL}/api/canvas`;

export const updateCanvas = async (canvasId, elements) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update`,
      { canvasId, elements },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("whiteboard_user_token")}`,
        },
      }
    );
    console.log("Canvas updated successfully in the database!", response.data);
    return response.data;
  } catch (error) {
    // console.error("Error updating canvas:", error);
  }
};

export const fetchInitialCanvasElements = async (canvasId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/load/${canvasId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("whiteboard_user_token")}`,
      },
    });
    return response.data.elements;
  } catch (error) {
    console.error("Error fetching initial canvas elements:", error);
  }
};
