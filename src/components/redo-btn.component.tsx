import RedoLogo from '../images/redo.svg';

export const RedoBtn = ({redoState}: {redoState: () => void}) => {
  return (
    <button className='logo-btn' onClick={redoState}>
      <img src={RedoLogo} alt='redo' height='100%' width='100%'/>
    </button>
  );
}
