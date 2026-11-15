import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import TableUserData from "../Components/TableUserData";
import Graph from "../Components/Graph";
import UserInfo from "../Components/UserInfo";
import { useSession } from "../lib/auth-client";
import { fetchResults } from "../lib/api";

const UserPage = () => {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const loadUserData = async () => {
    try {
      const results = await fetchResults();
      const tempGraphData = results.map((item) => [
        new Date(item.timeStamp).toLocaleString().split(",")[0],
        item.wpm,
      ]);
      setData(results);
      setGraphData(tempGraphData.reverse());
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending && user) {
      loadUserData();
    } else if (!isPending && !user) {
      navigate("/");
    }
  }, [isPending, user, navigate]);

  if (isPending || dataLoading) {
    return (
      <div className="center-of-screen">
        <CircularProgress size={300} />
      </div>
    );
  }

  if (!dataLoading && data.length === 0) {
    return (
      <div className="center-of-screen">
        <span>Take some tests then come back!!</span>
      </div>
    );
  }

  return (
    <div className="canvas">
      <UserInfo totalTestTaken={data.length} />
      <div className="graph">
        <Graph graphData={graphData} />
      </div>
      <TableUserData data={data} />
    </div>
  );
};

export default UserPage;
