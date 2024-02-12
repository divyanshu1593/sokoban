import { Link } from "react-router-dom";

export function WelcomeScreen() {
  return (
    <>
      Sokoban
      <button><Link to='levels'>play</Link></button>
      <button><Link to='signin'>signin</Link></button>
      <button><Link to='signup'>signup</Link></button>
    </>
  );
}
