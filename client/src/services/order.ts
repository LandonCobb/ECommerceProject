import axios from "axios"
import * as T from "../types"

export const placeOrder = async (cartId: string, userId: string): Promise<T.Order | null> => {
    try {
        const token = localStorage.getItem("@token")
        const response = await axios.post("/order/order", JSON.stringify({ cart: cartId, user: userId }), { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
        return response.data || null;
    } catch (error) {
        console.log(error)
        return null;   
    }
}