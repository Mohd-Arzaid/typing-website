import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import TableUserData from "../Components/TableUserData";
import Graph from "../Components/Graph";
import UserInfo from "../Components/UserInfo";
import Header from "../Components/Header";
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
      <div className="flex min-h-screen items-center justify-center text-center text-3xl text-muted">
        <CircularProgress size={120} sx={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (!dataLoading && data.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center text-2xl text-muted">
        <span>Take some tests then come back!!</span>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-site flex-col gap-6 px-6 py-0">
      <Header />
      <UserInfo totalTestTaken={data.length} />
      <div className="w-full">
        <Graph graphData={graphData} />
      </div>
      <div className="w-full overflow-x-auto pb-6">
        <TableUserData data={data} />
      </div>
    </div>
  );
};

export default UserPage;
