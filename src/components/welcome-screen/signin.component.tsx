import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../../state-slices/user.slice";
import { useAppDispatch } from "../../hooks/redux-hooks";

export const Signin = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

    try {
      const res = await (await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })).json();

      if (res.isError) {
        if (res.message.status === 401) {
          alert('incorrect username or password!');
          return ;
        }
        throw new Error(res.message);
      }

      alert('signin done');
      dispatch(signin(res.data));
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('signin not done');
    } 
      
  }
  return (
    <div className="auth-box">
      <div className="login-box-items">SignIn</div>
      <form>
        <div className="login-box-items">username <input className="login-box-input"  ref={usernameRef} type="text" /></div>
        <div className="login-box-items">password <input className="login-box-input" ref={passwordRef} type="password" /></div>
        <div className="login-box-items"><input className="submit-btn" type="submit" onClick={clickHandler}/></div>
      </form>
    </div>
  );
}