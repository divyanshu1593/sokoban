import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const clickHandler = async (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    event.preventDefault();
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;

    const res = await (await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username, password}),
    })).json();
    
    if (res.isError) {
      alert('username already exists');
      if (res.message.message === 'username already exist') {
        return ;
      }
      alert('signup failed');
      return ;
    }
    alert('signup done');
    navigate('/');
  }
  return (
    <>
      <form>
        username: <input ref={usernameRef} type="text" id="username" required/>
        password: <input ref={passwordRef} type="password" id="password" required/>
        <input type="submit" onClick={(event) => clickHandler(event)}/>
      </form>
    </>
  );
}