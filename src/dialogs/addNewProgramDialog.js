import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MuscleGroups from "../enums/muscleGroupEnum";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import db from "../firebaseConfigs";
import { ref, set, get, onValue, query, push } from "firebase/database";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { map, from, mergeMap, of, switchMap, take, concatMap } from "rxjs";
import ResponseResults from "../enums/responseResult";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import enLocale from "date-fns/locale/en-US";

function ConfirmationDialogRaw(props) {
  const {
    onClose,
    programName: programNameProp,
    open,
    programs,
    ...other
  } = props;
  const [programName, setProgramName] = React.useState(programNameProp);
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
    const programsListRef = ref(db, "programs/" + program);
    set(programsListRef, {
      dateFrom: from.toLocaleDateString(),
      dateTo: to.toLocaleDateString(),
      name: program
    })
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
