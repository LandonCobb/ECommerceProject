import axios from "axios";
import * as T from "../types";

export const createCart = async (): Promise<T.Cart | null> => {
  try {
    const response = await axios.post("/cart/cart");
    return response.data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addToCart = async (
  cartId: string,
  itemId: string
): Promise<T.Cart | null> => {
  try {
    const response = await axios.put(`/cart/cart/${cartId}/${itemId}`);
    return response.data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const removedFromCart = async (
  cartId: string,
  itemId: string
): Promise<T.Cart | null> => {
  try {
    const response = await axios.delete(`/cart/cart/${cartId}/${itemId}`);
    return response.data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
