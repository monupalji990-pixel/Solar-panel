import React from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import SyncIcon from "@material-ui/icons/Sync";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { leadAction } from "projects/lead/redux/lead";
import FilterListIcon from "@material-ui/icons/FilterList";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";

export default function QuoteBoardHeader(props) {
  const dispatch = useDispatch();

  const refreshData = () => {
    const h: any = {};
    h.limit = 100;
    dispatch(leadAction.LoaderStart(false));
    dispatch(leadAction.BasicActions({ quoteCount: -1 }));
    dispatch(leadAction.ChangeLimit(h));
  };

  const backToQuote = () => {
    window.location.reload();
  };

  return (
    <div className="task_board_header">
      <Grid container spacing={3} style={{ alignItems: "center" }}>
        <Grid item>
          <span className="task_board_title">Lead Board</span>
        </Grid>

        <Grid item className="task_board_head_radio">
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="role-wise-task"
              name="role-wise-task"
              onChange={(e) => {
                props.handleChangeLeadRadio(e.target.value);
              }}
              defaultValue="solar"
            >
              <FormControlLabel
                value="solar"
                control={<Radio color="primary" />}
                label="PAID SOLAR"
              />
              <FormControlLabel
                value="eco4"
                control={<Radio color="primary" />}
                label="ECO4"
              />
              <FormControlLabel
                value="b2b"
                control={<Radio color="primary" />}
                label="B2B"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item style={{ marginLeft: "auto" }}>
          <Button
            color="primary"
            variant="contained"
            style={{ minWidth: "auto" }}
            onClick={props.setFilterDrawer}
          >
            <FilterListIcon />
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            style={{ minWidth: "auto" }}
            onClick={backToQuote}
          >
            <ArrowBackIcon />
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            style={{ minWidth: "auto" }}
            onClick={refreshData}
          >
            <SyncIcon />
          </Button>
        </Grid>

        {!props.loader && (
          <Grid item>
            <CircularProgress />
          </Grid>
        )}
      </Grid>
    </div>
  );
}
