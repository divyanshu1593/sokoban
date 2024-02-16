export const UndoBtn = ({undoState}: {undoState: () => void}) => {
  return (
    <button onClick={undoState}>undo</button>
  );
}
