import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const clickHandler = async (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    event.preventDefault();
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;

    if (username.length <= 3 || username.length >= 20) {
      alert('username must be between 3 to 20 characters');
      return ;
    }

    if (password.length <= 8 || password.length >= 20) {
      alert('password must be between 3 to 20 characters');
      return ;
    }

    const res = await (await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username, password}),
    })).json();
    
    if (res.isError) {
      if (res.message.message === 'username already exist') {
        alert('username already exists');
        return ;
      }
      alert('signup failed');
      return ;
    }
    alert('signup done');
    navigate('/');
  }
  return (
    <div className="auth-box">
      <div className="login-box-items">SignUp</div>
      <form>
        <div className="login-box-items">username: <input className="login-box-input" ref={usernameRef} type="text" id="username" required/></div>
        <div className="login-box-items">password: <input className="login-box-input" ref={passwordRef} type="password" id="password" required/></div>
        <div className="login-box-items"><input className="submit-btn" type="submit" onClick={(event) => clickHandler(event)}/></div>
      </form>
    </div>
  );
}