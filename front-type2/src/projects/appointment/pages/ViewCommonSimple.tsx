import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appointmentAction, selectAppointmentState } from "../redux/appointment";
import ViewAppointment from "../sections/viewAppointmentSimple";
import { quoteAction, selectQuoteState } from "../../quote/redux/quote";
import { appointmentReducer, appointmentSaga, sliceKeyAppointment } from "../redux/appointment";
import { useInjectReducer, useInjectSaga } from "redux-injectors";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";

export const ViewCommonSimple = (props: any) => {
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
  const _closeSideBar = (payload) => dispatch(appointmentAction.CloseSideBar(payload));
  const _userListAppointment = (payload) => dispatch(appointmentAction.userListAppointment(payload));
  const _addAppointment = (payload) => dispatch(appointmentAction.addAppointment(payload));
  const _companyListForDropdown = (payload) => dispatch(appointmentAction.CompanyListData(payload));
  const _consumerDropList = (payload) => dispatch(appointmentAction.ConsumerList(payload));
  const _leadListForDropdown = (payload) => dispatch(quoteAction.dropDownLeadList(payload));
  const _singleAppointmentDetails = (payload) => dispatch(appointmentAction.singleAppointmentDetails(payload));
  const _editAppointment = (payload) => dispatch(appointmentAction.editAppointment(payload));
  const _deleteAppointment = (payload) => dispatch(appointmentAction.deleteAppointment(payload));
  
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
        <ViewAppointment
          {...props}
          open={setDrawer}
          getUserTable={getUserTable}
          onClose={closeDrawer}
          appointmentData={otherData}
          _closeSideBar={_closeSideBar}
          _slugUpdate={_slugUpdate}
          _addAppointment={_addAppointment}
          leads={quoteState.leads}
          viewAppointment={appointmentState.viewAppointment}
          viewLoading={appointmentState.viewLoading}
          availableUsers={appointmentState.availableUsers}
          isLoadingData={appointmentState.isLoadingData}
          isLoadingData2={appointmentState.isLoadingData2}
          editLoading={appointmentState.editLoading}
          _leadListForDropdown={_leadListForDropdown}
          _userListAppointment={_userListAppointment}
          _singleAppointmentDetails={_singleAppointmentDetails}
          _editAppointment={_editAppointment}
          _deleteAppointment={_deleteAppointment}
          _companyListForDropdown={_companyListForDropdown}
          _consumerDropList={_consumerDropList}
        />
      </MyDrawer>
    </>
  );
};
