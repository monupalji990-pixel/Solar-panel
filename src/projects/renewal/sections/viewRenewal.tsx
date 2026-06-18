import React, { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { renewalAction, selectRenewalState } from "../Redux/renewal";
import {
  globalConfigActions,
  selectGlobalConfig,
} from "sharedUtils/sharedRedux/configuration";
import RenewalActions from "./renewalActions";
import ViewEnergy from "../../quote/sections/view/energy";
import ViewChipAndPin from "../../quote/sections/view/chipandpin";
import ViewGas from "../../quote/sections/view/gas";
import ViewElectric from "../../quote/sections/view/electric";
import ViewWater from "../../quote/sections/view/water";
import ViewWaste from "../../quote/sections/view/waste";
import ViewTelecoms from "../../quote/sections/view/telecoms";
import ViewBroadband from "../../quote/sections/view/broadband";
import ViewInsurance from "../../quote/sections/view/insurance";
import ViewBusinessRates from "../../quote/sections/view/businessRates";
import ViewTeleBroad from "../../quote/sections/view/teleBroad";
import { Common as HistoryTable } from "../../history/loadable/Common";
import Notes from "../../../sharedUtils/sharedComponents/notes";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { selectAssigneeState, assigneeAction } from "projects/assignee/redux/assignee";
import { AM } from '../../../sharedUtils/globalHelper/constantValues';
import Assignee from "./assignee";
import { Common as DigitalDocList } from "../../digitalDocs/loadable/Common";

const useStyles = makeStyles(() => ({
  Spacing: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  TypoSpace: {
    padding: "10px",
  },
}));

export default function ViewRenewal(props) {
  return (
    <MyDrawer
      drawerSize="1250px"
      iconName="Renewal"
      open={props.open == "editRenewal"}
      onClose={props.onClose.bind(this)}
    >
      <RenewalDetail {...props} />
    </MyDrawer>
  );
}

function RenewalDetail(props) {

  const renewalState = useSelector(selectRenewalState);

  const { currentQuote, isLoadingData, hideSideBar } = {
    ...renewalState,
  };

  const dispatch = useDispatch();

  const _addNotes = (payload) => dispatch(renewalAction.AddNote(payload));
  const _viewSingleQuote = (payload) =>
    dispatch(renewalAction.viewSigleRenewal(payload));
  const _isLoadingData = (payload) =>
    dispatch(renewalAction.setIsLoadingData(payload));
  const _slugUpdate = (payload) => dispatch(renewalAction.SlugUpdate(payload));
  const _closeSideBar = (payload) =>
    dispatch(renewalAction.CloseSideBar(payload));
  const _supplierList = (payload) =>
    dispatch(globalConfigActions.supplierList(payload));

  useEffect(() => {
    _isLoadingData(true);
    _slugUpdate(props);
    _supplierList(props);
    _viewSingleQuote({ quoteId: props.renewal._id });
    if (AM.includes(props.slug)) {
      dispatch(assigneeAction.list(null))
    }
  }, []);

  const [selectedTab, setSelectedTab] = React.useState("general");
  const [selectedNoteTabs, setselectedNoteTabs] = React.useState("comment");
  const { serviceType } = props.renewal;

  const classes = useStyles();

  if (hideSideBar) {
    props.onClose();
    _closeSideBar(false);
  }

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabHandleChangeNote = (event, newValue) => {
    setselectedNoteTabs(newValue);
  };

  const addNotes = (data, v) => {
    data.append("id", currentQuote._id);
    _addNotes(data);
  };

  let qp = 0;
  if (currentQuote) {
    qp = currentQuote.Price;
  }

  if (isLoadingData) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div className="txt-uppercase app">
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Paper>
            <Tabs
              value={selectedTab}
              onChange={tabHandleChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="General" value="general" />
              <Tab label="History" value="history" />
              {currentQuote?.Company && !['service_partner'].includes(props.slug) && <Tab label="E-Sign docs" value="digitalDocs" />}
            </Tabs>
          </Paper>
        </Grid>

        <>
          <Grid item xs={12} md={6}>
            {selectedTab === "general" && (
              <Grid container className={classes.Spacing}>
                <Grid item xs={12} md={12}>
                  <Typography
                    variant="h5"
                    className={classes.TypoSpace}
                    gutterBottom
                  >
                    Service Type : {serviceType}
                    {qp !== undefined && Number(qp) > 0 && ` | Price : £ ${qp}`}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {/* {selectedTab === "general" && serviceType === "Mortgage" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewMortgage {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {selectedTab === "general" && serviceType === "Funeral" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewFuneral {...props} currentQuote={currentQuote} />
              </Suspense>
            )} */}
            {selectedTab === "general" && serviceType === "Energy" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewEnergy {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {selectedTab === "general" && serviceType === "Gas" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewGas {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {selectedTab === "general" && serviceType === "Electric" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewElectric {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {selectedTab === "general" && serviceType === "TelecomAndBroadband" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewTeleBroad {...props} currentQuote={currentQuote} />
              </Suspense>
            )}

            {selectedTab === "general" && serviceType === "Water" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewWater {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {selectedTab === "general" && serviceType === "ChipAndPin" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewChipAndPin {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {selectedTab === "general" && serviceType === "Telecoms" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewTelecoms {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {selectedTab === "general" && serviceType === "Broadband" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewBroadband {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {selectedTab === "general" && serviceType === "Waste" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewWaste {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {selectedTab === "general" && serviceType === "Insurance" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewInsurance {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {selectedTab === "general" && serviceType === "BusinessRates" && (
              <Suspense fallback={<>Loading...</>}>
                <ViewBusinessRates {...props} currentQuote={currentQuote} />
              </Suspense>
            )}
            {AM.includes(props.slug) &&
              selectedTab === "general" && (
                <Suspense fallback={<>Loading...</>}>
                  <Assignee {...props} />
                </Suspense>
              )}
          </Grid>

          {selectedTab === "general" && (
            <Grid item xs={12} md={6}>
              <Paper>
                <Tabs
                  className="notesTabStyle"
                  variant="scrollable"
                  scrollButtons="auto"
                  value={selectedNoteTabs}
                  onChange={tabHandleChangeNote}
                  aria-label="simple tabs example"
                >
                  <Tab label="Comment" value="comment" />
                  <Tab label="Action" value="action" />
                </Tabs>
              </Paper>
              {selectedNoteTabs === "comment" && (
                <Suspense fallback={<>Loading...</>}>
                  <Notes
                    addNotes={(e, v) => addNotes(e, v)}
                    notesComment={currentQuote.Notes}
                  ></Notes>
                </Suspense>
              )}
              {selectedNoteTabs === "action" && (
                <Suspense fallback={<>Loading...</>}>
                  <RenewalActions {...props} />
                </Suspense>
              )}

            </Grid>
          )}
        </>

        {selectedTab === "history" && (
          <Suspense fallback={<>Loading...</>}>
            <HistoryTable {...props} historyFor="Renewal" showingFrom="viewRenewal" />
          </Suspense>
        )}

        {selectedTab === "digitalDocs" && (
          <Suspense fallback={<>Loading...</>}>
            <DigitalDocList {...props} showingFrom="viewRenewal" />
          </Suspense>
        )}
      </Grid>
    </div>
  );
}
