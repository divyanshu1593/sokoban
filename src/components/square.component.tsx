import { SquareEnum } from "../enum/square.enum";
import GroundGravel_Grass from '../images/GroundGravel_Grass.png';
import WallRound_Brown from '../images/WallRound_Brown.png';
import CrateDark_Brown from '../images/CrateDark_Brown.png';
import CrateDark_Blue from '../images/CrateDark_Blue.png';
import EndPoint_Blue from '../images/EndPoint_Blue.png';
import Character from '../images/Character.png';

export const Square = ({ value }: { value: SquareEnum }) => {
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