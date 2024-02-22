import { SquareEnum } from "../../enum/square.enum";
import GroundGravel_Grass from '../../images/GroundGravel_Grass.png';
import WallRound_Brown from '../../images/WallRound_Brown.png';
import CrateDark_Brown from '../../images/CrateDark_Brown.png';
import CrateDark_Blue from '../../images/CrateDark_Blue.png';
import EndPoint_Blue from '../../images/EndPoint_Blue.png';
import Character from '../../images/Character.png';

export const Square = ({ value, shouldHighlight, resetHighlightCords }: { value: SquareEnum, shouldHighlight: boolean, resetHighlightCords: () => void}) => {
  const info = [
    {
      src: GroundGravel_Grass,
      alt: 'empty space',
    },
    {
      src: WallRound_Brown,
      alt: 'wall',
    },
    {
      src: CrateDark_Brown,
      alt: 'box at empty space',
    },
    {
      src: CrateDark_Blue,
      alt: 'box at valid space',
    },
    {
      src: EndPoint_Blue,
      alt: 'valid space',
    },
    {
      src: Character,
      alt: 'player at empty space',
    },
    {
      src: Character,
      alt: 'player at valid space',
    },
  ];

  if (shouldHighlight) {
    return (
      <img src={info[value].src} alt={info[value].alt} style={{
        height: '100%',
        width: '100%',
        color: 'red',
        filter: `contrast(2)`,
        animation: 'tilt-shaking',
        animationDuration: '150ms',
        animationIterationCount: '4',
      }}
      onAnimationEnd={resetHighlightCords} />
    );
  }

  return (
    <img src={info[value].src} alt={info[value].alt} style={{
      height: '100%',
      width: '100%',
    }} />
  );
}