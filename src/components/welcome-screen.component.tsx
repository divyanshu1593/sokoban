import { useNavigate } from "react-router-dom";
import { NavbarWelcomeScreen } from "./navbar-welcome-sreen.component";

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  return (
    <>
      <NavbarWelcomeScreen />
      <div id="main-welcome-screen">
        <div id="game-title-div">Sokoban</div>
        <button id="play-btn" onClick={() => navigate('levels')}>play</button>
      </div>
    </>
  );
}
