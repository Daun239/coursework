import React from 'react'
import { useState } from "react"
import { useServiceStore } from "../../Stores/ServicesStore";

const LoginPage = () => {
  const { loginService } = useServiceStore(); // Access loginService from the store
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log(email, password);

    await loginService.loginUser(email.trim(), password.trim());
  };

  return (
    <div>
      <input type="text" placeholder="Email" onChange = {(e => setEmail(e.target.value))}/>
      <input type="password" placeholder="Password" onChange={(e => setPassword(e.target.value)) } /> 
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;

