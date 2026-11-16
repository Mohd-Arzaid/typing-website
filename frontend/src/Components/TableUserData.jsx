import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "../Context/ThemeContext";

const TableUserData = ({ data }) => {
  const { theme } = useTheme();
  const cellStyle={ color: theme.textColor, textAlign: "center" };
  return (
    <div className="w-full overflow-x-auto">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={cellStyle}>
                WPM
              </TableCell>
              <TableCell style={cellStyle}>
                Accuracy
              </TableCell>
              <TableCell style={cellStyle}>
                Characters
              </TableCell>
              <TableCell style={cellStyle}>
                Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((i, index) => (
              <TableRow key={index}>
                <TableCell style={cellStyle}>{i.wpm}</TableCell>
                <TableCell style={cellStyle}>{i.accuracy}</TableCell>
                <TableCell style={cellStyle}>{i.characters}</TableCell>
                <TableCell style={cellStyle}>{new Date(i.timeStamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableUserData;
