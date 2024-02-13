import { levelType } from "../levels";

export const LevelBtn = ({ levelNumber, lvl, clickHandler }: {
  levelNumber: number,
  lvl: levelType,
  clickHandler: (lvl: levelType, lvlNum: number) => void
}) => {
  return (
    <button id='level-btns'
    onClick={() => {
      return clickHandler(lvl, levelNumber)
    }}
    >{ levelNumber }</button>
  );
}