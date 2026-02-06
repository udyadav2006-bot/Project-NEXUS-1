import axios from "axios";
import { useState } from "react";

const API = import.meta.env.VITE_API;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const login = async () => {
    const r = await axios.post(API + "/auth/login", { email, password });
    localStorage.setItem("token", r.data.token);
    alert("Logged in as " + r.data.name);
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e=>setPass(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}
