import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/redux-hooks";
import { levelType } from "../levels";

export const LevelBtn = ({ levelNumber, lvl, clickHandler }: {
  levelNumber: number,
  lvl: levelType,
  clickHandler: (lvl: levelType, lvlNum: number) => void
}) => {
  const [isCrossed, setIsCrossed] = useState(false);
  const jwtToken = useAppSelector(state => state.user.value);

  const updateIfCrossed = async () => {
    const res = await (await fetch(`http://localhost:3000/is-level-crossed/${levelNumber}`, {
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
  }

  useEffect(() => {
    updateIfCrossed();
  }, []);

  if (isCrossed) {
    return (
      <button id='level-btns'
      style={{
        backgroundColor: 'green',
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