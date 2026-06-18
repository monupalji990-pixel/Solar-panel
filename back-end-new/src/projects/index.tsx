import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import {
  AuthSlickKey,
  authReducer,
  authActions,
  authFormSaga,
  selectLogged,
} from "./authentication/redux/auth";
import User from "./users";
import Supplier from "./supplier";
import Consumer from "./consumer";
import Dashboard from "./dashboard";
import Lead from "./lead";
import Quote from "./quote";
import Task from "./task";
import TaskBoard from "./taskBoard";
import Appointments from "./appointment";
import Company from "./company";
import Renewal from "./renewal";
import ImportExport from "./importExport";
import Template from "./template";
import digitalDoc from "./digitalDocs";
import Campaign from "./campaign";
import sendinBlueContact from "./sendinblue contacts";
import SurveyForm from "./surveyForm";
import Payments from "./payments";
import Records from "./records";
import Items from "./items";
import Invoice from "./invoice";
import {
  globalConfigReducer,
  globalConfigKeyName,
  ConfigurationSaga,
} from "../sharedUtils/sharedRedux/configuration";
import AuthorizedRoute from "sharedUtils/globalHelper/authorizedRoute";
import Authentication from "./authentication";
import NotFoundPage from "../sharedUtils/sharedSections/404";
import NoPage from "sharedUtils/sharedComponents/SetPage";
import AppBar from "sharedUtils/sharedSections/appBarTemplates/index";
import Snackbar from "../sharedUtils/sharedComponents/snackbar";
import { leadReducer, leadSaga, sliceKeyLead } from "./lead/redux/lead";
import { quoteReducer, quoteSaga, sliceKeyQuote } from "./quote/redux/quote";
import { sliceKeyTask, taskReducer, taskSaga } from "./task/redux/task";
import {
  renewalReducer,
  renewalSaga,
  sliceKeyRenewal,
} from "./renewal/Redux/renewal";
import { siteReducer, siteSaga, sliceKeySite } from "./site/Redux/site";
import {
  contactReducer,
  contactSaga,
  sliceKeyContact,
} from "./contact/redux/contact";
import {
  assigneeReducer,
  assigneeSaga,
  sliceKeyAssignee,
} from "./assignee/redux/assignee";
import {
  companyReducer,
  companySaga,
  sliceKeyCompany,
} from "./company/redux/company";
import {
  sendinblueContactReducer,
  sendinblueContactSaga,
  sliceKeySendinblueContact,
} from "./sendinblue contacts/redux/sendinblueContact";
import { useIdleTimer } from "react-idle-timer";
import {
  itemAdminSaga,
  ItemsAdminReducer,
  sliceKeyItemsAdmin,
} from "./items/redux/itemAdmin";
import {
  InvoiceAdminReducer,
  invoiceAdminSaga,
  sliceKeyInvoiceAdmin,
} from "./invoice/redux/invoiceAdmin";

export default function Index(props) {
  useInjectReducer({ key: globalConfigKeyName, reducer: globalConfigReducer });
  useInjectSaga({ key: globalConfigKeyName, saga: ConfigurationSaga });

  useInjectReducer({ key: AuthSlickKey, reducer: authReducer });
  useInjectSaga({ key: AuthSlickKey, saga: authFormSaga });

  useInjectReducer({ key: sliceKeyLead, reducer: leadReducer });
  useInjectSaga({ key: sliceKeyLead, saga: leadSaga });

  useInjectReducer({ key: sliceKeyQuote, reducer: quoteReducer });
  useInjectSaga({ key: sliceKeyQuote, saga: quoteSaga });

  useInjectReducer({ key: sliceKeyTask, reducer: taskReducer });
  useInjectSaga({ key: sliceKeyTask, saga: taskSaga });
  useInjectReducer({ key: sliceKeyRenewal, reducer: renewalReducer });
  useInjectSaga({ key: sliceKeyRenewal, saga: renewalSaga });

  useInjectReducer({ key: sliceKeySite, reducer: siteReducer });
  useInjectSaga({ key: sliceKeySite, saga: siteSaga });

  useInjectReducer({ key: sliceKeySite, reducer: siteReducer });
  useInjectSaga({ key: sliceKeySite, saga: siteSaga });

  useInjectReducer({ key: sliceKeyContact, reducer: contactReducer });
  useInjectSaga({ key: sliceKeyContact, saga: contactSaga });

  useInjectReducer({ key: sliceKeyAssignee, reducer: assigneeReducer });
  useInjectSaga({ key: sliceKeyAssignee, saga: assigneeSaga });

  useInjectReducer({ key: sliceKeyCompany, reducer: companyReducer });
  useInjectSaga({ key: sliceKeyCompany, saga: companySaga });

  useInjectReducer({
    key: sliceKeySendinblueContact,
    reducer: sendinblueContactReducer,
  });
  useInjectSaga({
    key: sliceKeySendinblueContact,
    saga: sendinblueContactSaga,
  });

  useInjectReducer({ key: sliceKeyItemsAdmin, reducer: ItemsAdminReducer });
  useInjectSaga({ key: sliceKeyItemsAdmin, saga: itemAdminSaga });

  useInjectReducer({ key: sliceKeyInvoiceAdmin, reducer: InvoiceAdminReducer });
  useInjectSaga({ key: sliceKeyInvoiceAdmin, saga: invoiceAdminSaga });

  const dispatch = useDispatch();
  const logged = useSelector(selectLogged);

  const timeout = 600000;
  const timeoutoffline = 1.5e6;

  const [isIdle, setIsIdle] = useState(false);
  const [isIdleOffline, setIsIdleoffline] = useState(false);

  const handleOnActive = () => setIsIdle(false);
  const handleOnIdle = () => setIsIdle(true);

  const handleOnOfflineActive = () => setIsIdleoffline(false);
  const handleOnOfflineIdle = () => setIsIdleoffline(true);

  useIdleTimer({
    timeout,
    onActive: handleOnActive,
    onIdle: handleOnIdle,
  });

  useIdleTimer({
    timeout: timeoutoffline,
    onActive: handleOnOfflineActive,
    onIdle: handleOnOfflineIdle,
  });

  useEffect(() => {
    if (isIdle) {
      dispatch(authActions.socketStatusUpdate("idle"));
    }
  }, [isIdle]);

  useEffect(() => {
    if (isIdleOffline) {
      dispatch(authActions.socketStatusUpdate("notWorking"));
    }
  }, [isIdleOffline]);

  useEffect(() => {
    if (!isIdleOffline && !isIdle) {
      dispatch(authActions.socketStatusUpdate("working"));
    }
  }, [isIdleOffline, isIdle]);

  React.useEffect(() => {
    if (logged == "wait") {
      dispatch(authActions.isLogin(props));
    }
  }, []);
  if (
    logged == "fail" &&
    !(location.pathname.indexOf("/auth") >= 0) &&
    !(location.pathname.indexOf("/lead-data") >= 0)
  ) {
    location.assign("/auth/login");
  }
  return (
    <div>
      <BrowserRouter>
        <Route render={(props) => <AppBar {...props} />} />
        <Switch>
          <Route path="/auth" component={Authentication} />
          <Route path="/lead-data" component={SurveyForm} />
          <AuthorizedRoute
            path="/dashboard"
            component={Dashboard}
            dashboard={true}
          />
          <AuthorizedRoute path="/user" component={User} />
          <AuthorizedRoute path="/supplier" component={Supplier} />
          <AuthorizedRoute path="/consumer" component={Consumer} />
          <AuthorizedRoute path="/company" component={Company} />
          <AuthorizedRoute path="/lead" component={Lead} />
          <AuthorizedRoute path="/items" component={Items} />
          <AuthorizedRoute path="/invoice" component={Invoice} />
          <AuthorizedRoute path="/quote" component={Quote} />
          <AuthorizedRoute path="/appointment" component={Appointments} />
          <AuthorizedRoute path="/task" component={Task} />
          <AuthorizedRoute path="/task-board" component={TaskBoard} />
          <AuthorizedRoute path="/renewal" component={Renewal} />
          <AuthorizedRoute path="/import-export" component={ImportExport} />
          <AuthorizedRoute path="/template" component={Template} />
          <AuthorizedRoute path="/digital-doc" component={digitalDoc} />
          {/* <AuthorizedRoute path="/campaign" component={Campaign} /> */}
          <AuthorizedRoute path="/sendinblue" component={sendinBlueContact} />
          <AuthorizedRoute path="/payments" component={Payments} />
          <AuthorizedRoute path="/record" component={Records} />
          <Route exact path="/" component={NoPage} />
          <Route component={NotFoundPage} />
        </Switch>
        <Snackbar />
      </BrowserRouter>
    </div>
  );
}
