import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { SquareEnum } from './enum/square.enum';
import GroundGravel_Grass from './images/GroundGravel_Grass.png';
import WallRound_Brown from './images/WallRound_Brown.png';
import CrateDark_Brown from './images/CrateDark_Brown.png';
import CrateDark_Blue from './images/CrateDark_Blue.png';
import EndPoint_Blue from './images/EndPoint_Blue.png';
import Character from './images/Character.png';
import BackLogo from './images/back.svg';
import ResetLogo from './images/reset.svg';
import { levelType, levels } from './levels';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WelcomeScreen } from './components/welcome-screen.component';
import { Signin } from './components/signin.component';
import { Signup } from './components/signup.component';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WelcomeScreen />} />
        <Route path='/levels' element={<Levels />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

function Levels() {
  const [level, setLevel] = useState(levels.level1);
  const [levelNum, setLevelNum] = useState(1);
  const [showBoard, setShowBoard] = useState(false);
  const [reset, setReset] = useState(false);

  function clickHandler(lvl: levelType, lvlNum: number) {
    setLevel(lvl);
    setLevelNum(lvlNum);
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
        <div className='message'>Levels</div>
        <div id='level-btns-container'>
          {levelBtns}
        </div>
      </>
    );
  }

  return (
  <>
    <button className='logo-btn' id='back-logo-btn' onClick={() => setShowBoard(false)}>
      <img src={BackLogo} alt='back logo' height='100%' width='100%'></img>
    </button>
    <button className='logo-btn' id='reset-logo-btn' onClick={() => {
      setReset(true);
      setTimeout(() => setReset(false));
    }}>
      <img src={ResetLogo} alt='reset logo' height='100%' width='100%' />
    </button>
    <div className='message'>Level {levelNum}</div>
    {!reset && <Board level={structuredClone(level)}/>}
  </>
  );
}

function LevelBtn({ levelNumber, lvl, clickHandler }: {
  levelNumber: number,
  lvl: levelType,
  clickHandler: (lvl: levelType, lvlNum: number) => void
}) {
  return (
    <button id='level-btns'
    onClick={() => {
      return clickHandler(lvl, levelNumber)
    }}
    >{ levelNumber }</button>
  );
}

function Board({ level }: {level: levelType}) {
  const boardDimentions = 70;
  const [levelState, setLevelState] = useState(level);
  const [hasWon, setHasWon] = useState(false);
  const [boardHeight, setBoardHeight] = useState('');
  const [boardWidth, setBoardWidth] = useState('');
  const squares: JSX.Element[] = [];

  function updateBoardSize() {
    const numOfColumns = level[0].length;
    const numOfRows = level.length;

    function resize(unit: 'vh' | 'vw') {
      if (numOfColumns < numOfRows) {
        setBoardWidth((boardDimentions * numOfColumns) / numOfRows + unit);
      } else {
        setBoardWidth(boardDimentions + unit);
      }
      if (numOfColumns > numOfRows) {
        setBoardHeight((boardDimentions * numOfRows) / numOfColumns + unit);
      } else {
        setBoardHeight(boardDimentions + unit);
      }
    }

    if (window.innerHeight > window.innerWidth) {
      resize('vw');
    } else {
      resize('vh');
    }
  }
  
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

  function handleMove(dir: string, state: levelType, playerPos: playerPos): levelType {
    state = state.slice();
    let a = 0, b = 0;
    if (dir === 'up'){
      a = -1;
      b = 0;
    } else if (dir === 'left'){
      a = 0;
      b = -1;
    } else if (dir === 'down'){
      a = 1;
      b = 0;
    } else if (dir === 'right'){
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

    if (event.key === 'ArrowUp') updateMove('up');
    if (event.key === 'ArrowDown') updateMove('down');
    if (event.key === 'ArrowLeft') updateMove('left');
    if (event.key === 'ArrowRight') updateMove('right');
  }

  function updateMove(dir: string) {
    const updatedState = handleMove(dir, levelState, findPlayerPosition(levelState) as playerPos);
    setLevelState(updatedState);
    
    if (isWin(updatedState)) {
      setHasWon(true);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', keyhandler);
    window.addEventListener('resize', updateBoardSize);
    updateBoardSize();
    return () => {
      window.removeEventListener('keydown', keyhandler);
      window.removeEventListener('resize', updateBoardSize);
    }
  }, []);

  function isWin(state: levelType): boolean {
    for (let row of state){
      for (let j of row){
        if (j === SquareEnum.VALID_SPACE || j === SquareEnum.PLAYER_AT_VALID_SPACE) return false;
      }
    }

    return true;
  }

  return (
    <>
      <div 
        id='board'
        style={{
          height: boardHeight,
          width: boardWidth,
          gridTemplateColumns: `repeat(${level[0].length}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${level.length}, minmax(0, 1fr))`,
        }}
      >
        {squares}
      </div>
      {hasWon && <div className='message'>You have won the game!</div>}
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
