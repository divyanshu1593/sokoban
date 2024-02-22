import UndoLogo from '../../images/undo.svg';

export const UndoBtn = ({ undoState, isDisabled }: { undoState: () => void, isDisabled: boolean }) => {
  if (isDisabled) {
    return (
      <abbr title="undo">
        <button className='logo-btn'>
          <img src={UndoLogo} alt='undo' height='100%' width='100%' style={{
            filter: `contrast(0.5)`,
          }}/>
        </button>
      </abbr>
    );
  }

  return (
    <abbr title="undo">
      <button className='logo-btn' onClick={undoState}>
        <img src={UndoLogo} alt='undo' height='100%' width='100%'/>
      </button>
    </abbr>
  );
}
