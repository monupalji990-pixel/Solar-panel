import {
  Button,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { Formik } from "formik";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  selectDocOptions,
  selectDocState,
  verbalDocAction,
  selectTemplateFromVerbalDoc,
  initialTemplate,
  verbalDocReducer,
  verbalDocSaga,
  sliceKeyVerbalDoc,
} from "../redux/verbal";
import * as Yup from "yup";
import { selectCompanyState } from "projects/company/redux/company";
import { selectQuoteState } from "projects/quote/redux/quote";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";

export default function AddTemplate(props) {
  const DocOption = useSelector(selectDocOptions);
  const dispatch = useDispatch();
  function handleClose() {
    dispatch(verbalDocAction.changeAddDocDrawerStatus(false));
    dispatch(verbalDocAction.changePdfStr(""));
  }
  
  const ds = "1250px";
  return (
    <MyDrawer
      drawerSize={ds}
      iconName="digital-doc"
      open={DocOption.openAddDocDrawer}
      onClose={handleClose}
    >
      <CreateDocLogic {...props} />
    </MyDrawer>
  );
}

export function CreateDocLogic(props) {
  useInjectReducer({ key: sliceKeyVerbalDoc, reducer: verbalDocReducer });
  useInjectSaga({ key: sliceKeyVerbalDoc, saga: verbalDocSaga });

  const dispatch = useDispatch();
  const docState = useSelector(selectDocState);

  const template = useSelector(selectTemplateFromVerbalDoc);
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

  useEffect(() => {
    dispatch(verbalDocAction.SlugUpdate({ slug: props.slug }));
    dispatch(verbalDocAction.getListOfTemplate(null));
  }, []);


  function _changeTemplateSkipDown() {
    if (template.isNext) {
      dispatch(
        verbalDocAction.templateListChangelimit({
          limit: template.limit + initialTemplate.limit,
        })
      );
    }
  }

  function handleSelection(data) {
    dispatch(verbalDocAction.createDoc(data));
  }

  const company = useSelector(selectCompanyState);
  const quote = useSelector(selectQuoteState);

  const formInitialVal: any = {};

  if (props.showingFrom == "viewQuote") {
    formInitialVal.quoteId = quote?.currentQuote?._id;
  } else {
    formInitialVal.companyId = company?.currentCompany?._id;
  }

  function base64ToArrayBuffer(data) {
    var bString = window.atob(data);
    var bLength = bString.length;
    var bytes = new Uint8Array(bLength);
    for (var i = 0; i < bLength; i++) {
      var ascii = bString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  const downloadAttachment = async (fileData, fileType, fileName) => {
    try {
      const typeArray = {
        png: "image/png",
        jpg: "image/jpg",
        jpeg: "image/jpeg",
        pdf: "application/pdf",
        xlsx:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
      const blob = fileData;
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);
      a.href = window.URL.createObjectURL(
        new Blob([blob as ArrayBuffer], { type: typeArray[fileType] })
      );
      a.setAttribute("download", fileName);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    } catch (error) { }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Formik
            enableReinitialize
            initialValues={{
              Template: null,
            }}
            onSubmit={(value) => {
              if (
                company &&
                company.currentCompany &&
                company.currentCompany._id
              )
                dispatch(
                  verbalDocAction.savePdf({
                    ...formInitialVal,
                    templateId: value.Template.value,
                    data: docState.pdfStr,
                    filename: company.currentCompany.businessName,
                    contentType: "application/pdf",
                  })
                );
            }}
            validationSchema={Yup.object().shape({
            })}
          >
            {(Iprops) => {
              const {
                values,
                handleBlur,
                handleSubmit,
                setFieldValue,
              } = Iprops;

              return (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Select
                        id="Template"
                        name="Template"
                        placeholder="Search templates"
                        value={values.Template}
                        onChange={(e) => {
                          setFieldValue("Template", e);
                          handleSelection({
                            templateId: e.value,
                            ...formInitialVal,
                          });
                        }}
                        onBlur={handleBlur}
                        isLoading={docState.template.isLoading}
                        onMenuScrollToBottom={() => {
                          _changeTemplateSkipDown();
                        }}
                        components={{
                          LoadingIndicator() {
                            return <CircularProgress />;
                          },
                        }}
                        margin="normal"
                        aria-describedby="role-number-error"
                        options={templateOptions}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        size="large"
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={() => {
                          downloadAttachment(
                            base64ToArrayBuffer(docState.pdfStr),
                            "pdf",
                            `${values.Template.label}`
                          );
                        }}
                      >
                        Save & Download
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      {docState.isLoadingData && <CircularProgress />}
                    </Grid>
                  </Grid>
                </form>
              );
            }}
          </Formik>
        </Grid>

        <Grid item xs={12}>
          {docState.pdfStr ? (
            <object
              style={{
                height: "750px",
                width: "100%",
                ...(docState.isLoadingData && {
                  pointerEvents: "none",
                  opacity: "0.4",
                }),
              }}
              data={`data:application/pdf;base64,${docState.pdfStr}#toolbar=0&navpanes=0`}
              type="application/pdf"
            ></object>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
}
