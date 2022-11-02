import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";


import ResponseResults from "../enums/responseResult";

export default function SpeedDialTools(props) {
  const [openSpeedDial, setOpenSpeedDial] = React.useState(false);

  const handleSpeedDialOpen = (e) => {
    if (e.type !== "focus") {
      setOpenSpeedDial(true);
    }
  };
  const handleSpeedDialClose = () => setOpenSpeedDial(false);

  const actions = [
    { icon: <ListAltIcon />, name: "Program" },
    { icon: <FitnessCenterIcon />, name: "Exercise" },
  ];

  return (
    <div>
      <Backdrop open={openSpeedDial} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleSpeedDialClose}
        onOpen={handleSpeedDialOpen}
        open={openSpeedDial}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => props.onClick(action.name)}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
