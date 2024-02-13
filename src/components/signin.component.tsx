import { useRef } from "react";

export const Signin = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function clickHandler() {
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;
  }
  return (
    <form>
      username <input ref={usernameRef} type="text" />
      password <input ref={passwordRef} type="password" />
      <input type="submit" onClick={clickHandler}/>
    </form>
  );
}