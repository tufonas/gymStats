import * as React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ResponseResults from "../enums/responseResult";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import enLocale from "date-fns/locale/en-US";
import DatePicker from "@mui/lab/DatePicker";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";


function ConfirmationDialogRaw({
                                   onClose,
                                   open,
                                   programs,
                                   currentProgram,
                                   onAddNewProgram
                               }) {

    const [dialogCurrentProgram, setDialogCurrentProgram] = React.useState(currentProgram);
    const [fromDate, setFromDate] = React.useState(currentProgram ? currentProgram.dateFrom : "");
    const [toDate, setToDate] = React.useState(currentProgram ? currentProgram.dateTo : "");


    React.useEffect(() => {
        if(currentProgram){
            setDialogCurrentProgram(currentProgram);
            setFromDate(currentProgram.dateFrom);
            setToDate(currentProgram.dateTo);
        }

        if(!currentProgram?.name) {
            setFromDate(null);
            setToDate(null);
        }
    }, [currentProgram, open])


    const onCancel = () => {
        onClose(ResponseResults.CANCEL, currentProgram);
    };

    const onSave = () => {
        onClose(ResponseResults.SUCCESS, dialogCurrentProgram);
    };

    function onChangeCurrProgram(currProgramName) {

        if (currProgramName) {
            setDialogCurrentProgram(programs[currProgramName]);
            setFromDate(programs[currProgramName].dateFrom);
            setToDate(programs[currProgramName].dateTo);
        }

    }

    return (
        <Dialog
            sx={{"& .MuiDialog-paper": {width: "80%", maxHeight: 435}}}
            maxWidth="xs"
            open={open}
        >
            <DialogTitle>Program Details </DialogTitle>
            <DialogContent dividers>
                <FormControl sx={{marginBottom: 2}} fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        Current program
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Current program"
                        value={dialogCurrentProgram.name}
                        onChange={(event) =>
                            onChangeCurrProgram(event.target.value)
                        }
                    >
                        {!dialogCurrentProgram.name ? (
                            <MenuItem disabled value="">
                                <em>No options. Create a new program first!</em>
                            </MenuItem>
                        ) : (
                            ""
                        )}

                        {Object.keys(programs).map((group) => (
                            <MenuItem
                                value={group}
                                key={group}
                                sx={{display: "flex", justifyContent: "space-between"}}
                            >
                                {group}
                            </MenuItem>
                        ))}

                        <MenuItem>
                            <ListItemIcon>
                                <AddIcon fontSize="small"/>
                            </ListItemIcon>
                            <ListItemText sx={{color: "grey"}}
                                onClick={onAddNewProgram}
                            >Add new Program</ListItemText>
                        </MenuItem>
                    </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                    <DatePicker
                        label="From"
                        value={fromDate}
                        onChange={(from) => {
                            console.log(from)
                            setFromDate(from)
                            dialogCurrentProgram['dateFrom'] = from.toLocaleDateString();
                        }}
                        renderInput={(params) => (
                            <TextField
                                required
                                sx={{width: "100%", marginTop: 2}}
                                {...params}
                            />
                        )}
                    />
                    <DatePicker
                        label="To"
                        value={toDate}
                        onChange={(to) => {
                            setToDate(to);
                            dialogCurrentProgram['dateTo'] = to.toLocaleDateString();
                        }}
                        renderInput={(params) => (
                            <TextField
                                required
                                sx={{width: "100%", marginTop: 2}}
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
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function ProgramDetailsDialog({
                                                 openProgramDetailsDialog,
                                                 onCloseProgramDetailsDialog,
                                                 programs,
                                                 currentProgram,
                                                 onAddNewProgram
                                             }) {

    return (<div>
            <Box sx={{width: "100%", maxWidth: 360, bgcolor: "background.paper"}}>
                <ConfirmationDialogRaw
                    id="ringtone-menu"
                    keepMounted
                    open={openProgramDetailsDialog}
                    onClose={onCloseProgramDetailsDialog}
                    programs={programs}
                    currentProgram={currentProgram}
                    onAddNewProgram={onAddNewProgram}
                />
            </Box>
        </div>
    )
}



