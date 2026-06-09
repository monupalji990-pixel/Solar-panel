import React, { useState, useCallback } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Lodash from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  docusignAction,
  selectDocusignState,
  sliceKeyDocusign,
  docusignSaga,
  docusignReducer,
  selectRecipientOption,
} from "../../docusign/redux/docusign";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { ViewAudit } from "../../docusign/components/ViewAudit";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  Spacing: {
    marginTop: "10px",
    // marginBottom: "10px",
    width: "100%",
  },
  TypoSpace: {
    marginBottom: 25,
  },
  PaddingSpace: {
    padding: "20px",
  },
}));

export default function DocusignActions(props) {
  const classes = useStyles();
  const [step, setStep] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useInjectReducer({ key: sliceKeyDocusign, reducer: docusignReducer });
  useInjectSaga({ key: sliceKeyDocusign, saga: docusignSaga });

  const dispatch = useDispatch();
  const docusign_state = useSelector(selectDocusignState);

  let templateOptions = [];
  if (docusign_state.templateList["envelopeTemplates"])
    templateOptions = docusign_state.templateList["envelopeTemplates"].map(
      (template) => {
        return {
          label: template.name,
          value: template.templateId,
          emailSubject: template.emailSubject,
        };
      }
    );

  const _listTemplates = (payload) =>
    dispatch(docusignAction.templateList(payload));
  const _viewTemplateRecipients = (payload) =>
    dispatch(docusignAction.viewTemplate(payload));
  const _sendEnvelope = (payload) =>
    dispatch(docusignAction.sendEnvelope(payload));
  const _getRecipientOptions = (payload) =>
    dispatch(docusignAction.getRecipientOptions(payload));
  const _changePage = (payload) =>
    dispatch(docusignAction.recipientOptionChangeLimit(payload));

  function _changeTemplateSkipDown() {
    const skip = Number(docusign_state.templateListSkip);
    const limit = Number(docusign_state.templateList["resultSetSize"]);
    const totalSetSize = Number(docusign_state.templateList["totalSetSize"]);
    const endPosition = Number(docusign_state.templateList["endPosition"]);

    if (endPosition < totalSetSize - 1) {
      dispatch(
        docusignAction.changeTemplateListSkip({
          slug: props.slug,
          skip: docusign_state.templateList["envelopeTemplates"].length,
        })
      );
    }
  }

  function _changeTemplateSkipUp() {
    const skip = Number(docusign_state.templateListSkip);
    const limit = Number(docusign_state.templateList["resultSetSize"]);

    if (skip >= limit)
      dispatch(
        docusignAction.changeTemplateListSkip({
          slug: props.slug,
          skip: skip - limit,
        })
      );
  }

  function handleSearchRecipient(payload) {
    dispatch(docusignAction.recipientOptionSearch(payload));
  }

  const delayedQuery = useCallback(
    Lodash.debounce((payload) => {
      if (payload.search && payload.search.length > 2)
        handleSearchRecipient(payload);
    }, 500),
    []
  );

  let dynamicRecipientsInit: any = {};
  docusign_state.currentTemplate.forEach((role) => {
    dynamicRecipientsInit[role] = "";
  });

  const recipientOption = useSelector(selectRecipientOption);
  let companyId = "";
  let supplierId = "";

  const moduleOption = [
    { value: "user", label: "user" },
    { value: "supplier", label: "supplier" },
  ];

  if (props.currentQuote.Company && props.currentQuote.Company._id) {
    companyId = props.currentQuote.Company._id;
    moduleOption.push({ value: "company", label: "company" });
  }
  if (props.currentQuote.Supplier && props.currentQuote.Supplier._id) {
    supplierId = props.currentQuote.Supplier._id;
  }
  if (props.currentQuote.Consumer && props.currentQuote.Consumer._id) {
    companyId = props.currentQuote.Consumer._id;
    moduleOption.push({ value: "consumer", label: "consumer" });
  }
  let consumerEmail = "";
  if (props.currentQuote.Consumer && props.currentQuote.Consumer.email) {
    consumerEmail = props.currentQuote.Consumer.email;
  }

  const dynamicValidSchema = {};
  for (const key of Object.keys(dynamicRecipientsInit)) {
    dynamicValidSchema[key] = Yup.object()
      .required(`this is required`)
      .nullable();
  }

  function handleAuditDrawerOpen(envId) {
    dispatch(docusignAction.changeAuditDrawer({ open: true, envId, docusignEmailSubject: null }));
  }
  return (
    <>
      {docusign_state.loading === false ? (
        <div className={classes.Spacing}>
          {props.docusignHistory.length > 0 &&
            props.docusignHistory.length > 0 ? (
            <TableContainer component={Paper} className={classes.Spacing}>
              <Table className={classes.Spacing}>
                <TableBody>
                  <TableRow>
                    <h3 style={{ padding: 20, textAlign: "center" }}>
                      Envelopes List
                    </h3>
                  </TableRow>
                  {props.docusignHistory.length > 0 &&
                    props.docusignHistory.map((envelope) => (
                      <TableRow>
                        <Accordion>
                          <AccordionSummary
                            aria-label="Expand"
                            aria-controls="additional-actions1-content"
                            id="additional-actions1-header"
                            style={{ alignItems: "center" }}
                          >
                            <ClickablaButton
                              data={envelope.envId}
                              handleFunction={handleAuditDrawerOpen}
                            />
                            <Typography variant="caption" style={{}}>
                              <strong>
                                {" "}
                                <h3>{envelope.emailSubject}</h3>
                              </strong>
                            </Typography>
                          </AccordionSummary>
                        </Accordion>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : false ? (
            <Grid
              container
              direction="row"
              id="second last"
              justify="center"
              alignItems="center"
              style={{ paddingTop: 20 }}
            >
              <CircularProgress />
            </Grid>
          ) : (
            <h3 style={{ padding: 20, textAlign: "center" }}>
              No Docusign Data
            </h3>
          )}
        </div>
      ) : (
        <Grid
          container
          direction="row"
          id="last"
          justify="center"
          alignItems="center"
          style={{ paddingTop: 20 }}
        >
          <CircularProgress />
        </Grid>
      )}
      <ViewAudit />
    </>
  );
}

function ClickablaButton({ data, handleFunction }) {
  function OnClickHandle(e) {
    e.stopPropagation();
    handleFunction(data);
  }
  function handleFocus(e) {
    e.stopPropagation();
  }
  return (
    <>
      <Tooltip title="Audit History">
        <VisibilityIcon
          onClick={OnClickHandle}
          onFocus={handleFocus}
          style={{ paddingRight: "1rem" }}
        />
      </Tooltip>
    </>
  );
}
