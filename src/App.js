import { login, logout } from "actions/login";
import authApi from "API/authApi";
import userApi from "API/userApi";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import LoginForm from "./components/Authentication/LoginForm";
import RegisterForm from "./components/Authentication/RegisterForm";
import Header from "./components/Header";
import ConvertFile from "./feautures/Converter/pages/ConvertFile";
import FileController from "./feautures/Converter/pages/FileController";
import UserController from "./feautures/Converter/pages/UserController";
import { Logout } from './feautures/Converter/pages/Logout';

function App() {
  const isLogin = useSelector((state) => state.login.isLogin);
  const [access_token, setAccess_token] = useState(null);
  const [message, setMessage] = useState("");
  const [account_type, setAccount_type] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Nếu người dùng cố tình refresh lại trình duyệt:
    if(sessionStorage.getItem("account_type")) {
      setAccount_type(sessionStorage.getItem("account_type"));
    }

    if(sessionStorage.getItem("refresh_token")) {
      authApi.refreshToken()
        .then((response) => {
          if(response.access_token) {
            sessionStorage.setItem("access_token", response.access_token);
            setAccess_token(response.access_token);
          }
          else console.log("Access Token Error!");
        })
        .catch((err) => console.log(err));
    }
  },[])

  useEffect(() => {
    if(sessionStorage.getItem("refresh_token")) {
      setTimeout(() => {
        authApi.refreshToken()
        .then((response) => {
          if(response.access_token) {
            sessionStorage.setItem("access_token", response.access_token);
            setAccess_token(response.access_token);
          }
          else console.log("Access Token Error!");
        })
        .catch((err) => console.log(err));
      }, 30000);
    }
  }, [isLogin, access_token])

  const handleLogin = (dataLogin) => {
    authApi.login(dataLogin)
      .then((response) => {
        setMessage(response.message);
        if(response.status === 1){
          const actionLogin = login(dataLogin);
          dispatch(actionLogin);
          
          setAccess_token(response.access_token);
          // reset Message báo đăng nhập nếu đăng nhập thành công
          setMessage("");
          setAccount_type(response.account_type);

          console.log(response);

          sessionStorage.setItem("isLogin", true);
          sessionStorage.setItem("account_type", response.account_type);
          sessionStorage.setItem("username", response.username);
          sessionStorage.setItem("access_token", response.access_token);
          sessionStorage.setItem("refresh_token", response.refresh_token);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRegister = (dataRegister) => {
    userApi.register(dataRegister)
      .then((response) => {
        setMessage(response.message);
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    authApi.logout()
    .then((response) => {
      if(response.status === 1) {
        setAccess_token(null);
        setAccount_type(null);
        sessionStorage.clear();
        const actionLogout = logout();
        dispatch(actionLogout);
      }    
    })
  };

  if (isLogin) {
    if(account_type === "modifier"){
      return (
        <BrowserRouter>
          <Header headerType="modifier"/>
          <Switch>
            <Route path="/ConvertFile" component={ConvertFile} />
            <Route path="/FileController" component={FileController} />
            <Route path="/UserController" component={UserController} />
            <Route path="/logout">
                <Logout handleLogout={handleLogout}></Logout>
            </Route>
            <Redirect to="/convertFile" />
          </Switch>
        </BrowserRouter>
      );
    } else {
      return(
        <BrowserRouter>
        <Header headerType="normal"/>
        <Switch>
          <Route path="/ConvertFile" component={ConvertFile} />
          <Route path="/FileController" component={FileController} />
          <Route path="/logout">
                <Logout handleLogout={handleLogout}></Logout>
            </Route>
            <Redirect to="/convertFile" />
          </Switch>
        </BrowserRouter>
      )
    }
  } else {
    return (
      <BrowserRouter>
        <p className="message">{message}</p>
        <Switch>
          <Route path="/login">
            <LoginForm handleLogin={handleLogin} />
          </Route>
          <Route path="/register">
            <RegisterForm handleRegister={handleRegister} />
          </Route>
          <Redirect to="/login" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
