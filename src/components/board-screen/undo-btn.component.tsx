import UndoLogo from '../../images/undo.svg';

export const UndoBtn = ({undoState}: {undoState: () => void}) => {
  return (
    <abbr title="undo">
      <button className='logo-btn' onClick={undoState}>
        <img src={UndoLogo} alt='undo' height='100%' width='100%'/>
      </button>
    </abbr>
  );
}
