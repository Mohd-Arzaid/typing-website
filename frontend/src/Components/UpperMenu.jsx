import { useTestMode } from "../Context/TestModeContext";

const UpperMenu = ({ countDown }) => {
  const { testTime, setTestTime } = useTestMode();

  const updateTime = (e) => {
    setTestTime(Number(e.target.id));
  };

  return (
    <div className="upper-menu">
      <div className="counter">{countDown}</div>

      <div className="modes">
        {[15, 30, 60].map((time) => (
          <div
            key={time}
            className={`time-mode${testTime === time ? " active" : ""}`}
            id={time}
            onClick={updateTime}
          >
            {time}s
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpperMenu;
