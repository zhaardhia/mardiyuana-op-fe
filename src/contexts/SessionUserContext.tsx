import React, { useContext, useEffect, useReducer, ReactNode } from "react";
import { useRouter } from 'next/router'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

interface ContextValue {
  state: any;
  dispatch: any;
  refreshToken: any; 
  axiosJWT: any; 
  axiosBasic: any;
}

interface JwtPayload {
  username: string;
  iat: number;
  exp: number;
}
const SessionUserContext = React.createContext<ContextValue | undefined>(undefined);

function sessionUserReducer(state: any, action: { type: string; payload: any; }) {
  switch (action.type) {
    case "setToken": {
      return {
        ...state,
        token: action.payload
      }
    }
    case "setExpire": {
      return {
        ...state,
        expire: action.payload
      }
    }
    case "setUserInfo": {
      return {
        ...state,
        userInfo: action.payload
      }
    }
    case "setIsLoggedIn": {
      return {
        ...state,
        isLoggedIn: action.payload
      }
    }
  }
}

export function SessionUserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionUserReducer, { token: "", expire: "", userInfo: {}, isLoggedIn: false, currentPage: "" })
  const router = useRouter()

  const axiosJWT = axios.create()
  axiosJWT.interceptors.request.use(async(config) => {
    const currentDate = new Date();
    // if (state?.expire < Math.floor(Date.now() / 1000)) {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin/refresh-token`, {
      withCredentials: true,
    })
    config.headers.Authorization = `Bearer ${response.data.data}`
    dispatch({ type: "setToken", payload: response.data.data})
    const decoded: JwtPayload = jwtDecode(response.data.data);
    dispatch({ type: "setExpire", payload: decoded.exp})
    dispatch({ type: "setUserInfo", payload: decoded})
    dispatch({ type: "setIsLoggedIn", payload: true})

    return config;
  }, (error) => {
    console.log(error)
    dispatch({ type: "setIsLoggedIn", payload: false})
    Promise.reject(error);
    return router.push("/")
  })

  const axiosBasic = axios.create()


  const refreshToken = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin/refresh-token`, {
        withCredentials: true,
        headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
      })
      console.log(response, response.data.data)
      const decoded: JwtPayload = jwtDecode(response.data.data)
      // setExpire(decoded.exp)
      dispatch({ type: "setExpire", payload: decoded.exp })
      dispatch({ type: "setUserInfo", payload: decoded })
      dispatch({ type: "setIsLoggedIn", payload: true})

    } catch (error: any) {
      dispatch({ type: "setIsLoggedIn", payload: false})
      if (error.response) {
        router.push("/")
      }
      console.error(error)
    }
  }

  const value = {state, dispatch, refreshToken, axiosJWT, axiosBasic}
  return <SessionUserContext.Provider value={value}>{children}</SessionUserContext.Provider>
}

export function useSessionUser() {
  const context = useContext(SessionUserContext)

  if (context === undefined) {
    throw new Error('useSessionUser must be used within a CountProvider')
  }
  return context
}
