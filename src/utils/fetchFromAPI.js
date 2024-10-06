import { dark } from '@mui/material/styles/createPalette';
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';

const options = {
  params: {
    maxResults: 50,
  },
  headers: {
    token: localStorage.getItem("LOGIN_USER")
  },
};

// tao mot instance axios
export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`
});

// Them mot interceptor de gan access token vao headers truoc moi request
axiosInstance.interceptors.request.use(
  (config)=>{
    if(config.requireAuth){
      //lay access token tu localstorage
      const accessToken = localStorage.getItem("LOGIN_USER");
      if(accessToken){
        config.headers["token"]=`${accessToken}`;
      }
    }
    return config;
  },
  (error)=>{}
)

const extendToken=async () => {
  const {data} = await axiosInstance.post(`/auth/extend-token`,{},{
    withCredentials:true // cho phép gửi và nhận cookie từ server
  })

  console.log("data", data)

  // lưu access token mới vào localStorge
  localStorage.setItem("LOGIN_USER",data.data);
  return data;
}

// config intercreptor cho response mỗi khi reponse API nào đó trả về 401
axiosInstance.interceptors.response.use(
  (response) => {return response}, // param function khi response API trả về 2x
  async(error) => {
    const originalRequest = error.config;
    if (error.response.status === 401){
      try {
        const data = await extendToken();
        console.log("data",data);
        // gán lại token mới vào headers
        originalRequest.headers["token"] =data.data;
        // call lại API 1 lần nữa
        return axiosInstance(originalRequest)
      } catch (error) {
        console.log('Extend token failed',error)
      }
    };
  } // param khác trả về 2x
)


export const fetchFromAPI = async (url) => {
  const { data } = await axiosInstance.get(`${BASE_URL}/${url}`);

  return data;
};

export const getListVideo = async () =>{
  const {data} = await axiosInstance.get(`${BASE_URL}/video/get-videos`);
  return data;
}

export const getType = async ()=>{
  const{data}=await axiosInstance.get(`${BASE_URL}/video/get-type`,{
    requireAuth:true
  },options);
  return data;
}

export const getListVideoType = async(typeid)=>{
    const {data} = await axiosInstance.get(`${BASE_URL}/video/get-video-type-by-id/${typeid}`);
    return data;
}

export const registerApi= async(pageload)=>{
  const{data} = await axiosInstance.post(`${BASE_URL}/auth/register`,pageload);
  return data;
}


export const loginAPI = async(pageload)=>{
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/login`,pageload,{
    withCredentials:true //cho phep gui va nhan cookie tu BE
  });
  return data;
}
export const  loginAsyncKeyAPI = async(payload)=>{
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/login-async-key`,payload,{
    withCredentials:true //cho phep gui va nhan cookie tu BE
  });
  return data;
}

export const loginFacebookAPI = async (newUser) =>{
  const{data} = await axiosInstance.post(`${BASE_URL}/auth/login-face`,newUser);
  return data;
}