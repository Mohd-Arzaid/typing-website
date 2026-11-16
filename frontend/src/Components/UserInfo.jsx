import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSession } from "../lib/auth-client";

const UserInfo = ({ totalTestTaken }) => {
  const { data: session } = useSession();
  const user = session?.user;

  const joinedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleString()
    : "";

  return (
    <div className="mx-auto flex w-full max-w-site flex-col items-center justify-center rounded-xl bg-[var(--kbd-bg)] text-center md:min-h-60 md:flex-row">
      <div className="flex w-full items-center gap-4 border-border p-6 md:w-1/2 md:border-r md:border-b-0 border-b">
        <div className="flex w-2/5 justify-center text-accent">
          <AccountCircleIcon sx={{ fontSize: 72 }} />
        </div>
        <div className="w-3/5 p-2 text-left text-correct">
          <div className="break-all text-lg font-semibold">{user?.email}</div>
          <div className="mt-1 text-sm text-muted">{joinedAt}</div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center p-6 font-mono text-2xl text-correct md:w-1/2 md:text-3xl">
        <span>Total Test Taken - {totalTestTaken}</span>
      </div>
    </div>
  );
};

export default UserInfo;
