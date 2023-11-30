import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FilledInput from "@mui/material/FilledInput";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import db from "../firebaseConfigs";
import {ref, set} from "firebase/database";
import ResponseResults from "../enums/responseResult";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import enLocale from "date-fns/locale/en-US";
import {getAuth} from "firebase/auth";
import endpoints from "../constants";
import MuscleGroupEnum from "../enums/muscleGroupEnum";
import MuscleGroups from "../enums/muscleGroupEnum";

function ConfirmationDialogRaw(props) {
  const {
    onClose,
    programName: programNameProp,
    open,
    programs,
    ...other
  } = props;
  const [programName, setProgramName] = React.useState(programNameProp);
  const [numberOfDays, setNumberOfDays] = React.useState(3);
  const [openAutocomplete, setOpenAutocomplete] = React.useState(false);
  const [optionsAutocomplete, setOptionsAutocomplete] = React.useState([]);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [isProgramNameAlreadyExists, setIsProgramNameAlreadyExists] = React.useState(false)


  const loadingAutocomplete =
    openAutocomplete && optionsAutocomplete.length === 0;

  React.useEffect(() => {
    if (!open) {
      // Reset all form inputs
      setProgramName(programNameProp);
      setFromDate(null);
      setToDate(null);
    }
  }, [programNameProp, open]);

  const onCancel = () => {
    setIsProgramNameAlreadyExists(false)
    onClose();
  };

  const onSave = () => {
    onClose(programName, fromDate, toDate);
  };

  const onChangeProgramName = (event) => {
    setProgramName(event.target.value);
  };

  const onChangeDaysNumber = (event) => {

  }


  const validateProgramName = (event) => {
    var name = event.target.value;
    var isEqual = Array.from(Object.keys(programs)).filter(x => x === name).length >= 1;
    setIsProgramNameAlreadyExists(isEqual)
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Add new program</DialogTitle>
      <DialogContent dividers>
        <FormControl required fullWidth variant="filled" sx={{ marginTop: 0 }}>
          <InputLabel required htmlFor="filled-adornment-amount" error={isProgramNameAlreadyExists}>
            Program Name
          </InputLabel>
          <FilledInput
            required
            id="filled-adornment-amount"
            value={programName}
            error={isProgramNameAlreadyExists}
            onChange={onChangeProgramName}
            onKeyUp={validateProgramName}
          />
          <FormHelperText id="my-helper-text" error={isProgramNameAlreadyExists}>{isProgramNameAlreadyExists ? "This program already exists!" : ""}</FormHelperText>
        </FormControl>

        <FormControl required fullWidth variant="filled" sx={{ marginTop: 1 }}>
          <InputLabel required htmlFor="filled-adornment-amount">
            Number of Days
          </InputLabel>
          <FilledInput
              required
              id="filled-adornment-amount"
              value={numberOfDays}
              onChange={onChangeDaysNumber}
          />
          {/*<FormHelperText id="my-helper-text" error={isProgramNameAlreadyExists}>{isProgramNameAlreadyExists ? "This program already exists!" : ""}</FormHelperText>*/}
        </FormControl>

        <FormControl sx={{ marginBottom: 2 }} fullWidth>
          <InputLabel id="demo-simple-select-label">
            1st Day
          </InputLabel>
          <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Current program"
              // value={this.state.currentProgram.name}
              // onChange={(event) =>
              //     this.onChangeCurrProgram(event.target.value)
              // }
          >
            {/*{!this.state.currentProgram.name ? (*/}
            {/*    <MenuItem disabled value="">*/}
            {/*      <em>No options. Create a new program first!</em>*/}
            {/*    </MenuItem>*/}
            {/*) : (*/}
            {/*    ""*/}
            {/*)}*/}

            {/*{Object.keys(this.state.programs).map((group) => (*/}
            {/*    <MenuItem*/}
            {/*        value={group}*/}
            {/*        key={group}*/}
            {/*        sx={{ display: "flex", justifyContent: "space-between" }}*/}
            {/*    >*/}
            {/*      {group}*/}
            {/*    </MenuItem>*/}
            {/*))}*/}
          </Select>
        </FormControl>





        <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(from) => {
              setFromDate(from);
            }}
            renderInput={(params) => (
              <TextField
                required
                sx={{ width: "100%", marginTop: 2 }}
                {...params}
              />
            )}
          />
          <DatePicker
            label="To"
            value={toDate}
            onChange={(to) => {
              setToDate(to);
            }}
            renderInput={(params) => (
              <TextField
                required
                sx={{ width: "100%", marginTop: 2 }}
                {...params}
              />
            )}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="warning" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          color="success"
          disabled={!(fromDate && toDate && programName) || isProgramNameAlreadyExists}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  programName: PropTypes.string.isRequired,
};

export default function AddNewProgramDialog(props) {
  const { openNewProgramDialog: open, onCloseProgramDialog, programs } = props;
  const [openPopup, setOpenPopup] = React.useState(open);
  const [programName, setProgramName] = React.useState("");

  React.useEffect(() => {
    setOpenPopup(open);
  }, [open]);

  const handleClose = (program, from, to) => {
    setOpenPopup(false);
    if (program && from && to) {
      saveNewPorgram(program, from, to);
    } else {
      onCloseProgramDialog(ResponseResults.CANCEL);
    }
  };

  /**
   * Save a new Program in the database
   */
  const saveNewPorgram = (program, from, to) => {
    const programsListRef = ref(db, "users/" + getAuth().currentUser.uid + endpoints.PROGRAMS + "/" + program);
    set(programsListRef, {
      dateFrom: from.toLocaleDateString(),
      dateTo: to.toLocaleDateString(),
      name: program,
      exercises: {...Object.keys(MuscleGroups).reduce((acc, muscle) => {
          acc[muscle] = "";
          return acc;
        }, {})}}
    )

      .catch((error) => {
        onCloseProgramDialog(ResponseResults.ERROR, error);
      })
      .finally((res) => {
        onCloseProgramDialog(ResponseResults.SUCCESS);
      });
  };

  return (
    <div>
      <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <ConfirmationDialogRaw
          id="ringtone-menu"
          keepMounted
          open={openPopup}
          onClose={handleClose}
          programName={programName}
          programs={programs}
        />
      </Box>
    </div>
  );
}
