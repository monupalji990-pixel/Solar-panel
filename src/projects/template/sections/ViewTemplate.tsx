import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTemplateOptions,
  selectTemplateState,
  templateAction,
} from "../redux/template";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import ViewFile from "../../../sharedUtils/sharedComponents/viewFile";
import {
  Grid,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  AccordionSummary,
  Typography,
  AccordionDetails,
  CircularProgress,
  TextField,
  Tooltip,
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import { AMPS, mapOptionsForService } from "../../../sharedUtils/globalHelper/constantValues";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import * as Yup from "yup";
import RestApi from "../redux/model/template";
import Select from "react-select";
import CachedIcon from "@material-ui/icons/Cached";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { globalConfigActions } from "sharedUtils/sharedRedux/configuration";

export default function ViewTemplate(props) {
  const templateState = useSelector(selectTemplateState);
  const templateOptions = useSelector(selectTemplateOptions);
  const dispatch = useDispatch();
  function handleClose() {
    dispatch(templateAction.changeViewTemplateDrawerStatus(false));
  }
  const ds =
    props.showingFrom &&
      ["viewCompany", "viewQuote", "viewLead", "viewConsumer"].includes(
        props.showingFrom
      )
      ? "960px"
      : "850px";

  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Template"
      open={templateOptions.openViewTemplateDrawer}
      onClose={handleClose}
    >
      <Grid container justify="center">
        {templateState.isLoadingData == true ? (
          <CircularProgress style={{ justifySelf: "center" }} />
        ) : (
          <ViewTemplateLogic {...props} />
        )}
      </Grid>
    </MyDrawer>
  );
}

function ViewTemplateLogic(props) {
  const templateState = useSelector(selectTemplateState);
  const template = templateState.viewTemPlate;
  const dispatch = useDispatch();
  useEffect(() => { }, []);

  function simpleEdit(values, setEditKey) {
    const formObj = new FormData();
    formObj.append("_id", template._id);
    Object.keys(values).forEach((key) => {
      formObj.append(key, values[key]);
    });

    RestApi.editTemplate(templateState, formObj)
      .then((response: any) => {
        if (response.success) {
          dispatch(templateAction.viewTemplateSuccess(response.data));
          dispatch(templateAction.List(null));
        }
        setEditKey(null);
        dispatch(globalConfigActions.enableFeedback(response.message));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const typeOptions = [
    { value: "LOA", label: "LOA" },
    { value: "CONTRACT", label: "CONTRACT" },
  ];

  function handleMapperEdit(values, setEditKey) {
    const mapper = { ...template.mapper };
    Object.keys(values).forEach((key) => {
      mapper[key] = values[key].value;
    });
    simpleEdit({ mapper: JSON.stringify(mapper) }, setEditKey);
  }

  return (
    <>
      <Grid container justify="center" className="temp-txt-uppercase">
        <Grid item md={12} xs={12}>
          <TableContainer >
            <Table aria-label="caption table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Template Name</strong>
                  </TableCell>
                  {AMPS.includes(templateState.slug) ? (
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="templateName"
                        value={template.templateName}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          templateName: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                props.errors.templateName &&
                                  props.touched.templateName
                                  ? true
                                  : false
                              }
                              className="profile-pic"
                              name="templateName"
                              value={props.values.templateName}
                              onChange={props.handleChange}
                              helperText={!props.errors.templateName}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      {template.templateName}
                    </TableCell>
                  )}
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Template Type</strong>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {template.type}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Template Document</strong>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Grid container alignItems="center">
                      <Grid item xs={10}>
                        <ViewFile
                          commentFor="admin"
                          attachments={[
                            {
                              name: template.templateName,
                              type: "application/pdf",
                              value: template.url,
                            },
                          ]}
                        ></ViewFile>
                      </Grid>
                      <Grid item xs={2} style={{ textAlign: "right" }}>
                        <Tooltip title="Replace Template">
                          <CachedIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              dispatch(
                                templateAction.changeTobeReplaceTemplate(
                                  template
                                )
                              );
                              dispatch(
                                templateAction.changeReplaceTemplateDrawerStatus(
                                  true
                                )
                              );
                            }}
                          />
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Mapped Fields</strong>
                  </TableCell>
                  <TableCell>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography variant="caption" style={{}}>
                          Click To Expand
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Table>
                          <TableBody
                            style={{
                              borderBottom: "2px solid #000",
                            }}
                          >
                            {template.mapper &&
                              Object.keys(template.mapper).map((key) => (
                                <>
                                  <TableRow>
                                    <TableCell>{key}</TableCell>
                                    <TableCell>
                                      <OnTextEditInput
                                        reactSelect={true}
                                        name={key}
                                        value={
                                          template.type === 'CONTRACT' ? mapOptionsForService[template?.serviceType].find(el => el.value == template.mapper[key]) : mapOptionsForService['company'].find(el => el.value == template.mapper[key])
                                        }
                                        onSubmit={handleMapperEdit}
                                        validateIt={Yup.object().shape({
                                          [key]: Yup.object().required(
                                            "Required"
                                          ),
                                        })}
                                      >
                                        {(props) => {
                                          return (
                                            <Select
                                              error={
                                                !!(
                                                  props.errors[key] &&
                                                  props.touched[key]
                                                )
                                              }
                                              className="profile-pic"
                                              value={props.values[key]}
                                              onChange={(e) => {
                                                props.setFieldValue(
                                                  key,
                                                  e
                                                );
                                              }}
                                              onBlur={props.handleBlur}
                                              margin="normal"
                                              options={
                                                template.type === 'CONTRACT' ? mapOptionsForService[template.serviceType] : mapOptionsForService['company']
                                              }
                                            />
                                          );
                                        }}
                                      </OnTextEditInput>
                                    </TableCell>
                                  </TableRow>
                                </>
                              ))}
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}
