import React, { useState, useEffect } from "react";
import {useNavigate, useParams, Link } from "react-router-dom";
import { Box, CardMedia } from "@mui/material";

import { Videos, ChannelCard } from ".";
import { loginAPI, loginAsyncKeyAPI, loginFacebookAPI } from "../utils/fetchFromAPI";
import { toast } from "react-toastify";
import ReactFacebookLogin from "react-facebook-login";

const Login = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

  }, []);

  return <div className="p-5 " style={{ minHeight: "100vh" }}>
    <div className=" d-flex justify-content-center">
      <form className="row g-3 text-white">
        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" />
        </div>

        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Password</label>
          <input className="form-control" id="pass" />
        </div>
        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Code</label>
          <input className="form-control" id="code" />
        </div>
        <div className="col-12">
          <button type="button" className="btn btn-primary"
          onClick={()=>{
            let email = document.getElementById("email").value;
            let pass_word = document.getElementById("pass").value;
            let code = document.getElementById("code").value;
            console.log(`email:${email}; pass_word: ${pass_word}`);
            loginAsyncKeyAPI({email,pass_word,code})
            .then((result)=>{

              //result gồm message và data
              // tạo pop up thông báo login thành công
              toast.success(result.message);
              // lưu acces token trong local storage của brower
              localStorage.setItem("LOGIN_USER",result.data);
              
              navigate("/");
            })
            .catch(()=>{
              console.log("error from API login");
              toast.error("Password is wrong");
            })
          }}
          >Login</button>
          <Link
            className="text-primary"
            to="/forgot-pass"
            >Forgot Password</Link>
          <ReactFacebookLogin 
          appId="879276390488488"
          fields="name,email,picture"
          callback={(reponse)=>{
            let{id,email,name} = reponse;
            loginFacebookAPI({id,email,name})
            .then((result)=>{
              toast.success(result.message);

              localStorage.setItem("LOGIN_USER",result.data);

              navigate("/");
            })
            .catch((error)=>{
              toast.error(error.reponse.data.message);
            })
          }}
          />
        </div>
      </form>
    </div>
  </div>
};

export default Login;
