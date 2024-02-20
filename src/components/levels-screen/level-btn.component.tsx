import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/redux-hooks";
import { levelType } from "../../levels";
import WinCrate from '../../images/CrateDark_Blue.png';

export const LevelBtn = ({ levelNumber, lvl, clickHandler }: {
  levelNumber: number,
  lvl: levelType,
  clickHandler: (lvl: levelType, lvlNum: number) => void
}) => {
  const [isCrossed, setIsCrossed] = useState(false);
  const jwtToken = useAppSelector(state => state.user.value);

  const updateIfCrossed = useCallback(async () => {
    const res = await (await fetch(`${process.env.REACT_APP_BACKEND_URL}/is-level-crossed/${levelNumber}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    })).json();

    if (!res.isError) {
      if (res.data) {
        setIsCrossed(true);
      }
    }
  }, [jwtToken, levelNumber]);

  useEffect(() => {
    updateIfCrossed();
  }, [updateIfCrossed]);

  if (isCrossed) {
    return (
      <button id='level-btns'
      style={{
        backgroundImage: `url(${WinCrate})`,
      }}
      onClick={() => {
        return clickHandler(lvl, levelNumber);
      }}
      >{ levelNumber }</button>
    );
  }

  return (
    <button id='level-btns'
    onClick={() => {
      return clickHandler(lvl, levelNumber);
    }}
    >{ levelNumber }</button>
  );
}