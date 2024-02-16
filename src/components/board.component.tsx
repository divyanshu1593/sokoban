import { useEffect, useRef, useState } from "react";
import { levelType } from "../levels";
import { Square } from "./square.component";
import { SquareEnum } from "../enum/square.enum";
import { useAppSelector } from "../hooks/redux-hooks";
import { UndoBtn } from "./undo-btn.component";

export const Board = ({ level, levelNumber }: {level: levelType, levelNumber: number}) => {
  const boardDimentions = 70;
  const [levelState, setLevelState] = useState(0);
  const levelStateRef = useRef(levelState);
  const levelStateHistory = useRef([level]);
  const [hasWon, setHasWon] = useState(false);
  const [boardHeight, setBoardHeight] = useState('');
  const [boardWidth, setBoardWidth] = useState('');
  const jwtToken = useAppSelector(state => state.user.value);
  const squares: JSX.Element[] = [];

  function currentLevelState() {
    return structuredClone(levelStateHistory.current[levelStateRef.current]);
  }

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
  
  for (let i = 0; i < currentLevelState().length; i++) {
    for (let j = 0; j < currentLevelState()[0].length; j++) {
      squares.push(<Square key={`${i}_${j}`} value={currentLevelState()[i][j]} />);
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
    state = structuredClone(state);
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

  const keyhandler = (event: KeyboardEvent) => {
    if (event.repeat || wonRef.current) return ;

    if (event.key === 'ArrowUp') updateMove('up');
    if (event.key === 'ArrowDown') updateMove('down');
    if (event.key === 'ArrowLeft') updateMove('left');
    if (event.key === 'ArrowRight') updateMove('right');
  }

  const updateMove = (dir: string) => {
    const updatedState = handleMove(dir, currentLevelState(), findPlayerPosition(currentLevelState()) as playerPos);
    levelStateRef.current += 1;
    const currentStateTillNow = levelStateHistory.current.slice(0, levelStateRef.current);
    currentStateTillNow.push(updatedState);
    levelStateHistory.current = currentStateTillNow;
    setLevelState(levelStateRef.current);
    
    
    if (isWin(updatedState)) {
      setHasWon(true);
      fetch('http://localhost:3000/add-crossed-level', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          levelCrossed: levelNumber,
        }),
      });
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

  const undoState = () => {
    if (levelStateRef.current === 0 || wonRef.current) return ;
    setLevelState(levelStateRef.current - 1);
    levelStateRef.current -= 1;
  }

  return (
    <>
      <UndoBtn undoState={undoState} />
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