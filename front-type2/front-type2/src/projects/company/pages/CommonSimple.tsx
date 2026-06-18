import React, { Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import ViewSimpleCompany from "../sections/viewSimpleCompany";
import {
  companyAction,
  selectCompanyState,
  companyReducer,
  companySaga,
  sliceKeyCompany,
} from "../redux/company";
/* export default connect(
    null,
    dispatch => ({
        _loadingDataAction: payload => dispatch(userActions.regUser.loadingData(payload)),
        _closeSideBar: (payload) => dispatch(userActions.regUser.CloseSideBarFun(payload)),
        _filterData: payload => dispatch(userActions.regUser.filterData(payload)),
        _supplierList: payload => dispatch(userActions.regUser.supplierList(payload)),
    }),
)(
     */

export const CommonSimple = (props: any) => {
  useInjectReducer({ key: sliceKeyCompany, reducer: companyReducer });
  useInjectSaga({ key: sliceKeyCompany, saga: companySaga });

  const [drawerIs, setDrawerIs] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  /*  useEffect(() => {
    const { companyData } = props;
    showSingleCompany(companyData);
  }, []);
 */
  function closeDrawer() {
    const { isCloseCompany } = props;
    isCloseCompany();
    //  setDrawerIs(null);
    setDrawerOpen(false);
  }

  const companyState = useSelector(selectCompanyState);

  /*   function showSingleCompany(data) {
    setDrawerIs(<Suspense fallback={<></>}></Suspense>);
  } */

  const _closeSideBar = (payload) =>
    dispatch(companyAction.CloseSideBar(payload));
  const _isLoadingData = (payload) =>
    dispatch(companyAction.setIsLoadingData(payload));
  const _viewSingleCompany = (payload) => {
    dispatch(companyAction.singleCompany(payload));
  };

  const _editCompany = (payload) =>
    dispatch(companyAction.editCompany(payload));

  const _slugUpdate = (payload) => dispatch(companyAction.SlugUpdate(payload));
  const _sendRequest = (payload) =>
    dispatch(companyAction.sendRequest(payload));

  const _addNotes = (payload) => dispatch(companyAction.AddNotes(payload));

  const _loadingDataAction = (payload) =>
    dispatch(companyAction.LoaderStart(payload));
  const _companyList = (payload) => dispatch(companyAction.List(payload));

  return (
    <>
      <MyDrawer
        drawerSize="1100px"
        iconName="Company"
        open={drawerOpen}
        onClose={closeDrawer}
      >
        <ViewSimpleCompany
          {...props}
          company={props.companyData}
          getUserTable={getUserTable}
          //onClose={closeDrawer}
          isLoadingData={companyState.isLoadingData}
          message={companyState.message}
          currentCompany={companyState.currentCompany}
          _isLoadingData={_isLoadingData}
          _closeSideBar={_closeSideBar}
          _slugUpdate={_slugUpdate}
          _editCompany={_editCompany}
          _viewSingleCompany={_viewSingleCompany}
          _addNotes={_addNotes}
          _sendRequest={_sendRequest}
          _loadingDataAction={_loadingDataAction}
        />
      </MyDrawer>
    </>
  );
};
