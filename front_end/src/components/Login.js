import React, { useState } from "react";
import "./../styles/App.css";


export default function Login(props) {
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");

	return (<div className="login">
        <input type="text" placeholder="enter username" value={username}
            onChange={(e) => setUsername(e.target.value)}
        >
        </input>
        <input type="password" placeholder="enter password" value={password}
             onChange={(e) => setPassword(e.target.value)}
        ></input> 
        {props.error ? <div className="error">{props.error}</div> : null}        
        <button style={{width:"300px"}} onClick ={() => props.signupHandler(username,password)}>Sign up</button>
        <button style={{width:"300px"}} onClick ={() => props.loginHandler(username,password)}>Log In</button>
    </div>
    );
}



