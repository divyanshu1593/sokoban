import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../../state-slices/user.slice";
import { useAppDispatch } from "../../hooks/redux-hooks";
import LoadingGif from '../../images/loading.svg';

export const Signin = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const clickHandler = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    event.preventDefault();
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;

    if (username.length < 3 || username.length > 20) {
      alert('username must be between 3 to 20 characters');
      return ;
    }

    if (password.length < 8 || password.length > 20) {
      alert('password must be between 8 to 20 characters');
      return ;
    }

    const handleSignIn = async () => {
      try {
        const res = await (await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signin`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        })).json();
        setIsLoading(false);
  
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

    setIsLoading(true);
    handleSignIn();
  }

  return (
    <div className="auth-box">
      <div className="login-box-items">SignIn</div>
      <form>
        <div className="login-box-items">username <input className="login-box-input"  ref={usernameRef} type="text" /></div>
        <div className="login-box-items">password <input className="login-box-input" ref={passwordRef} type="password" /></div>
        {!isLoading && <div className="login-box-items"><input className="submit-btn" type="submit" onClick={clickHandler}/></div>}
        {isLoading && <div className="login-box-items"><input className="submit-btn" type="image" src={LoadingGif} alt="loading..."/></div>}
      </form>
    </div>
  );
}