import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { SquareEnum } from './enum/square.enum';
import GroundGravel_Grass from './images/GroundGravel_Grass.png';
import WallRound_Brown from './images/WallRound_Brown.png';
import CrateDark_Brown from './images/CrateDark_Brown.png';
import CrateDark_Blue from './images/CrateDark_Blue.png';
import EndPoint_Blue from './images/EndPoint_Blue.png';
import Character from './images/Character.png';
import { levelType, levels } from './levels';

function App() {
  return (
    <Levels />
  );
}

function Levels() {
  const [level, setLevel] = useState(levels.level1);
  const [showBoard, setShowBoard] = useState(false);
  const [reset, setReset] = useState(false);

  function clickHandler(lvl: levelType) {
    setLevel(lvl);
    setShowBoard(true);
  }

  const levelBtns = [];
  for (let levelKey in levels) {
    levelBtns.push(<LevelBtn 
      levelNumber={+levelKey.slice(5)}
      lvl={levels[levelKey]}
      clickHandler={clickHandler}
    />);
  }

  if (!showBoard) {
    return (
      <>
        {levelBtns}
      </>
    );
  }

    return (
    <>
      <button onClick={() => setShowBoard(false)}>Levels</button>
      <button onClick={() => {
        setReset(true);
        setTimeout(() => setReset(false));
      }}>reset</button>
      {!reset && <Board level={structuredClone(level)}/>}
    </>
  );
}

function LevelBtn({ levelNumber, lvl, clickHandler }: {
  levelNumber: number,
  lvl: levelType,
  clickHandler: (lvl: levelType) => void
}) {
  return (
    <button
    onClick={() => {
      return clickHandler(lvl)
    }}
    >{ levelNumber }</button>
  );
}

function Board({ level }: {level: levelType}) {
  const boardDimentions = 70;
  const [levelState, setLevelState] = useState(level);
  const [hasWon, setHasWon] = useState(false);
  const squares: JSX.Element[] = [];

  for (let row of levelState) {
    for (let state of row) {
      squares.push(<Square value={state} />);
    }
  }

  type playerPos = {
    i: number;
    j: number;
  }

  function findPlayerPosition(state: levelType) {
    for (let i = 0; i < state.length; i++){
      for (let j = 0; j < state[0].length; j++){
        if (state[i][j] === SquareEnum.PLAYER_AT_EMPTY_SPACE || state[i][j] === SquareEnum.PLAYER_AT_VALID_SPACE) {
          return {i, j}
        }
      }
    }
  }

  function handleMove(event: KeyboardEvent, state: levelType, playerPos: playerPos): levelType {
    state = state.slice();
    let a = 0, b = 0;
    if (event.key === 'ArrowUp'){
      a = -1;
      b = 0;
    } else if (event.key === 'ArrowLeft'){
      a = 0;
      b = -1;
    } else if (event.key === 'ArrowDown'){
      a = 1;
      b = 0;
    } else if (event.key === 'ArrowRight'){
      a = 0;
      b = 1;
    }

    let cur = state[playerPos.i][playerPos.j];
    let nextInDir = state[playerPos.i + a][playerPos.j + b];

    if (nextInDir === SquareEnum.EMPTY_SPACE || nextInDir === SquareEnum.VALID_SPACE) {
      if (cur === SquareEnum.PLAYER_AT_EMPTY_SPACE) {
        state[playerPos.i][playerPos.j] = SquareEnum.EMPTY_SPACE;
      } else {
        state[playerPos.i][playerPos.j] = SquareEnum.VALID_SPACE;
      }
      if (nextInDir === SquareEnum.EMPTY_SPACE){
        state[playerPos.i + a][playerPos.j + b] = SquareEnum.PLAYER_AT_EMPTY_SPACE;
      } else {
        state[playerPos.i + a][playerPos.j + b] = SquareEnum.PLAYER_AT_VALID_SPACE;
      }

      return state;
    }
    
    if (nextInDir === SquareEnum.WALL){
      return state;
    }
    
    if (nextInDir === SquareEnum.BOX_AT_EMPTY_SPACE || nextInDir === SquareEnum.BOX_AT_VALID_SPACE){
      let n2nInDir = state[playerPos.i + (2 * a)][playerPos.j + (2 * b)];
      if (n2nInDir === SquareEnum.EMPTY_SPACE || n2nInDir === SquareEnum.VALID_SPACE){
        if (n2nInDir === SquareEnum.EMPTY_SPACE){
          state[playerPos.i + (2 * a)][playerPos.j + (2 * b)] = SquareEnum.BOX_AT_EMPTY_SPACE;
        } else {
          state[playerPos.i + (2 * a)][playerPos.j + (2 * b)] = SquareEnum.BOX_AT_VALID_SPACE;
        }

        if (nextInDir === SquareEnum.BOX_AT_EMPTY_SPACE){
          state[playerPos.i + a][playerPos.j + b] = SquareEnum.PLAYER_AT_EMPTY_SPACE;
        } else {
          state[playerPos.i + a][playerPos.j + b] = SquareEnum.PLAYER_AT_VALID_SPACE;
        }

        if (cur === SquareEnum.PLAYER_AT_EMPTY_SPACE){
          state[playerPos.i][playerPos.j] = SquareEnum.EMPTY_SPACE;
        } else {
          state[playerPos.i][playerPos.j] = SquareEnum.VALID_SPACE;
        }

        return state;
      }

      return state;
    }
    return state;
  }

  const wonRef = useRef<boolean>();
  wonRef.current = hasWon;

  const keyhandler = function(event: KeyboardEvent) {
    if (event.repeat || wonRef.current) return ;

    const updatedState = handleMove(event, levelState, findPlayerPosition(levelState) as playerPos);
    setLevelState(updatedState);
    
    if (isWin(updatedState)) {
      setHasWon(true);
    }
  }


  useEffect(() => {
    document.addEventListener('keydown', keyhandler);
    return () => document.removeEventListener('keydown', keyhandler);
  }, []);

  function isWin(state: levelType): boolean {
    for (let row of state){
      for (let j of row){
        if (j === SquareEnum.VALID_SPACE || j === SquareEnum.PLAYER_AT_VALID_SPACE) return false;
      }
    }

    return true;
  }

  function WinMessage() {
    if (hasWon) {
      return (
        <div style={{
          textAlign: 'center',
          fontWeight: 900,
          fontSize: '3em',
          padding: '5vh'
        }}>
          You have won the game!
        </div>
      );
    }
    return (<></>);
  }

  return (
    <>
      <div 
        id='board'
        style={{
          height: `${boardDimentions}vh`,
          width: `${boardDimentions}vh`,
          gridTemplateColumns: `repeat(${level[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${level.length}, 1fr)`,
        }}
      >
        {squares}
      </div>
      <WinMessage />
    </>
  );
}

function Square({ value }: { value: SquareEnum }) {
  if (value === SquareEnum.EMPTY_SPACE) {
    return (<img 
      src={GroundGravel_Grass} 
      alt='empty space'
      style={{
        height: '100%',
        width: '100%',
      }}
    ></img>);
  }
  if (value === SquareEnum.WALL) {
    return (<img 
      src={WallRound_Brown}
      alt='wall'
      style={{
        height: '100%',
        width: '100%',
      }}
    ></img>);
  }
  if (value === SquareEnum.BOX_AT_EMPTY_SPACE) {
    return (<img 
      src={CrateDark_Brown} 
      alt='box at empty space'
      style={{
        height: '100%',
        width: '100%',
      }}
      ></img>);
  }
  if (value === SquareEnum.BOX_AT_VALID_SPACE) {
    return (<img 
      src={CrateDark_Blue} 
      alt='box at valid space'
      style={{
        height: '100%',
        width: '100%',
      }}
      ></img>);
  }
  if (value === SquareEnum.VALID_SPACE) {
    return (<img 
      src={EndPoint_Blue} 
      alt='valid space'
      style={{
        height: '100%',
        width: '100%',
      }}
      ></img>);
  }
  if (value === SquareEnum.PLAYER_AT_VALID_SPACE) {
    return (<img 
      src={Character} 
      alt='player at valid space'
      style={{
        height: '100%',
        width: '100%',
      }}
      ></img>);
  }
  if (value === SquareEnum.PLAYER_AT_EMPTY_SPACE) {
    return (<img 
      src={Character} 
      alt='player at empty space'
      style={{
        height: '100%',
        width: '100%',
      }}
      ></img>);
  }
  return <></>;
}

export default App;
