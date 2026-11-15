import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSession } from "../lib/auth-client";

const UserInfo = ({ totalTestTaken }) => {
  const { data: session } = useSession();
  const user = session?.user;

  const joinedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleString()
    : "";

  return (
    <div className="user-profile">
      <div className="user">
        <div className="picture">
          <AccountCircleIcon
            style={{
              display: "block",
              transform: "scale(6)",
              margin: "auto",
              marginTop: "3.5rem",
            }}
          />
        </div>
        <div className="info">
          <div className="email">{user?.email}</div>
          <div className="joined-at">{joinedAt}</div>
        </div>
      </div>
      <div className="total-tests">
        <span>Total Test Taken - {totalTestTaken}</span>
      </div>
    </div>
  );
};

export default UserInfo;
