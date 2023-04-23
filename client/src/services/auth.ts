import axios from "axios"
import * as T from "../types"

export const login = async (username: string, password: string): Promise<T.AuthToken | null> => {
    try {
        const response = await axios.post("/auth/login", JSON.stringify({username, password}), {headers: {"Content-Type": "application/json"}})
        return response.data || null
    } catch (error) {
        console.log(error)
        return null
    }
} 

export const validateAuthState = async (): Promise<boolean> => {
    try {
        const token = localStorage.getItem("@token")
        if (!token) return false
        await axios.get("/auth/validate", { headers: { Authorization: `Bearer ${token}` } })
        return true
    } catch (error) {
     console.log(error)
     return false   
    }
}

export const validatedUser = async (): Promise<T.User | null> => {
    try {
        const token = localStorage.getItem("@token")
        if (!token) return null
        const response = await axios.get("/auth/validate", { headers: { Authorization: `Bearer ${token}` } })
        return response.data || null
    } catch (error) {
     console.log(error)
     return null
    }
}

export const register = async (username: string, password: string): Promise<T.User | null> => {
    try {
        const response = await axios.post("/auth/register", JSON.stringify({username, password}), {headers: {"Content-Type": "application/json"}})
        return response.data || null;
    } catch (error) {
        console.log(error)
        return null;
    }
}