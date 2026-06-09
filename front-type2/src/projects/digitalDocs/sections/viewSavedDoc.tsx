import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  selectDocOptions,
  selectDocState,
  digitalDocAction,
  selectTemplateFromDigitalDoc,
} from "../redux/digital";
import ViewFile from "../../../sharedUtils/sharedComponents/viewFile";
import {
  Grid,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import moment from "moment";
import { selectCompanyState } from "projects/company/redux/company";
import { selectQuoteState } from "projects/quote/redux/quote";
import { ViewVerbalDocLogic } from "../components/viewSavedDocVerbal";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { selectRenewalState } from "../../renewal/Redux/renewal";

const useStyles = makeStyles(() => ({
  loaderStyle: {
    position: 'absolute',
    top: '33%',
    left: '64%',
    marginTop: -12,
    marginLeft: -12,
  }
}));

export default function ViewSavedDoc(props) {

  const dosState = useSelector(selectDocState);

  const DocOption = useSelector(selectDocOptions);
  const dispatch = useDispatch();
  function handleClose() {
    dispatch(digitalDocAction.changeViewDocDrawerStatus(false));
  }
  const ds =
    props.showingFrom &&
      ["viewCompany", "viewQuote", "viewLead", "viewConsumer", "viewRenewal"].includes(
        props.showingFrom
      )
      ? "960px"
      : "1250px";

  return (
    <MyDrawer
      drawerSize={ds}
      iconName="digital-doc"
      open={DocOption.openViewDocDrawer}
      onClose={handleClose}
    >
      <Grid container justify="center">
        {dosState.isLoadingData ? (
          <CircularProgress />
        ) : (
          <>
            {dosState.viewDoc?.mode === "Verbal" ? (
              <ViewVerbalDocLogic {...props} />
            ) : (
              <ViewDocLogic {...props} />
            )}
          </>
        )}
      </Grid>
    </MyDrawer>
  );
}

function ViewDocLogic(props) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const docState = useSelector(selectDocState);

  const template = useSelector(selectTemplateFromDigitalDoc);
  const [templateOptions, setTemplateOptions] = useState([]);

  useEffect(() => {
    if (template.templateList && template.templateList.length > 0) {
      const newArr = [];
      template.templateList.forEach((ele) => {
        newArr.push({
          value: ele._id,
          label: ele.templateName,
        });
      });
      setTemplateOptions(newArr);
    }
  }, [template]);

  const company = useSelector(selectCompanyState);
  const quote = useSelector(selectQuoteState);
  let fileName = company.currentCompany.businessName;
  const formInitialVal: any = { files: [] };
  const renewalState = useSelector(selectRenewalState);

  if (props.showingFrom == "viewQuote") {
    fileName = quote.currentQuote.Company.businessName;
    formInitialVal.quoteId = quote?.currentQuote?._id;
  } else if (props.showingFrom == "viewCompany") {
    formInitialVal.companyId = company?.currentCompany?._id;
  }
  else if (props.showingFrom == "viewRenewal") {
    formInitialVal.companyId = renewalState?.currentQuote?._id;
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="caption table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Sent By</strong>
                  </TableCell>
                  <TableCell>{docState.viewDoc?.sentBy?.name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Sent Document</strong>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <ViewFile
                      commentFor="admin"
                      attachments={[
                        {
                          name: docState.viewDoc.filename,
                          type: "application/pdf",
                          value: docState.viewDoc.sentDocumentUrl,
                        },
                      ]}
                    ></ViewFile>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Mode</strong>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {docState.viewDoc.mode || "-"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Created On</strong>
                  </TableCell>

                  <TableCell>
                    {moment(docState.viewDoc.sentDocumentTimestamp).format(
                      "DD/MM/YYYY"
                    )}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>

                  <TableCell>{docState.viewDoc.status}</TableCell>
                </TableRow>

                {docState.viewDoc.receivedDocumentUrl ? (
                  <>
                    <TableRow>
                      <TableCell>
                        <strong>Received Document</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <ViewFile
                          commentFor="admin"
                          attachments={[
                            {
                              name: docState.viewDoc?.receivedFileName,
                              type: "application/pdf",
                              value: docState.viewDoc.receivedDocumentUrl,
                            },
                          ]}
                        ></ViewFile>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <strong>Reveived Date</strong>
                      </TableCell>

                      <TableCell>
                        {moment(
                          docState.viewDoc.receivedDocumentTimestamp
                        ).format("DD/MM/YYYY")}
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell>
                      <strong>Received Document</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Formik
                        enableReinitialize
                        initialValues={formInitialVal}
                        onSubmit={(values) => {
                          if (values.files.length > 0) {
                            const formObj = new FormData();
                            formObj.append(
                              "digitalDocumentId",
                              docState.viewDoc._id
                            );
                            values.files.forEach((file) => {
                              formObj.append("document", file);
                            });
                            formObj.append(
                              "digitalDocumentId",
                              docState.viewDoc._id
                            );
                            dispatch(digitalDocAction.attachedSignPdf(formObj));
                          }
                        }}
                      >
                        {({
                          handleSubmit,
                          setFieldValue,
                        }) => {
                          return (
                            <form onSubmit={handleSubmit}>
                              <Grid container alignItems="center" spacing={3}>
                                <Grid item xs={8}>
                                  <DropzoneArea
                                    filesLimit={1}
                                    dropzoneText="Upload"
                                    useChipsForPreview
                                    maxFileSize={10000000}
                                    onChange={(e) => {
                                      setFieldValue("files", e);
                                    }}
                                    onDelete={(e) => {
                                      setFieldValue("files", e);
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={4} style={{ position: 'relative' }}>
                                  <Button
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                  >
                                    Upload
                                  </Button>

                                  {docState.loadingForUpload && (
                                    <CircularProgress className={classes.loaderStyle} />
                                  )}
                                </Grid>
                              </Grid>
                            </form>
                          );
                        }}
                      </Formik>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}
