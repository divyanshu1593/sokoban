import RedoLogo from '../../images/redo.svg';

export const RedoBtn = ({ redoState, isDisabled }: { redoState: () => void, isDisabled: boolean }) => {
  if (isDisabled) {
    return (
      <abbr title="redo">
        <button className='logo-btn'>
          <img src={RedoLogo} alt='redo' height='100%' width='100%' style={{
            filter: `contrast(0.5)`,
          }}/>
        </button>
      </abbr>
    );
  }
  
  return (
    <abbr title="redo">
      <button className='logo-btn' onClick={redoState}>
        <img src={RedoLogo} alt='redo' height='100%' width='100%'/>
      </button>
    </abbr>
  );
}
