import React, { useState } from 'react';
import './App.css';
import { SquareEnum } from './enum/square.enum';
import GroundGravel_Grass from './images/GroundGravel_Grass.png';
import WallRound_Brown from './images/WallRound_Brown.png';
import CrateDark_Brown from './images/CrateDark_Brown.png';
import CrateDark_Blue from './images/CrateDark_Blue.png';
import EndPoint_Blue from './images/EndPoint_Blue.png';
import Character from './images/Character.png';
import { levelsType } from './levels';
import { levels } from './levels';

function App() {
  return (
    <Board />
  );
}

function Board() {
  const boardDimentions = 70;
  const [levelArray, setLevelArray] = useState(levels.level1);
  console.log(levelArray)

  function levelToSquareComponents() {
    const temp = [];
    for (let i of levelArray){
      for (let j of i){
        temp.push(<Square value={j}/>)
      }
    }

    return temp;
  }

  return (
    <div 
      id='board'
      style={{
        height: `${boardDimentions}vh`,
        width: `${boardDimentions}vh`,
      }}
    >
      {levelToSquareComponents()}
    </div>
  );
}

function Square({ value }: { value: SquareEnum }) {
  if (value === SquareEnum.EMPTY_SPACE) return (<img src={GroundGravel_Grass} alt='empty space'></img>);
  if (value === SquareEnum.WALL) return (<img src={WallRound_Brown} alt='wall'></img>);
  if (value === SquareEnum.BOX_AT_EMPTY_SPACE) return (<img src={CrateDark_Brown} alt='box at empty space'></img>);
  if (value === SquareEnum.BOX_AT_VALID_SPACE) return (<img src={CrateDark_Blue} alt='box at valid space'></img>);
  if (value === SquareEnum.VALID_SPACE) return (<img src={EndPoint_Blue} alt='valid space'></img>);
  if (value === SquareEnum.PLAYER_AT_VALID_SPACE) return (<img src={Character} alt='player at valid space'></img>);
  if (value === SquareEnum.PLAYER_AT_EMPTY_SPACE) return (<img src={Character} alt='player at empty space'></img>);
  return <></>;
}

export default App;
