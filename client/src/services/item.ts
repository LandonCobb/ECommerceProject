import axios from "axios";
import * as T from "../types";

export const getAllItems = async (): Promise<T.Item[]> => {
  try {
    const response = await axios.get("/item/items");
    return response.data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
