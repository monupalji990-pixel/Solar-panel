import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";

export default function ColumnSetting(props) {
  return (
    <Dialog
      open={props.dialog.open}
      onClose={props.closeDialog}
    >
      <DialogTitle>Select Table Columns</DialogTitle>
      <DialogContent>
        <FormControl>
          <InputLabel htmlFor="select-multiple-chip">Columns</InputLabel>
          <Select
            multiple
            value={props.selectedColumn ? props.selectedColumn : []}
            onChange={props.handleChangeColumn}
            input={<Input id="select-multiple-chip" />}
            renderValue={(selected: any) => (
              <div>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </div>
            )}
          >
            {props.columns.map((vs) =>
              vs.Header ? (
                <MenuItem key={vs.Header} value={vs.Header}>
                  <Checkbox
                    checked={props.selectedColumn ? props.selectedColumn.indexOf(vs.Header) > -1 : false}
                    disabled={
                      props.selectedColumn ? props.selectedColumn.indexOf(vs.Header) > -1 &&
                        props.selectedColumn.length == 1 : false
                    }
                  />
                  <ListItemText primary={vs.Header} />
                </MenuItem>
              ) : (
                  ""
                )
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.UpdateCol} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
