import * as React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import db from "../firebaseConfigs";
import { ref, set, get, onValue, query  } from "firebase/database";

class ChipsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chipData: [
        { key: 0, weight: 2.5, variant: "outlined" },
        { key: 1, weight: 5, variant: "outlined" },
        { key: 2, weight: 10, variant: "outlined" },
      ],
    };
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  checkIfOtherChipIsSelectedAndResetIt(chip) {
    const isOtherChipSelected =
      this.state.chipData.filter(
        (x) => x.variant === "filled" && x.key !== chip.key
      ).length > 0;

    if (isOtherChipSelected) {
      this.state.chipData.map((x) => {
        x.variant = "outlined";
        return x;
      });
    }
  }

  handleChipClick(chip) {
    let chipSelected = this.state.chipData
      .filter((x) => x.key === chip.key)
      .pop();

    this.checkIfOtherChipIsSelectedAndResetIt(chip);

    chipSelected.variant =
      chipSelected.variant === "outlined" ? "filled" : "outlined";

    this.setState({ chipData: this.state.chipData });
    this.props.onChangeWeight(
      chipSelected.variant === "filled" ? chipSelected.weight : 0
    );
  }

  render() {
    return (
      <Stack direction="row" spacing={2}>
        {this.state.chipData.map((chip) => (
          <Chip
            key={`${chip.key}`}
            className="kg-chips"
            label={`${chip.weight} Kg`}
            onClick={() => this.handleChipClick(chip)}
            variant={chip.variant}
            sx={{ width: "9ch" }}
            color="info"
            clickable={false}
          />
        ))}
      </Stack>
    );
  }
}

export default ChipsList;
