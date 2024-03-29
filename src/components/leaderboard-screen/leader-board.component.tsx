import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Ranking } from "../../interface/ranking.interface";
import { RankingTable } from "./ranking-table.component";
import LoadingGif from '../../images/loading.svg';

export const Leaderboard = () => {
  const location = useLocation();
  const [ranking, setRanking] = useState<Ranking[] | null>(null);
  const level = +location.pathname.split('/').at(-1)!;

  const updateRanking = useCallback(async () => {
    const res = await (await fetch(`${process.env.REACT_APP_BACKEND_URL}/get-ranking/${level}`)).json();
    if (res.isError) throw new Error(res.message);

    setRanking(res.data);
  }, [level]);

  useEffect(() => {
    updateRanking();
  }, [updateRanking]);

  if (level < 1 || level > 100 || isNaN(level)) {
    return <Navigate replace to={'/'}/>
  }

  if (ranking) {
    return (
    <>
      <div className="message">Leaderboard</div>
      <RankingTable ranking={ranking}/>
    </>
    );
  }

  return (
    <>
      <div className="message">Leaderboard</div>
      <div style={{
        margin: 'auto',
      }}>
        <img src={LoadingGif} alt="Loading" style={{
          backgroundColor: 'rgb(0, 0, 0, 0)',
        }} />
      </div>
    </>
  );
}
