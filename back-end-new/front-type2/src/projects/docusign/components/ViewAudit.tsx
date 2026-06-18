import { Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  docusignReducer,
  sliceKeyDocusign,
  docusignSaga,
  selectDocusignState,
  docusignAction,
  selectAuditViewData,
} from "../redux/docusign";
import MaterialTable from "material-table";
import moment from "moment";
import ViewFile from "../../../sharedUtils/sharedComponents/viewFile";

export function ViewAudit(props) {
  let company = null;
  let consumer = null;
  if (props?.currentQuote?.Company?._id) {
    company = props?.currentQuote?.Company?._id
  } else if (props?.currentCompany?._id || props?.currentQuote?.Company?._id) {
    company = props?.currentCompany?._id || props?.currentQuote?.Company?._id
  } else if (props.currentConsumer?._id || props.currentQuote?.Consumer?._id) {
    consumer = props?.currentConsumer?._id || props.currentQuote?.Consumer?._id
  }

  useInjectReducer({ key: sliceKeyDocusign, reducer: docusignReducer });
  useInjectSaga({ key: sliceKeyDocusign, saga: docusignSaga });

  const dispatch = useDispatch();
  const docuSignState = useSelector(selectDocusignState);

  function handleClose() {
    dispatch(docusignAction.changeAuditDrawer({ open: false, envId: "", docusignEmailSubject: null }));
  }

  function handleGetAuditData(data) {
    dispatch(docusignAction.getAuditData(data));
  }

  return (
    <MyDrawer
      drawerSize="1100px"
      iconName="Audit"
      open={docuSignState.isAuditDrawerOpen}
      onClose={handleClose}
    >
      <ViewAuditLogic handleGetAuditData={handleGetAuditData} companyId={company} consumerId={consumer} props={props} />
    </MyDrawer>
  );
}

function ViewAuditLogic({ handleGetAuditData, companyId, consumerId, props }) {
  const dispatch = useDispatch();
  const AuditDataState = useSelector(selectAuditViewData);  

  useEffect(() => {
    if (AuditDataState.envId) {
      if (props.showingFrom == 'viewConsumer') {
        handleGetAuditData({ envId: AuditDataState.envId, consumerId, docusignEmailSubject: AuditDataState.docusignEmailSubject });
      } else if (props.currentQuote?.Consumer?._id && props.showingFrom == 'viewQuote') {
        handleGetAuditData({ envId: AuditDataState.envId, consumerId, docusignEmailSubject: AuditDataState.docusignEmailSubject });
      } else {
        handleGetAuditData({ envId: AuditDataState.envId, companyId, docusignEmailSubject: AuditDataState.docusignEmailSubject });
      }
    }
  }, [AuditDataState.envId]);

  const columns = [
    {
      title: "Time",
      field: "logTime",
    },
    {
      title: "User Name",
      field: "UserName",
    },
    {
      title: "Action",
      field: "Action",
    },
    {
      title: "Activity",
      field: "Message",
    },
    {
      title: "Status",
      field: "EnvelopeStatus",
    },
    {
      title: "Ip Address",
      field: "ClientIPAddress",
    },
  ];

  const actions = [];

  if (AuditDataState.documentUrl !== undefined && AuditDataState.documentUrl) {
    actions.push({
      icon: () =>
        <ViewFile
          attachments={
            [
              {
                name: "Certificate",
                type: "application/pdf",
                value: AuditDataState.documentUrl,
              },
            ]}
        />,
      isFreeAction: true,
      onClick: () => { },
      iconProps: {
        style: { cursor: 'pointer' }
      },
    })
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MaterialTable
            columns={columns}
            title="Envelope Events"
            data={AuditDataState.auditEvents.map((e) => ({
              ...e,
              logTime: moment(e.logTime).format("DD/MM/YYYY"),
            }))}
            isLoading={AuditDataState.isLoading}
            options={{
              emptyRowsWhenPaging: false,
              exportButton: false,
              filtering: false,
              search: false,
              paging: true,
              pageSize: 20,
              sorting: false,
            }}
            actions={actions}
          />
        </Grid>
      </Grid>
    </>
  );
}
