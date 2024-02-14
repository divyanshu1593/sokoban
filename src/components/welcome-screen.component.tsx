import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { selectPayload, signout } from "../state-slices/user.slice";

export const WelcomeScreen = () => {
  const user = useAppSelector(selectPayload);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <>
      Sokoban
      <button onClick={() => navigate('levels')}>play</button>
      {!user && <button onClick={() => navigate('signin')}>signin</button>}
      {!user && <button onClick={() => navigate('signup')}>signup</button>}
      {user && <button onClick={() => dispatch(signout())}>sign out</button>}
      {user && <>Welcome {user.username}</>}
    </>
  );
}
