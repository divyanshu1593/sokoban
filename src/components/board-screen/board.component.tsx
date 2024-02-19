import { useCallback, useEffect, useRef, useState } from "react";
import { levelType } from "../../levels";
import { Square } from "./square.component";
import { SquareEnum } from "../../enum/square.enum";
import { useAppSelector } from "../../hooks/redux-hooks";
import { UndoBtn } from "./undo-btn.component";
import { RedoBtn } from "./redo-btn.component";

const BOARD_DIMENTIONS = 60;
const MAX_HISTORY_LENGTH = 100;

export const Board = ({ level, levelNumber }: {level: levelType, levelNumber: number}) => {
  const [levelState, setLevelState] = useState(0);
  const [levelStateHistory, setLevelStateHistory] = useState([level]);
  const [hasWon, setHasWon] = useState(false);
  const [boardHeight, setBoardHeight] = useState('');
  const [boardWidth, setBoardWidth] = useState('');
  const jwtToken = useAppSelector(state => state.user.value);
  const squares: JSX.Element[] = [];

  const currentLevelState = useCallback(() => {
    return structuredClone(levelStateHistory[levelState]);
  }, [levelState, levelStateHistory]);

  const updateBoardSize = useCallback(() => {
    const numOfColumns = level[0].length;
    const numOfRows = level.length;

    function resize(unit: 'vh' | 'vw') {
      if (numOfColumns < numOfRows) {
        setBoardWidth((BOARD_DIMENTIONS * numOfColumns) / numOfRows + unit);
      } else {
        setBoardWidth(BOARD_DIMENTIONS + unit);
      }
      if (numOfColumns > numOfRows) {
        setBoardHeight((BOARD_DIMENTIONS * numOfRows) / numOfColumns + unit);
      } else {
        setBoardHeight(BOARD_DIMENTIONS + unit);
      }
    }

    if (window.innerHeight > window.innerWidth) {
      resize('vw');
    } else {
      resize('vh');
    }
  }, [level]);

  
  for (let i = 0; i < currentLevelState().length; i++) {
    for (let j = 0; j < currentLevelState()[0].length; j++) {
      squares.push(<Square key={`${i}_${j}`} value={currentLevelState()[i][j]} />);
    }
  }

  type playerPos = {
    i: number;
    j: number;
  }

  const findPlayerPosition = (state: levelType) => {
    for (let i = 0; i < state.length; i++){
      for (let j = 0; j < state[0].length; j++){
        if (state[i][j] === SquareEnum.PLAYER_AT_EMPTY_SPACE || state[i][j] === SquareEnum.PLAYER_AT_VALID_SPACE) {
          return {i, j}
        }
      }
    }
  }

  const handleMove = useCallback((dir: string, state: levelType, playerPos: playerPos): levelType => {
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
  }, []);

  const updateMove = useCallback((dir: string) => {
    const updatedState = handleMove(dir, currentLevelState(), findPlayerPosition(currentLevelState()) as playerPos);
    const currentStateTillNow = levelStateHistory.slice(0, levelState + 1);
    currentStateTillNow.push(updatedState);

    if (currentStateTillNow.length > MAX_HISTORY_LENGTH) {
      currentStateTillNow.shift();
    } else {
      setLevelState(levelState + 1);
    }

    setLevelStateHistory(currentStateTillNow);
    
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
  }, [currentLevelState, handleMove, jwtToken, levelNumber, levelState, levelStateHistory]);

  const keyhandler = useCallback((event: KeyboardEvent) => {
    if (event.repeat || hasWon) return ;

    if (event.key === 'ArrowUp') updateMove('up');
    if (event.key === 'ArrowDown') updateMove('down');
    if (event.key === 'ArrowLeft') updateMove('left');
    if (event.key === 'ArrowRight') updateMove('right');
  }, [hasWon, updateMove]);

  const x = useRef<number | null>(null);
  const y = useRef<number | null>(null);

  const mouseHandler = useCallback((event: TouchEvent) => {
    if (event.type === 'touchstart') {
      x.current = event.changedTouches[0].screenX;
      y.current = event.changedTouches[0].screenY;
    } else if (event.type === 'touchend') {
      if (!x || !y) return ;

      const xDiff = event.changedTouches[0].screenX - x.current!;
      const yDiff = event.changedTouches[0].screenY - y.current!;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff < 0) {
          updateMove('left');
        } else if (xDiff > 0) {
          updateMove('right');
        }
      } else if (Math.abs(xDiff) < Math.abs(yDiff)) {
        if (yDiff < 0) {
          updateMove('up');
        } else if (yDiff > 0) {
          updateMove('down');
        }
      }
    }
  }, [updateMove]);

  useEffect(() => {
    window.addEventListener('keydown', keyhandler);
    window.addEventListener('resize', updateBoardSize);
    window.addEventListener('touchstart', mouseHandler);
    window.addEventListener('touchend', mouseHandler);
    updateBoardSize();
    return () => {
      window.removeEventListener('keydown', keyhandler);
      window.removeEventListener('resize', updateBoardSize);
      window.removeEventListener('touchstart', mouseHandler);
      window.removeEventListener('touchend', mouseHandler);
    }
  }, [keyhandler, mouseHandler, updateBoardSize]);

  const isWin = (state: levelType): boolean => {
    for (let row of state){
      for (let j of row){
        if (j === SquareEnum.VALID_SPACE || j === SquareEnum.PLAYER_AT_VALID_SPACE) return false;
      }
    }

    return true;
  }

  const undoState = () => {
    if (levelState === 0 || hasWon) return ;
    setLevelState(levelState - 1);
  }

  const redoState = () => {
    if (levelState === levelStateHistory.length - 1) {
      return ;
    }
    setLevelState(levelState + 1);
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
      <div id="undo-redo-wraper">
        <UndoBtn undoState={undoState} />
        <RedoBtn redoState={redoState} />
      </div>
      
      {hasWon && <div className='message'>You have won the game!</div>}
    </>
  );
}