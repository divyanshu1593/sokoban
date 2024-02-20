import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { makeSelectPayload, signout } from "../../state-slices/user.slice";

export const NavbarWelcomeScreen = () => {
  const navigate = useNavigate();
  const user = useAppSelector(makeSelectPayload());
  const dispatch = useAppDispatch();
  
  return (
    <div id="welcome-navbar">
      {user && <button className='welcome-navbar-btn' onClick={() => dispatch(signout())}>sign out</button>}
      {user && <div id="welcome-user">Welcome {user.username}</div>}
      {!user && <button className='welcome-navbar-btn' onClick={() => navigate('signin')}>signin</button>}
      {!user && <button className='welcome-navbar-btn' onClick={() => navigate('signup')}>signup</button>}
    </div>
  );
}