import { Ranking } from "../../interface/ranking.interface";
import NotFountIcon from '../../images/not-found.png';

export const RankingTable = ({ ranking }: { ranking: Ranking[] }) => {
  if (ranking.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
        justifyContent: 'center',
      }}>
        <div style={{
          height: '50%',
          margin: '0 auto',
        }}>
          <img src={NotFountIcon} alt="not found" height='100%' width='100%'/>
        </div>
        <div className="message">
          Be The First One To Clear This Level
        </div>
      </div>
    );
  }

  const tableRows = ranking.map(row => {
    return (
      <tr>
        <td>{row.username}</td>
        <td>{row.minNumOfMoves}</td>
      </tr>
      );
  });

  return (
    <table id="ranking-table">
      <tr>
        <th>Username</th>
        <th>Minimum Number of Moves</th>
      </tr>
      {tableRows}
    </table>
  );
}
