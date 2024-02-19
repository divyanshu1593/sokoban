import { useState } from "react";
import { levelType, levels } from "../../levels";
import { LevelBtn } from "./level-btn.component";
import { Board } from "../board-screen/board.component";
import BackLogo from '../../images/back.svg';
import ResetLogo from '../../images/reset.svg';

export const Levels = () =>  {
  const [level, setLevel] = useState(levels.level1);
  const [levelNum, setLevelNum] = useState(1);
  const [showBoard, setShowBoard] = useState(false);
  const [reset, setReset] = useState(false);

  const clickHandler = (lvl: levelType, lvlNum: number) => {
    setLevel(lvl);
    setLevelNum(lvlNum);
    setShowBoard(true);
  }

  const levelBtns = [];
  for (let levelKey in levels) {
    const levelNumber = +levelKey.slice(5);
    levelBtns.push(<LevelBtn
      key={levelNumber}
      levelNumber={levelNumber}
      lvl={levels[levelKey]}
      clickHandler={clickHandler}
    />);
  }

  if (!showBoard) {
    return (
      <>
        <div className='message'>Levels</div>
        <div id='level-btns-container'>
          {levelBtns}
        </div>
      </>
    );
  }

  return (
  <>
    <div  className="btns-wrapper">
      <abbr title="back">
        <button className='logo-btn' id='back-logo-btn' onClick={() => setShowBoard(false)}>
          <img src={BackLogo} alt='back logo' height='100%' width='100%'></img>
        </button>
      </abbr>
      <abbr title="reset">
        <button className='logo-btn' id='reset-logo-btn' onClick={() => {
          setReset(true);
          setTimeout(() => setReset(false));
        }}>
          <img src={ResetLogo} alt='reset logo' height='100%' width='100%' />
        </button>
      </abbr>
    </div>
    <div id="play-area">
      <div className='message'>Level {levelNum}</div>
      {!reset && <Board level={structuredClone(level)} levelNumber={levelNum}/>}
    </div>
  </>
  );
}