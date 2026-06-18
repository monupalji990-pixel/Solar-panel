import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { appointmentAction, selectAppointmentState } from "../redux/appointment";
import AddAppointment from "../sections/addAppointmentSimple";
import { quoteAction, selectQuoteState } from "../../quote/redux/quote";
import { appointmentReducer, appointmentSaga, sliceKeyAppointment } from "../redux/appointment";
import { useInjectReducer, useInjectSaga } from "redux-injectors";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";

export const CommonSimple = (props: any) => {
  useInjectReducer({ key: sliceKeyAppointment, reducer: appointmentReducer });
  useInjectSaga({ key: sliceKeyAppointment, saga: appointmentSaga });

  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState("");
  const [setDrawerCal, setSetDrawerCal] = useState("");
  const [filter, setFilter] = useState({});
  const [otherData, setOtherData] = useState({});
  const [showSearch, setShowSearch] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  const appointmentState = useSelector(selectAppointmentState);
  const quoteState = useSelector(selectQuoteState);

  const _slugUpdate = (payload) => dispatch(appointmentAction.SlugUpdate(payload));
  const _basicActions = (payload) => dispatch(appointmentAction.BasicActions(payload));
  const _closeSideBar = (payload) => dispatch(appointmentAction.CloseSideBar(payload));
  const _userListAppointment = (payload) => dispatch(appointmentAction.userListAppointment(payload));
  const _addAppointment = (payload) => dispatch(appointmentAction.addAppointment(payload));
  const _companyListForDropdown = (payload) => dispatch(appointmentAction.CompanyListData(payload));
  const _consumerDropList = (payload) => dispatch(appointmentAction.ConsumerList(payload));
  const _leadListForDropdown = (payload) => dispatch(quoteAction.dropDownLeadList(payload));
  const _ResetInitialState = (payload) => dispatch(appointmentAction.ResetInitialState(payload));

  function closeDrawer() {
    const { isCloseAppointment } = props;
    isCloseAppointment();
    setDrawerOpen(false);
  }

  return (
    <>
      <MyDrawer
        drawerSize="550px"
        iconName="Appointment"
        open={drawerOpen}
        onClose={closeDrawer}
      >
        <AddAppointment
          {...props}
          getUserTable={getUserTable}
          onClose={closeDrawer}
          _closeSideBar={_closeSideBar}
          _slugUpdate={_slugUpdate}
          _addAppointment={_addAppointment}
          leads={quoteState.leads}
          availableUsers={appointmentState.availableUsers}
          isLoadingData={appointmentState.isLoadingData}
          isLoadingData2={appointmentState.isLoadingData2}
          _leadListForDropdown={_leadListForDropdown}
          _userListAppointment={_userListAppointment}
          _companyListForDropdown={_companyListForDropdown}
          _consumerDropList={_consumerDropList}
          _basicActions={_basicActions}
          _ResetInitialState={_ResetInitialState}
        />
      </MyDrawer>
    </>
  );
};
