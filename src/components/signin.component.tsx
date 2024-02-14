import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../state-slices/user.slice";
import { useAppDispatch } from "../hooks/redux-hooks";
import { jwtDecode } from "jwt-decode";

export const Signin = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function clickHandler(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    event.preventDefault();
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;

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
      const jwtPayload = jwtDecode(res.data);
      dispatch(signin(JSON.stringify(jwtPayload)));
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('signin not done');
    }
      
  }
  return (
    <form>
      username <input ref={usernameRef} type="text" />
      password <input ref={passwordRef} type="password" />
      <input type="submit" onClick={clickHandler}/>
    </form>
  );
}