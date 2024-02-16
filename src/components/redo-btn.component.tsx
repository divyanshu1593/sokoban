export const RedoBtn = ({redoState}: {redoState: () => void}) => {
  return (
    <button onClick={redoState}>redo</button>
  );
}
