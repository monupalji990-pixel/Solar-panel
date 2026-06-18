import React, { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import ViewChipAndPin from "./view/chipandpin";
import ViewGas from "./view/gas";
import ViewDebt from "./view/debt";
import ViewElectric from "./view/electric";
import ViewWater from "./view/water";
import ViewTelecoms from "./view/telecoms";
import ViewFuneral from "./view/funeral";
import ViewMortgage from "./view/mortgage";
import ViewSolarPaid from "./view/solarpaid";
import ViewBroadband from "./view/broadband";
import ViewWaste from "./view/waste";
import ViewInsurance from "./view/insurance";
import ViewBusinessRates from "./view/businessRates";
import ViewTeleBroad from "./view/teleBroad";
import ViewEco from "./view/eco";
import Assignee from "./assignee";
import { Common as TaskList } from "../../task/loadable/Common";
import { Common as HistoryTable } from "../../history/loadable/Common";
import QuoteActions from "./quoteActions";
import DocusignActions from "./docusignActions";
import ViewEnergy from "./view/energy";
import Notes from "../../../sharedUtils/sharedComponents/notes";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { AMPS, AM } from "../../../sharedUtils/globalHelper/constantValues";
import { quoteAction, selectQuoteState } from "../redux/quote";
import { Common as DigitalDocList } from "../../digitalDocs/loadable/Common";
import { Common as ConsumerDigitalDocList } from "../../digitalDocsConsumer/loadable/Common";
import PaymentHistory from '../sections/paymentHistory';
import Payments from "./PaymentsList";
import HistoryNotes from "./notes";
import PhotoGallery from "./photoGallery";
import AppointmentDetail from '../sections/appointment';
import OpenSolar from '../component/openSolar';
import QuoteDigitalDashboard from '../../lead/sections/leadDigitalDashboard';
import QuoteDigitalDashboardPaidSolar from '../../lead/sections/leadDigitalDashboardPaidSolar';

const useStyles = makeStyles(() => ({
  Spacing: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  TypoSpace: {
    paddingBottom: 10,
  },
}));

export default function ViewQuote(props) {
  const ds =
    props.showingFrom &&
      ["viewCompany", "viewConsumer", "viewSupplier"].includes(props.showingFrom)
      ? "1100px"
      : "90vw";
  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Quote"
      open={props.open == "manageQuoteDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <ViewQuoteLogic {...props} />
    </MyDrawer>
  );
}

function ViewQuoteLogic(props) {

  const dispatch = useDispatch();

  useEffect(() => {
    props._isLoadingData(true, props.type);
    props._slugUpdate(props);
    props._viewSingleQuote({ quoteId: props.quote._id });
    props._supplierListForDropdown();
    if (props.type === "quote" && AM.includes(props.slug))
      props._assigneeList();
  }, []);

  const [selectedTab, setSelectedTab] = React.useState("general");
  const [selectedNoteTabs, setselectedNoteTabs] = React.useState("notes");

  let { serviceType } = props.quote;
  if (serviceType && serviceType.includes("Eco")) {
    serviceType = "Eco"
  }
  const classes = useStyles();

  if (props.hideSideBar) {
    props.onClose();
    props._closeSideBar(false);
  }


  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const restartQuote = (quoteId) => {
    props._isLoadingData(true);
    props._restartQuote(quoteId);
  };

  const addNotes = (data) => {
    data.append("id", props.currentQuote._id);
    props._addNotes(data);
  };

  const tabHandleChangeNote = (event, newValue) => {
    setselectedNoteTabs(newValue);
  };
  const addRenewalFromQuote = () => {
    dispatch(
      quoteAction.addRenewalFromQuote({ QuoteID: props.currentQuote._id })
    );
  };

  const createDuplicateQuote = () => {
    dispatch(
      quoteAction.createDuplicateQuote({ QuoteID: props.currentQuote._id })
    );
  };
  let qp = 0;
  if (props.currentQuote) {
    qp = props.currentQuote.quotePrice;
  }

  if (props.isLoadingData) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} className="txt-uppercase">
      <Grid item xs={12} md={12}>
        <Paper>
          <Tabs
            value={selectedTab}
            onChange={tabHandleChange}
            aria-label="simple tabs example"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="General" value="general" />
            {AM.includes(props.slug) && ["quote"].includes(props.type) && (
              <Tab label="View Task" value="task" />
            )}
            <Tab label="History" value="history" />
            <Tab label="Payment History" value="paymentHistory" />
            {props.currentQuote?.Company && !['service_partner'].includes(props.slug) && <Tab label="E-Sign docs" value="digitalDocs" />}
            {props.currentQuote?.Consumer && !['service_partner'].includes(props.slug) && <Tab label="E-Sign docs" value="digitalDocsConsumer" />}
            {(props.currentQuote?.serviceType === 'PaidSolar' || props.currentQuote?.subServiceType?.includes('Solar')) &&
              <Tab label="OpenSolar" value="opensolar" />
            }
            {props.currentQuote?.Consumer && (props.currentQuote?.serviceType === 'Eco') &&
              (<Tab label="Digital Dashboard" value="digitalDashboard" />)
            }
            {props.currentQuote?.Consumer && (props.currentQuote?.serviceType === 'PaidSolar') &&
              (<Tab label="Digital Dashboard" value="digitalDashboardPaidSolar" />)
            }
            {props.currentQuote?.Company && (props.currentQuote?.serviceType === 'PaidSolar') &&
              (<Tab label="Digital Dashboard" value="digitalDashboardPaidSolar" />)
            }
          </Tabs>
        </Paper>
      </Grid>

      <>
        <Grid item xs={12} md={6}>
          {selectedTab === "general" && (
            <Grid item xs={12} md={12}>
              <Typography variant="h5" className={classes.TypoSpace}>
                Service Type : {serviceType}
                {qp !== undefined && Number(qp) > 0 && ` | Price : £ ${qp}`}
              </Typography>
              {AMPS.includes(props.slug) && (serviceType !== "PaidSolar") && (serviceType !== "Debt") && (serviceType !== "Eco") && (
                <Button
                  size="medium"
                  variant="contained"
                  onClick={addRenewalFromQuote}
                  color="primary"
                  style={{ margin: "10px 10px 10px 0" }}
                >
                  Create Renewal
                </Button>
              )}
              {AMPS.includes(props.slug) && (
                <Button
                  size="medium"
                  variant="contained"
                  onClick={createDuplicateQuote}
                  color="primary"
                  style={{ margin: "10px 10px 10px 0" }}
                >
                  Duplicate Quote
                </Button>
              )}

              {props.currentQuote &&
                Number(props.currentQuote.quoteStatus) === 1008 && (
                  <CardActions
                  >
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => restartQuote(props.currentQuote._id)}
                    >
                      Restart Quote
                    </Button>
                  </CardActions>
                )}
            </Grid>
          )}
          {selectedTab === "general" && serviceType === "Gas" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewGas {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Electric" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewElectric {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Debt" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewDebt {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Water" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewWater {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "ChipAndPin" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewChipAndPin {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Telecoms" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewTelecoms {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Broadband" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewBroadband {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Energy" && (
            <Suspense fallback={<>Loading...</>}>
              {" "}
              <ViewEnergy {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Funeral" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewFuneral {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Mortgage" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewMortgage {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Waste" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewWaste {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Insurance" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewInsurance {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "BusinessRates" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewBusinessRates {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "TelecomAndBroadband" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewTeleBroad {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && serviceType === "Eco" && (
            <Suspense fallback={<>Loading...</>}>
              <ViewEco {...props} />
            </Suspense>
          )}
          {selectedTab === "general" && (serviceType === "PaidSolar") && (
            <Suspense fallback={<>Loading...</>}>
              <ViewSolarPaid {...props} />
            </Suspense>
          )}


          {AM.includes(props.slug) &&
            ["quote"].includes(props.type) &&
            selectedTab === "general" && (
              <Suspense fallback={<>Loading...</>}>
                {" "}
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
                <Tab label="Notes" value="notes" />
                <Tab label="Comment" value="comment" />
                <Tab label="Action" value="action" />

                {props.currentQuote?.subServiceType?.includes('Solar') &&
                  <Tab label="Appointment" value="appointment" />
                }
                {AM.includes(props.slug) && (
                  <Tab label="DocuSign" value="docusign" />
                )}
                {serviceType === "Debt" && AM.includes(props.slug) &&
                  <Tab label="Debt Installments Status" value="payment" />
                }
                {serviceType === "Eco" &&
                  <Tab label="Gallery" value="gallery" />
                }
              </Tabs>
            </Paper>

            {selectedNoteTabs === "notes" && (
              <Suspense fallback={<>Loading...</>}>
                <HistoryNotes data={props.currentQuote} />
              </Suspense>
            )}
            {selectedNoteTabs === "appointment" && (
              <Suspense fallback={<>Loading...</>}>
                <AppointmentDetail data={props.currentQuote} />
              </Suspense>
            )}
            {selectedNoteTabs === "comment" && (
              <Suspense fallback={<>Loading...</>}>
                {" "}
                <Notes
                  addNotes={(e) => addNotes(e)}
                  notesComment={props.currentQuote.Notes}
                ></Notes>
              </Suspense>
            )}
            {selectedNoteTabs === "action" && ["quote"].includes(props.type) && (
              <Suspense fallback={<>Loading...</>}>
                <QuoteActions {...props} />
              </Suspense>
            )}
            {selectedNoteTabs === "docusign" && (
              <Suspense fallback={<>Loading...</>}>
                {" "}
                <DocusignActions
                  {...props}
                  docusignHistory={props.currentQuote.docusignHistory}
                />
              </Suspense>
            )}

            {selectedNoteTabs === "payment" && (
              <Suspense fallback={<>Loading...</>}>
                <Payments
                  {...props}
                  newLoader={props.newLoader}
                  loadingState={props.loadingState}
                  _DeleteDeptPayment={props._DeleteDeptPayment}
                  paymentData={props.currentQuote.debtpayments}
                  _isLoadingData={props._isLoadingData}
                  _slugUpdate={props._slugUpdate}
                  _viewSingleQuote={props._viewSingleQuote}
                />
              </Suspense>
            )}

            {selectedNoteTabs === "gallery" && (
              <PhotoGallery {...props} />
            )}

            {selectedNoteTabs === "opensolar" && (
              <Suspense fallback={<>Loading...</>}>
                <OpenSolar data={props.currentQuote} />
              </Suspense>
            )}
          </Grid>
        )}
      </>

      <>
        {selectedTab === "task" && (
          <Grid item xs={12} md={12}>
            <Suspense fallback={<>Loading...</>}>
              <TaskList
                {...props}
                showingFrom="viewQuote"
                isCreatedFrom="Quote"
              />
            </Suspense>
          </Grid>
        )}
      </>

      {selectedTab === "history" && (
        <>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<>Loading...</>}>
              <HistoryTable {...props} historyFor="Quote" showingFrom="viewQuote" />
            </Suspense>
          </Grid>
        </>
      )}

      {selectedTab === "paymentHistory" && (
        <>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<>Loading...</>}>
              <PaymentHistory {...props} showingFrom="viewQuote" />
            </Suspense>
          </Grid>
        </>
      )}

      {selectedTab === "digitalDocs" && (
        <Suspense fallback={<>Loading...</>}>
          <DigitalDocList {...props} showingFrom="viewQuote" />
        </Suspense>
      )}

      {selectedTab === 'digitalDocsConsumer' && (
        <Suspense fallback={<>Loading...</>}>
          <ConsumerDigitalDocList {...props} showingFrom="viewQuote" />
        </Suspense>
      )}

      {selectedTab === 'opensolar' && (
        <Suspense fallback={<>Loading...</>}>
          <OpenSolar {...props} showingFrom="viewQuote" />
        </Suspense>
      )}

      {selectedTab === 'digitalDashboard' && (
        <Suspense fallback={<>Loading...</>}>
          <QuoteDigitalDashboard {...props} showingFrom="viewQuote" assigneeList={props.assignee} />
        </Suspense>
      )}

      {selectedTab === 'digitalDashboardPaidSolar' && (
        <Suspense fallback={<>Loading...</>}>
          <QuoteDigitalDashboardPaidSolar {...props} showingFrom="viewQuote" assigneeList={props.assignee} />
        </Suspense>
      )}

    </Grid>
  );
}
