import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { Formik } from "formik";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  selectDocOptions,
  selectDocState,
  digitalDocAction,
  selectTemplateFromDigitalDoc,
  initialTemplate,
} from "../../digitalDocs/redux/digital";
import * as Yup from "yup";
import { selectConsumerState } from "projects/consumer/redux/consumer";
import { selectQuoteState } from "projects/quote/redux/quote";
import DocuSignAction from "../sections/docusignActions"
import { selectRenewalState } from "../../renewal/Redux/renewal";
import { docusignAction } from "projects/docusign/redux/docusign";

export default function AddTemplate(props) {
  const DocOption = useSelector(selectDocOptions);
  const dispatch = useDispatch();
  function handleClose() {
    dispatch(digitalDocAction.changeAddDocDrawerStatus(false));
    dispatch(digitalDocAction.changePdfStr(""));
    dispatch(docusignAction.clearDocusignRedux(null))
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
function CreateDocLogic(props) {
  const dispatch = useDispatch();

  function handleFileUpload(files: any) {
    if (files && files.length > 0) {
      const data = new FormData();
      for (let x = 0; x < files.length; x++) {
        data.append("template", files[x]);
      }
    }
  }

  const docState = useSelector(selectDocState);

  const typeOptions = [
    { value: "LOA", label: "LOA" },
    { value: "CONTRACT", label: "CONTRACT" },
  ];

  const mapOptions = [
    { value: "businessName", label: "businessName" },
    { value: "firstLine", label: "firstLine" },
    { value: "secondLine", label: "secondLine" },
    { value: "postcode", label: "postcode" },
    { value: "NA", label: "NA" },
  ];

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

  useEffect(() => {
    let type = "CONTRACT";
    if (props.showingFrom === "viewConsumer") {
      type = "LOA";
    }
    dispatch(digitalDocAction.changeTemplateListType(type));
    dispatch(digitalDocAction.getListOfTemplate(type));
  }, []);

  function _changeTemplateSkipDown() {
    if (template.isNext) {
      dispatch(
        digitalDocAction.templateListChangelimit({
          limit: template.limit + initialTemplate.limit,
        })
      );
    }
  }

  function handleSelection(data, setFieldError) {
    if (props.showingFrom === "viewConsumer") {
      if (data.siteId) {
        dispatch(digitalDocAction.createDoc(data));
      }
      setFieldError("site", "Please select site");
    } else {
      dispatch(digitalDocAction.createDoc(data));
    }
  }

  const consumer = useSelector(selectConsumerState);
  const quote = useSelector(selectQuoteState);
  const renewalState = useSelector(selectRenewalState);

  let currentModuleObj = {};

  const formInitialVal: any = {};

  if (props.showingFrom == "viewQuote") {
    formInitialVal.quoteId = quote?.currentQuote?._id;
    formInitialVal.type = "quote";
    currentModuleObj = quote.currentQuote;
  } else if (props.showingFrom == "viewConsumer") {
    formInitialVal.consumerId = consumer?.currentConsumer?._id;
    formInitialVal.type = "consumer";
    currentModuleObj = { ...consumer.currentConsumer, Consumer: { _id: consumer?.currentConsumer?._id } };
  }
  else if (props.showingFrom == "viewRenewal") {
    formInitialVal.renewalId = renewalState?.currentQuote?._id;
    formInitialVal.type = "renewal";
    currentModuleObj = renewalState.currentQuote;
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
      <Formik
        enableReinitialize
        initialValues={{
          Template: null,
          filename: "",
          mode: "DocuSign",
          site: null,
        }}
        onSubmit={(value) => {
          dispatch(
            digitalDocAction.savePdf({
              ...formInitialVal,
              templateId: value.Template.value,
              data: docState.pdfStr,
              filename: value.filename,
              contentType: "application/pdf",
              mode: value.mode,
            })
          );
          // if (value?.mode !== "Verbal")
          //   downloadAttachment(
          //     base64ToArrayBuffer(docState.pdfStr),
          //     "pdf",
          //     `${value.filename}`
          //   );
        }}
        validationSchema={Yup.object().shape({
          filename: Yup.string().required("filename is required").nullable(),
          Template: Yup.object({
            value: Yup.string().required("please select the template"),
          })
            .required("please select the template")
            .nullable(),
        })}
      >
        {(Iprops) => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
            submitForm,
            validateForm,
            setFieldError,
          } = Iprops;

          function handleModelChange(e) {
            setFieldValue("mode", e.currentTarget.value);
            dispatch(docusignAction.clearDocusignRedux(null))

          }
          return (
            <form onSubmit={handleSubmit}>
              {/* <Grid item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-label="mode"
                    name="Mode"
                    value={values.mode}
                    onChange={handleModelChange}
                  >
                    <FormControlLabel
                      value="DocuSign"
                      control={<Radio />}
                      label="DocuSign"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid> */}

              <Grid item xs={12}>
                <DocuSignAction consumer={consumer} {...props}
                  currentModuleObj={currentModuleObj}
                  typeValues={formInitialVal}
                />
              </Grid>

            </form>
          );
        }}
      </Formik>
    </>
  );
}
