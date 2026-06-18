import React, { Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import MyDrawerLeft from "../../../sharedUtils/sharedComponents/drawerHelperLeft";
import { renewalAction, selectRenewalState } from "../Redux/renewal";
import { selectGlobalConfig } from "../../../sharedUtils/sharedRedux/configuration";
import { selectQuoteState, quoteAction } from "../../quote/redux/quote"
import RenewalList from "../sections/renewalList";
import DeleteTable from "../sections/deleteTable";
import ViewRenewal from "../sections/viewRenewal";
import RenewalFilter from "../components/setFilter";

export const Common = (props: any) => {
  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState(null);
  const [filter, setFilter] = useState({});
  const [otherData, setOtherData] = useState({});
  const [setPaymentDrawer, setSetPaymentDrawer] = useState(null);

  const getUserTable = useRef(null);
  const renewalState = useSelector(selectRenewalState);
  const quoteState = useSelector(selectQuoteState);
  const globalState = useSelector(selectGlobalConfig);

  const dispatch = useDispatch();

  const _editQuote = (payload, type) => {
    if (type === "quote") {
      dispatch(quoteAction.editQuote(payload));
    } else {
      dispatch(renewalAction.editRenewal(payload));
    }
  };

  const _isLoadingData = (payload, type) => {
    if (type === "quote") {
      dispatch(quoteAction.setIsLoadingData(payload));
    } else {
      dispatch(renewalAction.setIsLoadingData(payload));
    }
  };

  useEffect(() => {
    props.setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${props.slug}`,
      },
      { name: props.type === "quote" ? "Quote" : "Renewal" },
    ]);
  }, []);

  const _loadingDataAction = (payload) =>
    dispatch(renewalAction.setIsLoadingData(payload));
  const _closeSideBar = (payload) =>
    dispatch(renewalAction.CloseSideBar(payload));
  const _filterData = (payload) =>
    dispatch(renewalAction.renewalFilter(payload));
  const _renewalList = (payload) => dispatch(renewalAction.List(payload));
  const _viewSingleQuote = (payload) =>
    dispatch(renewalAction.viewSigleRenewal(payload));
  const _slugUpdate = (payload) => dispatch(renewalAction.SlugUpdate(payload));
  const _addQuotePayment = (payload) => dispatch(renewalAction.addQuotePayment(payload));
  const _DeleteDeptPayment = (payload) => dispatch(renewalAction.deleteDebtPayment(payload));

  function setEditDrawer(data) {
    setSetDrawer("editRenewal");
    setOtherData(data);
  }

  function closeFilter() {
    setDrawerIs(null);
  }

  function setAddPaymentDrawer() {
    setSetPaymentDrawer("addPaymentDrawer");
  }

  function closePaymentDrawer() {
    setSetPaymentDrawer(null);
  }

  function setFilterDrawer() {
    setDrawerIs(
      <Suspense fallback={<>Loading...</>}>
        <MyDrawerLeft open={true} onClose={closeFilter}>
          <RenewalFilter
            {...props}
            filter={filter}
            getUserTable={getUserTable}
            onClose={closeFilter}
          />
        </MyDrawerLeft>
      </Suspense>
    );
  }

  function closeDrawer() {
    setSetDrawer(null);
    setDrawerIs(null);
  }

  return (
    <>
      <Helmet>
        <title>View {props.type === "quote" ? "Quote" : "Renewal"}</title>
        <meta name="description" content="A Edan Power CRM" />
      </Helmet>

      {props.OnlyDeleteData !== undefined && props.OnlyDeleteData ? (
        <DeleteTable
          {...props}
          getUserTable={getUserTable}
          tableRef={getUserTable}
          filter={filter}
        />
      ) : (
        <RenewalList
          {...props}
          getUserTable={getUserTable}
          tableRef={getUserTable}
          filter={filter}
          setEditDrawer={setEditDrawer}
          setFilterDrawer={setFilterDrawer}
          onClose={closeDrawer}
        />
      )}

      <ViewRenewal
        {...props}
        getUserTable={getUserTable}
        renewal={otherData}
        onClose={closeDrawer}
        open={setDrawer}
        _isLoadingData={_isLoadingData}
        _editQuote={_editQuote}
        suppliers={globalState.suppliers}
        setAddPaymentDrawer={setAddPaymentDrawer}
        _DeleteDeptPayment={_DeleteDeptPayment}

      />
      {drawerIs}
    </>
  );
};
