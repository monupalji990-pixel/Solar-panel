import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  AM,
  EligibilityRouteOptions,
  EligibilityStatusOptions,
  LandRegistrationCheckOptions,
  LeadBOUpgradeOptions,
  LeadBuildOptions,
  LeadCIInstallStatusOptions,
  LeadFTCHStatusOptions,
  LeadFunderOptions,
  LeadHCInstallStatusOptions,
  LeadIWIInstallStatusOptions,
  LeadInspectionOptions,
  LeadJobTypeOptions,
  LeadLIStatusOptions,
  LeadPostEPRRating,
  LeadPreEPRRating,
  LeadProjectStatusOptions,
  LeadRCAssignedOptions,
  LeadSAPOptions,
  LeadSubSubmissionCompleteBy,
  LeadSubSubmissionHandoverMonthOptions,
  LeadSubmissionStatusOptions,
  LeadTenureOptions,
  LeadTotalFloorAreaOptions,
  LeadUFIInstallStatusOptions,
  MeasuresBeingOptions,
  leadDropdownColors,
  subServiceMapperObject,
  yesAndNoOptions,
} from "sharedUtils/globalHelper/constantValues";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { useDispatch, useSelector } from "react-redux";
import { leadAction, selectLeadState } from "../redux/lead";
import { fade } from "@material-ui/core/styles/colorManipulator";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import InstallationInstructionApp from "./installationInstruction";

export default function LeadDigitalDashboard(props) {
  const currentProps = props;

  const dispatch = useDispatch();
  const leadData = useSelector(selectLeadState);
  const _updateTotalFloorState = (payload) =>
    dispatch(leadAction.updateTotalFloorState(payload));

  useEffect(() => {
    if (props.hideSideBar && startLoader) {
      setStartLoader(false);
      props._closeSideBar(false);
    }
  }, [props.hideSideBar]);

  let AssigneeList = [];
  if (props.assigneeList)
    AssigneeList = props.assigneeList.map((e) => ({
      label: e.name,
      value: e._id,
    }));

  const [fileUpload, setFileUpload] = useState({
    fileLoading: false,
    fileData: null,
  });
  const [startLoader, setStartLoader] = useState(false);
  const [instlInstructState, setInstlInstructState] = useState({
    open: false,
  });
  const [state, setState] = useState({
    soldServiceModal: false,
    selectedMBD: [],
  });
  const [ischeckedEcoServices, setIsCheckedEcoServices] = useState([]);

  let baseURL;
  if (process.env.NODE_ENV === "development") {
    baseURL = "http://localhost:8087/api/";
  } else {
    baseURL = "/api/";
  }

  const getCustomerName = () => {
    if (props.singleLead?.Consumer?._id) {
      return props.singleLead?.Consumer?.firstName
        ? props.singleLead?.Consumer?.title +
        " " +
        props.singleLead?.Consumer?.firstName +
        " " +
        props.singleLead?.Consumer?.surName
        : "";
    } else if (props.currentQuote?.Consumer?._id) {
      return props.currentQuote.Consumer?.firstName
        ? props.currentQuote.Consumer?.title +
        " " +
        props.currentQuote.Consumer?.firstName +
        " " +
        props.currentQuote.Consumer?.surName
        : "";
    }
  };  

  let initialValues = {
    leadId: "",
    lead: props.singleLead?.leadId || props.currentQuote?.Lead?.leadId,
    customerName: getCustomerName(),
    customerNumber:
      props.singleLead?.Consumer?.mobile ||
      props.currentQuote?.Consumer?.mobile,
    customerEmail:
      props.singleLead?.Consumer?.email || props.currentQuote?.Consumer?.email,
    firstLineOfadd:
      props.singleLead?.Consumer?.addressOne ||
      props.currentQuote?.Consumer?.addressOne,
    postcode:
      props.singleLead?.Consumer?.postcode ||
      props.currentQuote?.Consumer?.postcode,
    leadGenerator: props.singleLead?.LeadGenerator?.name
      ? {
        label: props.singleLead?.LeadGenerator?.name,
        value: props.singleLead?.LeadGenerator?.name,
      }
      : "-",
    tenure: null,
    projectStatus: props.singleLead?.status
      ? {
        label: props.singleLead?.status,
        value: props.singleLead?.status,
      }
      : null,
    assignee: props.singleLead?.Assignee?.name
      ? {
        label: props.singleLead?.Assignee?.name,
        value: props.singleLead?.Assignee?.name,
      }
      : "-",
    surveyor: props.singleLead?.Surveyor?.name
      ? {
        label: props.singleLead?.Surveyor?.name,
        value: props.singleLead?.Surveyor?.name,
      }
      : "-",
    jobType: props.singleLead?.jobType
      ? {
        label: props.singleLead?.jobType,
        value: props.singleLead?.jobType,
      }
      : {
        label: props.currentQuote?.Lead?.jobType,
        value: props.currentQuote?.Lead?.jobType,
      },
    surveyDate: null,
    RCAssigned: null,
    RCDocsCompleted: false,
    build: null,
    totalFloorAreaM2: null,
    PreEPRRating: "",
    PostEPRRating: "",
    ABS: leadData.totalFloorState?.absValue || 0,
    ABSMultiplier: 0,
    surveyPics: false,
    measuresBeingDone: null,
    surveyorNoteLink: "",
    eligibilityRoute: null,
    eligibilityStatus: null,
    LAFlexSubDate: null,
    DMCompleteDate: null,
    LaFlexCompletedDate: null,
    landRegistrationCheck: null,
    crossCheckDocumentsDone: false,
    documentCheckBy: "",
    inspectionType: null,
    CIInstallStatus: null,
    LIStatus: null,
    LIStartDate: null,
    UFIInstallStatus: null,
    UFIStartDate: null,
    CIStartDate: null,
    FTCHStatusOptions: null,
    FTCHStartDate: null,
    BOUpgrade: null,
    BOInstallDate: null,
    HCInstallStatus: null,
    HCStartDate: null,
    IWIInstallStatus: null,
    IWIStartDate: null,
    EWIInstallStatus: null,
    EWIInstallDate: null,
    CBInstallStatus: null,
    CBStartDate: null,
    SubPrepCB: null,
    VentTVInstallStatus: null,
    VentTVStartDate: null,
    VentExtFansInstallStatus: null,
    VentExtFansInstallDate: null,
    VentCoreInstallStatus: null,
    VentCoreInstallDate: null,
    SubmissionStatus: null,
    SubPrepLi: null,
    SubPrepUFI: null,
    SubPrepCI: null,
    SubPrepFTCH: null,
    SubPrepBOUpgrade: null,
    SubPrepHC: null,
    SubSentForTrustMark: null,
    SubSubmissionCompleted: null,
    SubSubmissionHandoverMonth: null,
    SubSubmissionDate: null,
    funder: null,
    valueNumber: 0,
    notes: "",
    attachments: "",
    materialCost: 0,
    labourCost: 0,
    profit: 0,
    roofingMaterialCost: 0,
    roofingLabourCost: 0,
    plumbingMaterialCost: 0,
    plumbingLabourCost: 0,
    scaffoldingCost: 0,
    leadGeneratorCost: 0,
    surveyorCost: 0,
    RCCost: 0,
    additionalCost: 0,
    paymentReceived: 0,
    outstandingPayment: 0,
    SolarInstallStatus: null,
    SolarInstallDate: null,
    BatteryStorageInstallStatus: null,
    BatteryStorageInstallDate: null,
    ASHPInstallStatus: null,
    ASHPInstallDate: null,
    ESHInstallStatus: null,
    ESHInstallDate: null,
    SubPrepSolar: null,
    SubPrepBatteryStorage: null,
    SubPrepASHP: null,
    SubPrepESH: null,
    ASHPPumpsInstallStatus: null,
    ASHPPumpsInstallDate: null,
    SolarStartDate: null,
    ASHPPumpsStartDate: null,
    ESHStartDate: null,
    SubPrepASHPPumps: null,
    RIRStatus: null,
    RIRStartDate: null,
    SubPrepRIR: null,
    Choice11Status: null,
    Choice11StartDate: null,
    SubPrepChoice11: null,
    CBInstallerName: null,
    LIInstallerName: null,
    CIInstallerName: null,
    UFIInstallerName: null,
    FTCHInstallerName: null,
    BOInstallerName: null,
    HCInstallerName: null,
    IWIInstallerName: null,
    EWIInstallerName: null,
    VentTVInstallerName: null,
    SolarInstallerName: null,
    ASHPPumpInstallerName: null,
    ESHInstallerName: null,
    Choice11InstallerName: null,
    RIRInstallerName: null,
    CB_batchNumber: "",
    CB_glueQuantity: "",
    contributionRequired: null,
    contributionPayment: 0
  };

  const [initialData, setInitialData] = useState({ ...initialValues });

  useEffect(() => {
    if (props.singleLead?.digitalDashboard) {
      let InitDigitalData = { ...props.singleLead?.digitalDashboard };

      InitDigitalData.BOUpgrade = InitDigitalData.BOUpgrade?.map((e) => ({
        label: e,
        value: e,
        color: leadDropdownColors[e],
      }));
      InitDigitalData.CIInstallStatus = InitDigitalData.CIInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.CBInstallStatus = InitDigitalData.CBInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.EWIInstallStatus = InitDigitalData.EWIInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.FTCHStatusOptions = InitDigitalData.FTCHStatusOptions?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.HCInstallStatus = InitDigitalData.HCInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.LIStatus = InitDigitalData.LIStatus?.map((e) => ({
        label: e,
        value: e,
        color: leadDropdownColors[e],
      }));
      InitDigitalData.SubmissionStatus = InitDigitalData.SubmissionStatus?.map(
        (e) => ({ label: e, value: e })
      );
      InitDigitalData.UFIInstallStatus = InitDigitalData.UFIInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.VentCoreInstallStatus = InitDigitalData.VentCoreInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.VentTVInstallStatus = InitDigitalData.VentTVInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.eligibilityStatus = InitDigitalData.eligibilityStatus?.map(
        (e) => ({ label: e, value: e })
      );
      InitDigitalData.inspectionType = InitDigitalData.inspectionType?.map(
        (e) => ({ label: e, value: e })
      );

      InitDigitalData.SolarInstallStatus = InitDigitalData.SolarInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.BatteryStorageInstallStatus = InitDigitalData.BatteryStorageInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.ASHPInstallStatus = InitDigitalData.ASHPInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.ESHInstallStatus = InitDigitalData.ESHInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.ASHPPumpsInstallStatus = InitDigitalData.ASHPPumpsInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );

      InitDigitalData.projectStatus = {
        label: props.singleLead?.status,
        value: props.singleLead?.status,
      }
      InitDigitalData.measuresBeingDone = InitDigitalData.measuresBeingDone?.map(
        (e) => ({ label: e.label || e, value: e.value || e })
      );
      
      setInitialData({ ...initialData, ...InitDigitalData });

      let data = { ...leadData.totalFloorState };
      data.preRating = InitDigitalData.PreEPRRating?.value || "";
      data.postRating = InitDigitalData.PostEPRRating?.value || "";
      data.absValue = InitDigitalData.ABS || 0;
      _updateTotalFloorState(data);
      if (InitDigitalData?.measuresBeingDone?.length > 0)
        setState({
          ...state,
          selectedMBD: InitDigitalData.measuresBeingDone.map((e) => e.label),
        });
    } else if (
      props.currentQuote?.digitalDashboard &&
      props.showingFrom === "viewQuote"
    ) {
      let InitDigitalData = { ...props.currentQuote?.digitalDashboard };

      InitDigitalData.BOUpgrade = InitDigitalData.BOUpgrade?.map((e) => ({
        label: e,
        value: e,
        color: leadDropdownColors[e],
      }));
      InitDigitalData.CIInstallStatus = InitDigitalData.CIInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.CBInstallStatus = InitDigitalData.CBInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.EWIInstallStatus = InitDigitalData.EWIInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.FTCHStatusOptions = InitDigitalData.FTCHStatusOptions?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.HCInstallStatus = InitDigitalData.HCInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.LIStatus = InitDigitalData.LIStatus?.map((e) => ({
        label: e,
        value: e,
        color: leadDropdownColors[e],
      }));
      InitDigitalData.SubmissionStatus = InitDigitalData.SubmissionStatus?.map(
        (e) => ({ label: e, value: e })
      );
      InitDigitalData.UFIInstallStatus = InitDigitalData.UFIInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.VentCoreInstallStatus = InitDigitalData.VentCoreInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.VentTVInstallStatus = InitDigitalData.VentTVInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.eligibilityStatus = InitDigitalData.eligibilityStatus?.map(
        (e) => ({ label: e, value: e })
      );
      InitDigitalData.inspectionType = InitDigitalData.inspectionType?.map(
        (e) => ({ label: e, value: e })
      );

      InitDigitalData.SolarInstallStatus = InitDigitalData.SolarInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.BatteryStorageInstallStatus = InitDigitalData.BatteryStorageInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.ASHPInstallStatus = InitDigitalData.ASHPInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.ESHInstallStatus = InitDigitalData.ESHInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );
      InitDigitalData.ASHPPumpsInstallStatus = InitDigitalData.ASHPPumpsInstallStatus?.map(
        (e) => ({ label: e, value: e, color: leadDropdownColors[e] })
      );

      // InitDigitalData.projectStatus = InitDigitalData.projectStatus?.map((e) => ({ label: e, value: e }))
      InitDigitalData.measuresBeingDone = InitDigitalData.measuresBeingDone?.map(
        (e) => ({ label: e.label || e, value: e.value || e })
      );
      setInitialData({ ...initialData, ...InitDigitalData });
      if (InitDigitalData?.measuresBeingDone?.length > 0)
        setState({
          ...state,
          selectedMBD: InitDigitalData.measuresBeingDone.map((e) => e.label),
        });

      let data = { ...leadData.totalFloorState };
      data.preRating = InitDigitalData.PreEPRRating?.value || "";
      data.postRating = InitDigitalData.PostEPRRating?.value || "";
      data.absValue = InitDigitalData.ABS || 0;
      _updateTotalFloorState(data);
    }
  }, []);

  const validationSchema = Yup.object().shape({
    // test: Yup.string().nullable().required("Service is Required"),
  });

  const handleChangeTotalFloorArea = (e, setFieldValue) => {
    let data = { ...leadData.totalFloorState };
    data.area = LeadTotalFloorAreaOptions[e.value];

    let findValue = LeadTotalFloorAreaOptions[e.value];
    if (data.preRating && data.postRating) {
      let key = data.preRating + "_" + data.postRating;
      data.absValue = findValue[key];
      setFieldValue(findValue[key]);
    }
    _updateTotalFloorState(data);
  };

  const handleChangePreRating = (e, setFieldValue) => {
    let data = { ...leadData.totalFloorState };
    data.preRating = e.value;

    if (e.value && data.postRating) {
      let key = e.value + "_" + data.postRating;
      data.absValue = data.area[key];
      setFieldValue("ABS", data.area[key]);
    }
    _updateTotalFloorState(data);
  };

  const handleChangePostRating = (e, setFieldValue) => {
    let data = { ...leadData.totalFloorState };
    data.postRating = e.value;

    if (data.preRating && e.value) {
      let key = data.preRating + "_" + e.value;
      data.absValue = data.area[key];
      setFieldValue("ABS", data.area[key]);
    }
    _updateTotalFloorState(data);
  };

  const getTotalMaterialCost = (values, setFieldValue) => {
    const materialArray = [];
    let totalMaterialCost = 0;

    if (values.measuresBeingDone && values.measuresBeingDone?.length > 0) {
      values.measuresBeingDone.map((e) => {
        if (
          e.label &&
          values[`materialCost_${e.label.replace(" ", "")}`] !== undefined
        ) {
          materialArray.push(
            values[`materialCost_${e.label.replace(" ", "")}`]
          );
        }
      });
    }

    if (materialArray.length > 0 && !materialArray.includes(undefined)) {
      materialArray.map((e, index) => {
        totalMaterialCost += e;
      });
    }
    setFieldValue("materialCost", totalMaterialCost);
    return totalMaterialCost;
  };

  const getTotalLabourCost = (values, setFieldValue) => {
    const materialArray = [];
    let totalLabourCost = 0;

    if (values.measuresBeingDone && values.measuresBeingDone?.length > 0) {
      values.measuresBeingDone.map((e) => {
        if (
          e.label &&
          values[`labourCost_${e.label.replace(" ", "")}`] !== undefined
        )
          materialArray.push(values[`labourCost_${e.label.replace(" ", "")}`]);
      });
    }
    if (materialArray.length > 0 && !materialArray.includes(undefined)) {
      materialArray.map((e, index) => {
        totalLabourCost += e;
      });
    }
    setFieldValue("labourCost", totalLabourCost);
    // return totalLabourCost
  };

  const getTotalProfit = (values) => {
    let totalCost =
      values.materialCost +
      values.labourCost +
      values.roofingMaterialCost +
      values.roofingLabourCost +
      values.plumbingMaterialCost +
      values.plumbingLabourCost +
      values.scaffoldingCost +
      values.leadGeneratorCost +
      values.surveyorCost +
      values.RCCost +
      values.additionalCost || 0;
    let valueTotal =
      values.valueNumber || values.ABS * values.ABSMultiplier || 0;
    return (values.contributionPayment + valueTotal) - totalCost || values.profit;
  };

  const selectDropdownStyles = {
    control: (styles) => ({
      ...styles,
      maxHeight: "80px",
    }),
    option: (styles, { data, isDisabled, isSelected, isFocused }) => {
      const color = data.color;
      return {
        ...styles,
        backgroundColor: isSelected ? data.color : color && fade(color, 0.1),
        color: data.color,
        ":active": {
          ...styles[":active"],
          backgroundColor: isSelected ? data.color : color && fade(color, 0.3),
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = data.color;
      return {
        ...styles,
        backgroundColor: color && fade(color, 0.1),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ":hover": {
        backgroundColor: data.color,
        color: "white",
      },
    }),
  };

  const selectDropdownStylesForSingle = {
    control: (styles) => ({
      ...styles,
      maxHeight: "80px",
    }),
    option: (styles, { data, isDisabled, isSelected, isFocused }) => {
      const color = data.color;
      return {
        ...styles,
        backgroundColor: isSelected ? data.color : fade(color, 0.1),
        color: isSelected ? "white" : data.color,
        ":active": {
          ...styles[":active"],
          backgroundColor: isSelected ? data.color : fade(color, 0.3),
        },
      };
    },
    singleValue: (styles, { data }) => {
      const color = data.color;
      return {
        ...styles,
        color: data.color,
      };
    },
    // singleValueLabel: (styles, { data }) => ({
    //     ...styles,
    //     color: data.color,
    // }),
    // singleValueRemove: (styles, { data }) => ({
    //     ...styles,
    //     color: data.color,
    //     ':hover': {
    //         backgroundColor: data.color,
    //         color: 'white',
    //     },
    // }),
  };

  const handleCloseDrawer = () => {
    setInstlInstructState({ ...instlInstructState, open: false });
  };

  const handleCloseModal = () => {
    setState({ ...state, soldServiceModal: false });
  };

  const handleChangeCheckbox = (service) => {
    let a = [];
    let s = service.toLowerCase();
    if (ischeckedEcoServices && ischeckedEcoServices.indexOf(s) !== -1) {
      const index = ischeckedEcoServices.indexOf(s);
      if (index > -1) {
        ischeckedEcoServices.splice(index, 1);
        a = ischeckedEcoServices;
      }
    } else {
      a = ischeckedEcoServices;
      a.push(s);
    }
    setIsCheckedEcoServices(a);
  };

  const generatePaidSolarQuote = (values) => {
    setState({ ...state, soldServiceModal: true });
  };

  const SoldServiceFun = () => {
    setStartLoader(true);
    let subServiceTypeArray = [...props?.singleLead?.subServiceType];
    let obj: any = {};
    obj.id = props?.singleLead?._id;
    if (props.singleLead?.Company?.lat || props.singleLead?.Consumer?.lat)
      obj.lat =
        props.singleLead?.Company?.lat || props.singleLead?.Consumer?.lat;
    if (props.singleLead?.Company?.lon || props.singleLead?.Consumer?.lon)
      obj.lon =
        props.singleLead?.Company?.lon || props.singleLead?.Consumer?.lon;

    obj.Supplier = "";
    obj.serviceType = "Eco";
    obj.serviceTypeArray = ["Eco"];

    // subServiceMapperObject
    if (ischeckedEcoServices) {
      let selectedSer = [...ischeckedEcoServices];
      let x = [];
      selectedSer.forEach((ele) => {
        x.push(subServiceMapperObject[ele]);
      });

      obj.subServiceTypeArray = subServiceTypeArray.filter(
        (e) => !x.includes(e)
      );
      obj.soldSubServiceTypeArray = x;
    }

    obj.serviceData = {
      eco: {
        subservice: {},
      },
    };

    ischeckedEcoServices.forEach((e) => {
      obj.serviceData.eco.subservice[e] = {};
    });

    props._soldService(obj);
    setTimeout(() => {
      setStartLoader(false);
      setState({ ...state, soldServiceModal: false });
    }, 2000);
  };

  const handleChangeMBD = (val) => {
    let arr = [];
    if (val && val.length > 0) arr = val.map((e) => e.label);
    setState({ ...state, selectedMBD: arr });
  };  

  return (
    <div style={{ width: "100%", padding: 10 }} className="lead-digital-dash">
      <Grid container justify="flex-end">
        <Button
          onClick={() =>
            setInstlInstructState({ ...instlInstructState, open: true })
          }
          type="button"
          variant="contained"
        >
          Installation Instruction
        </Button>
      </Grid>

      <Formik
        enableReinitialize
        initialValues={{ ...initialData }}
        onSubmit={(values) => {
          try {
            setStartLoader(true);
            if (leadData.totalFloorState.absValue)
              values.ABS = leadData.totalFloorState.absValue;
            if (values.BOUpgrade?.length > 0)
              values.BOUpgrade = values.BOUpgrade.map((e) => e.value);
            if (values.CIInstallStatus?.length > 0)
              values.CIInstallStatus = values.CIInstallStatus.map(
                (e) => e.value
              );
            if (values.CBInstallStatus?.length > 0)
              values.CBInstallStatus = values.CBInstallStatus.map(
                (e) => e.value
              );
            if (values.EWIInstallStatus?.length > 0)
              values.EWIInstallStatus = values.EWIInstallStatus.map(
                (e) => e.value
              );
            if (values.FTCHStatusOptions?.length > 0)
              values.FTCHStatusOptions = values.FTCHStatusOptions.map(
                (e) => e.value
              );
            if (values.HCInstallStatus?.length > 0)
              values.HCInstallStatus = values.HCInstallStatus.map(
                (e) => e.value
              );
            if (values.IWIInstallStatus?.length > 0)
              values.IWIInstallStatus = values.IWIInstallStatus.value;
            if (values.LIStatus?.length > 0)
              values.LIStatus = values.LIStatus.map((e) => e.value);

            if (values.SolarInstallStatus?.length > 0)
              values.SolarInstallStatus = values.SolarInstallStatus.map(
                (e) => e.value
              );
            if (values.BatteryStorageInstallStatus?.length > 0)
              values.BatteryStorageInstallStatus = values.BatteryStorageInstallStatus.map(
                (e) => e.value
              );
            if (values.ASHPInstallStatus?.length > 0)
              values.ASHPInstallStatus = values.ASHPInstallStatus.map(
                (e) => e.value
              );
            if (values.ESHInstallStatus?.length > 0)
              values.ESHInstallStatus = values.ESHInstallStatus.map(
                (e) => e.value
              );
            if (values.ASHPPumpsInstallStatus?.length > 0)
              values.ASHPPumpsInstallStatus = values.ASHPPumpsInstallStatus.map(
                (e) => e.value
              );

            if (values.SubSubmissionCompleted?.length > 0)
              values.SubSubmissionCompleted = values.SubSubmissionCompleted.map(
                (e) => e.value
              );
            if (values.SubSubmissionHandoverMonth?.length > 0)
              values.SubSubmissionHandoverMonth = values.SubSubmissionHandoverMonth.map(
                (e) => e.value
              );
            if (values.SubmissionStatus?.length > 0)
              values.SubmissionStatus = values.SubmissionStatus.map(
                (e) => e.value
              );
            if (values.UFIInstallStatus?.length > 0)
              values.UFIInstallStatus = values.UFIInstallStatus.map(
                (e) => e.value
              );
            if (values.VentCoreInstallStatus?.length > 0)
              values.VentCoreInstallStatus = values.VentCoreInstallStatus.map(
                (e) => e.value
              );
            if (values.VentExtFansInstallStatus?.length > 0)
              values.VentExtFansInstallStatus =
                values.VentExtFansInstallStatus.value;
            if (values.VentTVInstallStatus?.length > 0)
              values.VentTVInstallStatus = values.VentTVInstallStatus.map(
                (e) => e.value
              );
            if (values.eligibilityStatus?.length > 0)
              values.eligibilityStatus = values.eligibilityStatus.map(
                (e) => e.value
              );
            if (values.funder?.length > 0)
              values.funder = values.funder.map((e) => e.value);
            if (values.contributionRequired?.length > 0)
              values.contributionRequired = values.contributionRequired.map((e) => e.value);

            if (values.inspectionType?.length > 0)
              values.inspectionType = values.inspectionType.map((e) => e.value);
            if (values.measuresBeingDone?.value)
              values.measuresBeingDone = values.measuresBeingDone.value;
            if (
              props.singleLead?.Consumer?.mobile ||
              props.currentQuote?.Consumer?.mobile
            )
              values.customerNumber =
                props.singleLead?.Consumer?.mobile ||
                props.currentQuote?.Consumer?.mobile;

            delete values.leadGenerator;
            delete values.jobType;
            delete values.assignee;
            delete values.surveyor;

            let obj: any = {};
            obj.leadId = props.singleLead._id;
            obj.serviceType = props.singleLead.serviceType;
            obj.digitalDashboard = { ...values };
            props._leadUpdate({
              data: obj,
              showingFrom: currentProps.showingFrom,
            });
          } catch (error) {
            console.log("error--------", error);
          }
        }}
        validationSchema={validationSchema}
      >
        {(props) => {
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
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs>
                  <label htmlFor="lead">Lead</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="lead"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.lead}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="lead-error"
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="customerName">Customer Name</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="customerName"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.customerName}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="customerName-error"
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="customerNumber">Mobile Number</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="customerNumber"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.customerNumber}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="customerNumber-error"
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="customerEmail">Customer Email</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="customerEmail"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.customerEmail}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="customerEmail-error"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs>
                  <label htmlFor="firstLineOfadd">1st line of add</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="firstLineOfadd"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.firstLineOfadd}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="firstLineOfadd-error"
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="postcode">Post Code</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="postcode"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.postcode}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="postcode-error"
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="leadGenerator">Lead Generator</label>
                  <CreatableSelect
                    id="leadGenerator"
                    placeholder="---"
                    value={values.leadGenerator}
                    clearable
                    onChange={(e) => {
                      setFieldValue("leadGenerator", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                      singleValue: (styles) => ({
                        ...styles,
                        color: "#000000", // Change the text color for the selected value
                      }),
                    }}
                    isDisabled={true}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="leadGenerator-number-error"
                    name="leadGenerator"
                  // options={AssigneeList}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="jobType">Job Type</label>
                  <Select
                    id="jobType"
                    placeholder="---"
                    value={values.jobType}
                    isDisabled={true}
                    onChange={(e) => {
                      setFieldValue("jobType", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                      singleValue: (styles) => ({
                        ...styles,
                        color: "#000000", // Change the text color for the selected value
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="jobType-number-error"
                    name="jobType"
                    options={LeadJobTypeOptions}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs>
                  <label htmlFor="tenure">Tenure</label>
                  <Select
                    id="tenure"
                    placeholder="---"
                    value={values.tenure}
                    onChange={(e) => {
                      setFieldValue("tenure", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="tenure-number-error"
                    name="tenure"
                    options={LeadTenureOptions}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="projectStatus">Project Status</label>
                  <Select
                    id="projectStatus"
                    placeholder="---"
                    value={values.projectStatus}
                    onChange={(e) => {
                      setFieldValue("projectStatus", e);
                    }}
                    isDisabled={true}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                      singleValue: (styles) => ({
                        ...styles,
                        color: "#000000", // Change the text color for the selected value
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="projectStatus-number-error"
                    name="projectStatus"
                    options={LeadProjectStatusOptions}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="assignee">Assignee</label>
                  <Select
                    id="assignee"
                    placeholder="---"
                    value={values.assignee}
                    onChange={(e) => {
                      setFieldValue("assignee", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                      singleValue: (styles) => ({
                        ...styles,
                        color: "#000000", // Change the text color for the selected value
                      }),
                    }}
                    isDisabled={true}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="assignee-number-error"
                    name="assignee"
                    options={AssigneeList}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="surveyor">Surveyor</label>
                  <Select
                    id="surveyor"
                    placeholder="---"
                    value={values.surveyor}
                    onChange={(e) => {
                      setFieldValue("surveyor", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                      singleValue: (styles) => ({
                        ...styles,
                        color: "#000000", // Change the text color for the selected value
                      }),
                    }}
                    isDisabled={true}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="surveyor-number-error"
                    name="surveyor"
                    options={AssigneeList}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs>
                  <label htmlFor="surveyDate">Survey Date</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      clearable
                      variant="dialog"
                      inputVariant="outlined"
                      margin="normal"
                      id="surveyDate"
                      size="small"
                      className="WidhtFull100"
                      placeholder="Enter a date"
                      allowKeyboardControl
                      format="dd/MM/yyyy"
                      value={values.surveyDate ? values.surveyDate : null}
                      onChange={(e) => setFieldValue("surveyDate", e)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      aria-describedby="surveyDate-number-error"
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs>
                  <label htmlFor="RCAssigned">RC Assigned</label>
                  <Select
                    id="RCAssigned"
                    placeholder="---"
                    value={values.RCAssigned}
                    onChange={(e) => {
                      setFieldValue("RCAssigned", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="RCAssigned-number-error"
                    name="RCAssigned"
                    options={LeadRCAssignedOptions}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="RCDocsCompleted">RC Docs Completed</label>
                  <FormControlLabel
                    control={<Checkbox checked={values.RCDocsCompleted} />}
                    name="RCDocsCompleted"
                    label="Yes"
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="build">Build</label>
                  <Select
                    id="build"
                    placeholder="---"
                    value={values.build}
                    onChange={(e) => {
                      setFieldValue("build", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="build-number-error"
                    name="build"
                    options={LeadBuildOptions}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs>
                  <label htmlFor="totalFloorAreaM2">Total Floor Area M2</label>
                  <Select
                    id="totalFloorAreaM2"
                    placeholder="---"
                    value={values.totalFloorAreaM2}
                    onChange={(e) => {
                      setFieldValue("totalFloorAreaM2", e);
                      handleChangeTotalFloorArea(e, setFieldValue);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="totalFloorAreaM2-number-error"
                    name="totalFloorAreaM2"
                    options={LeadSAPOptions}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="PreEPRRating">PRE EPR Rating</label>
                  <Select
                    id="PreEPRRating"
                    placeholder="---"
                    value={values.PreEPRRating}
                    onChange={(e) => {
                      setFieldValue("PreEPRRating", e);
                      handleChangePreRating(e, setFieldValue);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="PreEPRRating-number-error"
                    name="PreEPRRating"
                    options={LeadPreEPRRating}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="PostEPRRating">Post EPR Rating</label>
                  <Select
                    id="PostEPRRating"
                    placeholder="---"
                    value={values.PostEPRRating}
                    onChange={(e) => {
                      setFieldValue("PostEPRRating", e);
                      handleChangePostRating(e, setFieldValue);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="PostEPRRating-number-error"
                    name="PostEPRRating"
                    options={LeadPostEPRRating}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="ABS">ABS</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="ABS"
                    type="number"
                    className="WidhtFull100"
                    placeholder="Enter a Number"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={leadData.totalFloorState?.absValue || values.ABS}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="ABS-error"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="ABSMultiplier">ABS Multiplier</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="ABSMultiplier"
                    type="number"
                    className="WidhtFull100"
                    placeholder="Enter a Number"
                    // defaultValue={state.absValue}
                    value={values.ABSMultiplier}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="ABSMultiplier-error"
                  />
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="surveyPics">
                    Survey Pics/Paperwork Uploaded (DB)
                  </label>
                  <FormControlLabel
                    control={<Checkbox checked={values.surveyPics} />}
                    name="surveyPics"
                    label="Yes"
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="measuresBeingDone">Measures Being Done</label>
                  <Select
                    id="measuresBeingDone"
                    placeholder="---"
                    value={values.measuresBeingDone}
                    isMulti
                    onChange={(e) => {
                      setFieldValue("measuresBeingDone", e);
                      handleChangeMBD(e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "120px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="measuresBeingDone-number-error"
                    name="measuresBeingDone"
                    options={MeasuresBeingOptions}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="surveyorNoteLink">Surveyor Notes link</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="surveyorNoteLink"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.surveyorNoteLink}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="surveyorNoteLink-error"
                  />
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="eligibilityRoute">Eligibility Route</label>
                  <Select
                    id="eligibilityRoute"
                    placeholder="---"
                    value={values.eligibilityRoute}
                    onChange={(e) => {
                      setFieldValue("eligibilityRoute", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="eligibilityRoute-number-error"
                    name="eligibilityRoute"
                    options={EligibilityRouteOptions}
                  />
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="eligibilityStatus">Eligibility Status</label>
                  <Select
                    id="eligibilityStatus"
                    placeholder="---"
                    value={values.eligibilityStatus}
                    onChange={(e) => {
                      setFieldValue("eligibilityStatus", e);
                    }}
                    isMulti
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="eligibilityStatus-number-error"
                    name="eligibilityStatus"
                    options={EligibilityStatusOptions}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="LAFlexSubDate">DM/LAFlex Sub date</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      clearable
                      variant="dialog"
                      inputVariant="outlined"
                      margin="normal"
                      id="LAFlexSubDate"
                      size="small"
                      className="WidhtFull100"
                      placeholder="Enter a date"
                      allowKeyboardControl
                      format="dd/MM/yyyy"
                      value={values.LAFlexSubDate ? values.LAFlexSubDate : null}
                      onChange={(e) => setFieldValue("LAFlexSubDate", e)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      aria-describedby="LAFlexSubDate-number-error"
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="DMCompleteDate">DM complete date</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      clearable
                      variant="dialog"
                      inputVariant="outlined"
                      margin="normal"
                      id="DMCompleteDate"
                      size="small"
                      className="WidhtFull100"
                      placeholder="Enter a date"
                      allowKeyboardControl
                      format="dd/MM/yyyy"
                      value={
                        values.DMCompleteDate ? values.DMCompleteDate : null
                      }
                      onChange={(e) => setFieldValue("DMCompleteDate", e)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      aria-describedby="DMCompleteDate-number-error"
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="LaFlexCompletedDate">
                    LAFLEX completed date
                  </label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      clearable
                      variant="dialog"
                      inputVariant="outlined"
                      margin="normal"
                      id="LaFlexCompletedDate"
                      size="small"
                      className="WidhtFull100"
                      placeholder="Enter a date"
                      allowKeyboardControl
                      format="dd/MM/yyyy"
                      value={
                        values.LaFlexCompletedDate
                          ? values.LaFlexCompletedDate
                          : null
                      }
                      onChange={(e) => setFieldValue("LaFlexCompletedDate", e)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      aria-describedby="LaFlexCompletedDate-number-error"
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="landRegistrationCheck">
                    Land Registration Check
                  </label>
                  <Select
                    id="landRegistrationCheck"
                    placeholder="---"
                    value={values.landRegistrationCheck}
                    onChange={(e) => {
                      setFieldValue("landRegistrationCheck", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="landRegistrationCheck-number-error"
                    name="landRegistrationCheck"
                    options={LandRegistrationCheckOptions}
                  />
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="crossCheckDocumentsDone">
                    Cross Check Documents Done
                  </label>
                  <FormControlLabel
                    control={
                      <Checkbox checked={values.crossCheckDocumentsDone} />
                    }
                    name="crossCheckDocumentsDone"
                    label="Yes"
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="documentCheckBy">Document Check By</label>
                  <Select
                    id="documentCheckBy"
                    placeholder="---"
                    value={values.documentCheckBy}
                    onChange={(e) => {
                      setFieldValue("documentCheckBy", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="documentCheckBy-number-error"
                    name="documentCheckBy"
                    options={AssigneeList}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="inspectionType">Inspection Type</label>
                  <Select
                    id="inspectionType"
                    placeholder="---"
                    value={values.inspectionType}
                    onChange={(e) => {
                      setFieldValue("inspectionType", e);
                    }}
                    isMulti
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    menuPlacement="top"
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="inspectionType-number-error"
                    name="inspectionType"
                    options={LeadInspectionOptions}
                  />
                </Grid>
              </Grid>

              {state.selectedMBD.includes("Cavity Bead") && (
                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="CBInstallerName">
                      Cavity Bead - Installer Name
                    </label>
                    <Select
                      id="CBInstallerName"
                      placeholder="---"
                      value={values.CBInstallerName}
                      onChange={(e) => {
                        setFieldValue("CBInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="CBInstallerName-number-error"
                      name="CBInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="CBInstallStatus">
                      Cavity Bead - Install Status
                    </label>
                    <Select
                      id="CBInstallStatus"
                      placeholder="---"
                      value={values.CBInstallStatus}
                      onChange={(e) => {
                        setFieldValue("CBInstallStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="CBInstallStatus-number-error"
                      name="CBInstallStatus"
                      options={LeadCIInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="CBStartDate">
                      Cavity Bead - Start Date
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="CBStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.CBStartDate ? values.CBStartDate : null}
                        onChange={(e) => setFieldValue("CBStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="CBStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("Cavity Bead") && (
                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="SubPrepCB">Sub Prep - Cavity Bead</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepCB"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.SubPrepCB ? values.SubPrepCB : null}
                        onChange={(e) => setFieldValue("SubPrepCB", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepCB-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="CB_batchNumber">
                      Cavity Bead - Batch Number
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="CB_batchNumber"
                      className="WidhtFull100"
                      placeholder="Enter batch number"
                      value={values.CB_batchNumber}
                      InputLabelProps={{ shrink: false }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="CB_batchNumber-error"
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="CB_glueQuantity">
                      Cavity Bead - Quantity of Glue
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="CB_glueQuantity"
                      className="WidhtFull100"
                      placeholder="Enter Quantity of Glue"
                      value={values.CB_glueQuantity}
                      InputLabelProps={{ shrink: false }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="CB_glueQuantity-error"
                    />
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("CI") && (
                <Grid container spacing={3}>
                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="CIInstallerName">CI - Installer Name</label>
                    <Select
                      id="CIInstallerName"
                      placeholder="---"
                      value={values.CIInstallerName}
                      onChange={(e) => {
                        setFieldValue("CIInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="CIInstallerName-number-error"
                      name="CIInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="CIInstallStatus">CI - Install Status</label>
                    <Select
                      id="CIInstallStatus"
                      placeholder="---"
                      value={values.CIInstallStatus}
                      onChange={(e) => {
                        setFieldValue("CIInstallStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="CIInstallStatus-number-error"
                      name="CIInstallStatus"
                      options={LeadCIInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="CIStartDate">CI - Start Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="CIStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.CIStartDate ? values.CIStartDate : null}
                        onChange={(e) => setFieldValue("CIStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="CIStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="SubPrepCI">Sub Prep - CI</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepCI"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.SubPrepCI ? values.SubPrepCI : null}
                        onChange={(e) => setFieldValue("SubPrepCI", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepCI-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("LI") && (
                <Grid container spacing={3}>
                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="LIInstallerName">LI - Installer Name</label>
                    <Select
                      id="LIInstallerName"
                      placeholder="---"
                      value={values.LIInstallerName}
                      onChange={(e) => {
                        setFieldValue("LIInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="LIInstallerName-number-error"
                      name="LIInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="LIStatus">LI - Installer Status</label>
                    <Select
                      id="LIStatus"
                      placeholder="---"
                      value={values.LIStatus}
                      onChange={(e) => {
                        setFieldValue("LIStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="LIStatus-number-error"
                      name="LIStatus"
                      options={LeadLIStatusOptions}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="LIStartDate">LI - Start Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="LIStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.LIStartDate ? values.LIStartDate : null}
                        onChange={(e) => setFieldValue("LIStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="LIStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="SubPrepLi">Sub Prep - LI</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepLi"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.SubPrepLi ? values.SubPrepLi : null}
                        onChange={(e) => setFieldValue("SubPrepLi", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepLi-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("UFI") && (
                <Grid container spacing={3}>
                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="UFIInstallerName">
                      UFI - Installer Name
                    </label>
                    <Select
                      id="UFIInstallerName"
                      placeholder="---"
                      value={values.UFIInstallerName}
                      onChange={(e) => {
                        setFieldValue("UFIInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="UFIInstallerName-number-error"
                      name="UFIInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="UFIInstallStatus">
                      UFI - Install Status
                    </label>
                    <Select
                      id="UFIInstallStatus"
                      placeholder="---"
                      value={values.UFIInstallStatus}
                      onChange={(e) => {
                        setFieldValue("UFIInstallStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="UFIInstallStatus-number-error"
                      name="UFIInstallStatus"
                      options={LeadUFIInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="UFIStartDate">UFI - Start Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="UFIStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.UFIStartDate ? values.UFIStartDate : null}
                        onChange={(e) => setFieldValue("UFIStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="UFIStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="SubPrepUFI">Sub Prep - UFI</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepUFI"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.SubPrepUFI ? values.SubPrepUFI : null}
                        onChange={(e) => setFieldValue("SubPrepUFI", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepUFI-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("FTCH") && (
                <Grid container spacing={3}>
                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="UFIInstallerName">
                      FTCH - Installer Name
                    </label>
                    <Select
                      id="FTCHInstallerName"
                      placeholder="---"
                      value={values.FTCHInstallerName}
                      onChange={(e) => {
                        setFieldValue("FTCHInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="FTCHInstallerName-number-error"
                      name="FTCHInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="FTCHStatusOptions">FTCH - Status</label>
                    <Select
                      id="FTCHStatusOptions"
                      placeholder="---"
                      value={values.FTCHStatusOptions}
                      onChange={(e) => {
                        setFieldValue("FTCHStatusOptions", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="FTCHStatusOptions-number-error"
                      name="FTCHStatusOptions"
                      options={LeadFTCHStatusOptions}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="FTCHStartDate">FTCH - Start Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="FTCHStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.FTCHStartDate ? values.FTCHStartDate : null
                        }
                        onChange={(e) => setFieldValue("FTCHStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="FTCHStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="SubPrepFTCH">Sub Prep - FTCH</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepFTCH"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.SubPrepFTCH ? values.SubPrepFTCH : null}
                        onChange={(e) => setFieldValue("SubPrepFTCH", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepFTCH-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("BO - Upgrade") && (
                <Grid container spacing={3}>
                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="BOInstallerName">BO - Installer Name</label>
                    <Select
                      id="BOInstallerName"
                      placeholder="---"
                      value={values.BOInstallerName}
                      onChange={(e) => {
                        setFieldValue("BOInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="BOInstallerName-number-error"
                      name="BOInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="BOUpgrade">BO - Install Status</label>
                    <Select
                      id="BOUpgrade"
                      placeholder="---"
                      value={values.BOUpgrade}
                      onChange={(e) => {
                        setFieldValue("BOUpgrade", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="BOUpgrade-number-error"
                      name="BOUpgrade"
                      options={LeadBOUpgradeOptions}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="BOInstallDate">BO - Install Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="BOInstallDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.BOInstallDate ? values.BOInstallDate : null
                        }
                        onChange={(e) => setFieldValue("BOInstallDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="BOInstallDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="SubPrepBOUpgrade">
                      Sub Prep - BO Upgrade
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepBOUpgrade"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.SubPrepBOUpgrade
                            ? values.SubPrepBOUpgrade
                            : null
                        }
                        onChange={(e) => setFieldValue("SubPrepBOUpgrade", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepBOUpgrade-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("Heat Controls") && (
                <Grid container spacing={3}>
                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="HCInstallerName">HC - Installer Name</label>
                    <Select
                      id="HCInstallerName"
                      placeholder="---"
                      value={values.HCInstallerName}
                      onChange={(e) => {
                        setFieldValue("HCInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="HCInstallerName-number-error"
                      name="HCInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="HCInstallStatus">HC - Install Status</label>
                    <Select
                      id="HCInstallStatus"
                      placeholder="---"
                      value={values.HCInstallStatus}
                      onChange={(e) => {
                        setFieldValue("HCInstallStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="HCInstallStatus-number-error"
                      name="HCInstallStatus"
                      options={LeadHCInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="HCStartDate">HC - Start Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="HCStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.HCStartDate ? values.HCStartDate : null}
                        onChange={(e) => setFieldValue("HCStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="HCStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="SubPrepHC">Sub Prep - HC</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepHC"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.SubPrepHC ? values.SubPrepHC : null}
                        onChange={(e) => setFieldValue("SubPrepHC", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepHC-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("IWI") && (
                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="IWIInstallerName">
                      IWI - Installer Name
                    </label>
                    <Select
                      id="IWIInstallerName"
                      placeholder="---"
                      value={values.IWIInstallerName}
                      onChange={(e) => {
                        setFieldValue("IWIInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="IWIInstallerName-number-error"
                      name="IWIInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="IWIInstallStatus">
                      IWI - Install Status
                    </label>
                    <Select
                      id="IWIInstallStatus"
                      placeholder="---"
                      value={values.IWIInstallStatus}
                      onChange={(e) => {
                        setFieldValue("IWIInstallStatus", e);
                      }}
                      styles={selectDropdownStylesForSingle}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="IWIInstallStatus-number-error"
                      name="IWIInstallStatus"
                      options={LeadIWIInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="IWIStartDate">IWI - Start Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="IWIStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.IWIStartDate ? values.IWIStartDate : null}
                        onChange={(e) => setFieldValue("IWIStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="IWIStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("EWI") && (
                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="EWIInstallerName">
                      EWI - Installer Name
                    </label>
                    <Select
                      id="EWIInstallerName"
                      placeholder="---"
                      value={values.EWIInstallerName}
                      onChange={(e) => {
                        setFieldValue("EWIInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="EWIInstallerName-number-error"
                      name="EWIInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="EWIInstallStatus">
                      EWI - Install Status
                    </label>
                    <Select
                      id="EWIInstallStatus"
                      placeholder="---"
                      value={values.EWIInstallStatus}
                      onChange={(e) => {
                        setFieldValue("EWIInstallStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="EWIInstallStatus-number-error"
                      name="EWIInstallStatus"
                      options={LeadIWIInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="EWIInstallDate">EWI - Install Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="EWIInstallDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.EWIInstallDate ? values.EWIInstallDate : null
                        }
                        onChange={(e) => setFieldValue("EWIInstallDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="EWIInstallDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("VENT") && (
                <Grid container spacing={3}>
                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="VentTVInstallerName">
                      Vent TV - Installer Name
                    </label>
                    <Select
                      id="VentTVInstallerName"
                      placeholder="---"
                      value={values.VentTVInstallerName}
                      onChange={(e) => {
                        setFieldValue("VentTVInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="VentTVInstallerName-number-error"
                      name="VentTVInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="VentTVInstallStatus">
                      Vent TV - Install Status
                    </label>
                    <Select
                      id="VentTVInstallStatus"
                      placeholder="---"
                      value={values.VentTVInstallStatus}
                      onChange={(e) => {
                        setFieldValue("VentTVInstallStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="VentTVInstallStatus-number-error"
                      name="VentTVInstallStatus"
                      options={LeadIWIInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="VentTVStartDate">
                      Vent - TV Start Date
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="VentTVStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.VentTVStartDate ? values.VentTVStartDate : null
                        }
                        onChange={(e) => setFieldValue("VentTVStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="VentTVStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="VentExtFansInstallStatus">
                      Vent - EXT Fans Install Status
                    </label>
                    <Select
                      id="VentExtFansInstallStatus"
                      placeholder="---"
                      value={values.VentExtFansInstallStatus}
                      onChange={(e) => {
                        setFieldValue("VentExtFansInstallStatus", e);
                      }}
                      styles={selectDropdownStylesForSingle}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="VentExtFansInstallStatus-number-error"
                      name="VentExtFansInstallStatus"
                      options={LeadIWIInstallStatusOptions}
                    />
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("VENT") && (
                <Grid container spacing={3}>
                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="VentExtFansInstallDate">
                      Vent - Ext Fans Install Date
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="VentExtFansInstallDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.VentExtFansInstallDate
                            ? values.VentExtFansInstallDate
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("VentExtFansInstallDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="VentExtFansInstallDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="VentCoreInstallStatus">
                      Vent - Core Vents Install Status
                    </label>
                    <Select
                      id="VentCoreInstallStatus"
                      placeholder="---"
                      value={values.VentCoreInstallStatus}
                      onChange={(e) => {
                        setFieldValue("VentCoreInstallStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="VentCoreInstallStatus-number-error"
                      name="VentCoreInstallStatus"
                      options={LeadIWIInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item md={4} sm={6} xs={12}>
                    <label htmlFor="VentCoreInstallDate">
                      Vent - Core Vents Install Date
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="VentCoreInstallDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.VentCoreInstallDate
                            ? values.VentCoreInstallDate
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("VentCoreInstallDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="VentCoreInstallDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("Solar") && (
                <Grid container spacing={3}>
                  <Grid item xs>
                    <label htmlFor="SolarInstallerName">
                      Solar - Installer Name
                    </label>
                    <Select
                      id="SolarInstallerName"
                      placeholder="---"
                      value={values.SolarInstallerName}
                      onChange={(e) => {
                        setFieldValue("SolarInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="SolarInstallerName-number-error"
                      name="SolarInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="SolarInstallStatus">
                      Solar - Install Status
                    </label>
                    <Select
                      id="SolarInstallStatus"
                      placeholder="---"
                      value={values.SolarInstallStatus}
                      onChange={(e) => {
                        setFieldValue("SolarInstallStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="SolarInstallStatus-number-error"
                      name="SolarInstallStatus"
                      options={LeadIWIInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="SolarStartDate">Solar - Start Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SolarStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.SolarStartDate ? values.SolarStartDate : null
                        }
                        onChange={(e) => setFieldValue("SolarStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SolarStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="SolarInstallDate">
                      Solar - Install Date
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SolarInstallDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.SolarInstallDate
                            ? values.SolarInstallDate
                            : null
                        }
                        onChange={(e) => setFieldValue("SolarInstallDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SolarInstallDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="SubPrepSolar">Sub Prep - Solar</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepSolar"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.SubPrepSolar ? values.SubPrepSolar : null}
                        onChange={(e) => setFieldValue("SubPrepSolar", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepSolar-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("ASHP PUMPS") && (
                <Grid container spacing={3}>
                  <Grid item xs>
                    <label htmlFor="ASHPPumpInstallerName">
                      ASHP PUMPS - Installer Name
                    </label>
                    <Select
                      id="ASHPPumpInstallerName"
                      placeholder="---"
                      value={values.ASHPPumpInstallerName}
                      onChange={(e) => {
                        setFieldValue("ASHPPumpInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="ASHPPumpInstallerName-number-error"
                      name="ASHPPumpInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="ASHPPumpsInstallStatus">
                      ASHP PUMPS - Install Status
                    </label>
                    <Select
                      id="ASHPPumpsInstallStatus"
                      placeholder="---"
                      value={values.ASHPPumpsInstallStatus}
                      onChange={(e) => {
                        setFieldValue("ASHPPumpsInstallStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="ASHPPumpsInstallStatus-number-error"
                      name="ASHPPumpsInstallStatus"
                      options={LeadIWIInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="ASHPPumpsStartDate">
                      ASHP PUMPS Start Date
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="ASHPPumpsStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.ASHPPumpsStartDate
                            ? values.ASHPPumpsStartDate
                            : null
                        }
                        onChange={(e) => setFieldValue("ASHPPumpsStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="ASHPPumpsStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="ASHPPumpsInstallDate">
                      ASHP PUMPS Install Date
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="ASHPPumpsInstallDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.ASHPPumpsInstallDate
                            ? values.ASHPPumpsInstallDate
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("ASHPPumpsInstallDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="ASHPPumpsInstallDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="SubPrepASHPPumps">
                      Sub Prep - ASHP PUMPS
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepASHPPumps"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.SubPrepASHPPumps
                            ? values.SubPrepASHPPumps
                            : null
                        }
                        onChange={(e) => setFieldValue("SubPrepASHPPumps", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepASHPPumps-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("ESH") && (
                <Grid container spacing={3}>
                  <Grid item xs>
                    <label htmlFor="ESHInstallerName">
                      ESH - Installer Name
                    </label>
                    <Select
                      id="ESHInstallerName"
                      placeholder="---"
                      value={values.ESHInstallerName}
                      onChange={(e) => {
                        setFieldValue("ESHInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="ESHInstallerName-number-error"
                      name="ESHInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="ESHInstallStatus">
                      ESH - Install Status
                    </label>
                    <Select
                      id="ESHInstallStatus"
                      placeholder="---"
                      value={values.ESHInstallStatus}
                      onChange={(e) => {
                        setFieldValue("ESHInstallStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="ESHInstallStatus-number-error"
                      name="ESHInstallStatus"
                      options={LeadIWIInstallStatusOptions}
                    />
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="ESHStartDate">ESH - Start Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="ESHStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.ESHStartDate ? values.ESHStartDate : null}
                        onChange={(e) => setFieldValue("ESHStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="ESHStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="ESHInstallDate">ESH - Install Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="ESHInstallDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.ESHInstallDate ? values.ESHInstallDate : null
                        }
                        onChange={(e) => setFieldValue("ESHInstallDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="ESHInstallDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs>
                    <label htmlFor="SubPrepESH">Sub Prep - ESH</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepESH"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.SubPrepESH ? values.SubPrepESH : null}
                        onChange={(e) => setFieldValue("SubPrepESH", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepESH-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("RIR") && (
                <Grid container spacing={3}>
                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="RIRInstallerName">
                      RIR - Installer Name
                    </label>
                    <Select
                      id="RIRInstallerName"
                      placeholder="---"
                      value={values.RIRInstallerName}
                      onChange={(e) => {
                        setFieldValue("RIRInstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="RIRInstallerName-number-error"
                      name="RIRInstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="RITStatus">RIR - Status</label>
                    <Select
                      id="RIRStatus"
                      placeholder="---"
                      value={values.RIRStatus}
                      onChange={(e) => {
                        setFieldValue("RIRStatus", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="RIRStatus-number-error"
                      name="RIRStatus"
                      options={LeadLIStatusOptions}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="RIRStartDate">RIR - Start Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="RIRStartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.RIRStartDate ? values.RIRStartDate : null}
                        onChange={(e) => setFieldValue("RIRStartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="RIRStartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="SubPrepRIR">Sub Prep - RIR</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepRIR"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.SubPrepRIR ? values.SubPrepRIR : null}
                        onChange={(e) => setFieldValue("SubPrepRIR", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepRIR-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              {state.selectedMBD.includes("Choice 11") && (
                <Grid container spacing={3}>
                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="Choice11InstallerName">
                      Choice 11 - Installer Name
                    </label>
                    <Select
                      id="Choice11InstallerName"
                      placeholder="---"
                      value={values.Choice11InstallerName}
                      onChange={(e) => {
                        setFieldValue("Choice11InstallerName", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "#000000", // Change the text color for the selected value
                        }),
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="Choice11InstallerName-number-error"
                      name="Choice11InstallerName"
                      options={AssigneeList}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="Choice11Status">Choice 11 - Status</label>
                    <Select
                      id="Choice11Status"
                      placeholder="---"
                      value={values.Choice11Status}
                      onChange={(e) => {
                        setFieldValue("Choice11Status", e);
                      }}
                      isMulti
                      styles={selectDropdownStyles}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="Choice11Status-number-error"
                      name="Choice11Status"
                      options={LeadLIStatusOptions}
                    />
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="Choice11StartDate">
                      Choice 11 - Start Date
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="Choice11StartDate"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.Choice11StartDate
                            ? values.Choice11StartDate
                            : null
                        }
                        onChange={(e) => setFieldValue("Choice11StartDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="Choice11StartDate-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="SubPrepChoice11">
                      Sub Prep - Choice 11
                    </label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="SubPrepChoice11"
                        size="small"
                        className="WidhtFull100"
                        placeholder="Enter a date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.SubPrepChoice11 ? values.SubPrepChoice11 : null
                        }
                        onChange={(e) => setFieldValue("SubPrepChoice11", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="SubPrepChoice11-number-error"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={3}>
                <Grid item xs>
                  <label htmlFor="SubSentForTrustMark">
                    Sub - Sent for TrustMark
                  </label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      clearable
                      variant="dialog"
                      inputVariant="outlined"
                      margin="normal"
                      id="SubSentForTrustMark"
                      size="small"
                      className="WidhtFull100"
                      placeholder="Enter a date"
                      allowKeyboardControl
                      format="dd/MM/yyyy"
                      value={
                        values.SubSentForTrustMark
                          ? values.SubSentForTrustMark
                          : null
                      }
                      onChange={(e) => setFieldValue("SubSentForTrustMark", e)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      aria-describedby="SubSentForTrustMark-number-error"
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs>
                  <label htmlFor="SubSubmissionCompleted">
                    Sub - Submission Completed by
                  </label>
                  <Select
                    id="SubSubmissionCompleted"
                    placeholder="---"
                    value={values.SubSubmissionCompleted}
                    onChange={(e) => {
                      setFieldValue("SubSubmissionCompleted", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    menuPlacement="top"
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="SubSubmissionCompleted-number-error"
                    name="SubSubmissionCompleted"
                    options={LeadSubSubmissionCompleteBy}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="SubSubmissionHandoverMonth">
                    Sub - Submission Handover Month
                  </label>
                  <Select
                    id="SubSubmissionHandoverMonth"
                    placeholder="---"
                    value={values.SubSubmissionHandoverMonth}
                    onChange={(e) => {
                      setFieldValue("SubSubmissionHandoverMonth", e);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    menuPlacement="top"
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="SubSubmissionHandoverMonth-number-error"
                    name="SubSubmissionHandoverMonth"
                    options={LeadSubSubmissionHandoverMonthOptions}
                  />
                </Grid>

                <Grid item xs>
                  <label htmlFor="SubSubmissionDate">
                    Sub - Submission date
                  </label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      clearable
                      variant="dialog"
                      inputVariant="outlined"
                      margin="normal"
                      id="SubSubmissionDate"
                      size="small"
                      className="WidhtFull100"
                      placeholder="Enter a date"
                      allowKeyboardControl
                      format="dd/MM/yyyy"
                      value={
                        values.SubSubmissionDate
                          ? values.SubSubmissionDate
                          : null
                      }
                      onChange={(e) => setFieldValue("SubSubmissionDate", e)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      aria-describedby="SubSubmissionDate-number-error"
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs>
                  <label htmlFor="SubmissionStatus">Submission Status</label>
                  <Select
                    id="SubmissionStatus"
                    placeholder="---"
                    value={values.SubmissionStatus}
                    onChange={(e) => {
                      setFieldValue("SubmissionStatus", e);
                    }}
                    isMulti
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    menuPlacement="top"
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="SubmissionStatus-number-error"
                    name="SubmissionStatus"
                    options={LeadSubmissionStatusOptions}
                  />
                </Grid>
              </Grid>

              {AM.includes(currentProps.slug) && (
                <Grid container spacing={3}>
                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="funder">Funder</label>
                    <Select
                      id="funder"
                      placeholder="---"
                      value={values.funder}
                      onChange={(e) => {
                        setFieldValue("funder", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                      }}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="funder-number-error"
                      name="funder"
                      options={LeadFunderOptions}
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="contributionRequired">Contribution Required</label>
                    <Select
                      id="contributionRequired"
                      placeholder="---"
                      value={values.contributionRequired}
                      onChange={(e) => {
                        setFieldValue("contributionRequired", e);
                      }}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          maxHeight: "80px",
                        }),
                      }}
                      menuPlacement="top"
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="contributionRequired-number-error"
                      name="contributionRequired"
                      options={yesAndNoOptions}
                    />
                  </Grid>

                  {values.contributionRequired?.value === "YES" && (
                    <Grid item md={2} sm={6} xs={12}>
                      <label htmlFor="contributionPayment">Contribution Payment</label>
                      <TextField
                        variant="outlined"
                        size="small"
                        id="contributionPayment"
                        type="number"
                        className="WidhtFull100"
                        placeholder="Enter a number"
                        value={values.contributionPayment}
                        InputLabelProps={{ shrink: false }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="contributionPayment-error"
                      />
                    </Grid>
                  )}

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="valueNumber">Value</label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="valueNumber"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={
                        values.valueNumber || values.ABS * values.ABSMultiplier
                      }
                      InputLabelProps={{ shrink: false }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="valueNumber-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="paymentReceived">Payment Received</label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="paymentReceived"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={values.paymentReceived}
                      InputLabelProps={{ shrink: false }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="paymentReceived-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="outstandingPayment">
                      Outstanding Payment
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="outstandingPayment"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={
                        values.valueNumber - values.paymentReceived ||
                        values.outstandingPayment
                      }
                      InputLabelProps={{ shrink: false }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="outstandingPayment-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="roofingMaterialCost">
                      Roofing Material Cost
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="roofingMaterialCost"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={values.roofingMaterialCost}
                      InputLabelProps={{ shrink: false }}
                      onChange={(e: any) => {
                        if (e.target.value === "" || e.target.value < 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          handleChange({
                            ...e,
                            target: { ...e.target, value: 0 },
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="roofingMaterialCost-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="roofingLabourCost">
                      Roofing Labour Cost
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="roofingLabourCost"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={values.roofingLabourCost}
                      InputLabelProps={{ shrink: false }}
                      onChange={(e: any) => {
                        if (e.target.value === "" || e.target.value < 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          handleChange({
                            ...e,
                            target: { ...e.target, value: 0 },
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="roofingLabourCost-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="plumbingMaterialCost">
                      Plumbing Material Cost
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="plumbingMaterialCost"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={values.plumbingMaterialCost}
                      InputLabelProps={{ shrink: false }}
                      onChange={(e: any) => {
                        if (e.target.value === "" || e.target.value < 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          handleChange({
                            ...e,
                            target: { ...e.target, value: 0 },
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="plumbingMaterialCost-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="plumbingLabourCost">
                      Plumbing Labour Cost
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="plumbingLabourCost"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={values.plumbingLabourCost}
                      InputLabelProps={{ shrink: false }}
                      onChange={(e: any) => {
                        if (e.target.value === "" || e.target.value < 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          handleChange({
                            ...e,
                            target: { ...e.target, value: 0 },
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="plumbingLabourCost-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="scaffoldingCost">Scaffolding Cost</label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="scaffoldingCost"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={values.scaffoldingCost}
                      InputLabelProps={{ shrink: false }}
                      onChange={(e: any) => {
                        if (e.target.value === "" || e.target.value < 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          handleChange({
                            ...e,
                            target: { ...e.target, value: 0 },
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="scaffoldingCost-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="leadGeneratorCost">
                      Lead Generator Cost
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="leadGeneratorCost"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={values.leadGeneratorCost}
                      InputLabelProps={{ shrink: false }}
                      onChange={(e: any) => {
                        if (e.target.value === "" || e.target.value < 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          handleChange({
                            ...e,
                            target: { ...e.target, value: 0 },
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="leadGeneratorCost-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="surveyorCost">Surveyor Cost</label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="surveyorCost"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={values.surveyorCost}
                      InputLabelProps={{ shrink: false }}
                      onChange={(e: any) => {
                        if (e.target.value === "" || e.target.value < 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          handleChange({
                            ...e,
                            target: { ...e.target, value: 0 },
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="surveyorCost-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="RCCost">RC Cost</label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="RCCost"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={values.RCCost}
                      InputLabelProps={{ shrink: false }}
                      onChange={(e: any) => {
                        if (e.target.value === "" || e.target.value < 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          handleChange({
                            ...e,
                            target: { ...e.target, value: 0 },
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="RCCost-error"
                    />
                  </Grid>

                  <Grid item md={2} sm={6} xs={12}>
                    <label htmlFor="additionalCost">ADDITIONAL COST</label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="additionalCost"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={values.additionalCost}
                      InputLabelProps={{ shrink: false }}
                      onChange={(e: any) => {
                        if (e.target.value === "" || e.target.value < 0) {
                          e.stopPropagation();
                          e.preventDefault();
                          handleChange({
                            ...e,
                            target: { ...e.target, value: 0 },
                          });
                        } else {
                          handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="additionalCost-error"
                    />
                  </Grid>
                </Grid>
              )}

              {AM.includes(currentProps.slug) && (
                <Grid container spacing={3}>
                  {values.measuresBeingDone &&
                    values.measuresBeingDone?.length > 0 &&
                    values.measuresBeingDone.map((item, index) => (
                      <Grid item md={2} sm={4} xs={12} key={index}>
                        <label
                          htmlFor={`materialCost_${item.label.replace(
                            " ",
                            ""
                          )}`}
                        >
                          Material Cost of {item.label}
                        </label>
                        <TextField
                          variant="outlined"
                          size="small"
                          id={`materialCost_${item.label.replace(" ", "")}`}
                          type="number"
                          className="WidhtFull100"
                          placeholder="Enter a number"
                          value={
                            values[
                            `materialCost_${item.label.replace(" ", "")}`
                            ]
                          }
                          InputLabelProps={{ shrink: false }}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          margin="normal"
                          aria-describedby={`materialCost_${item.label.replace(
                            " ",
                            ""
                          )}-error`}
                        />
                      </Grid>
                    ))}

                  <React.Fragment>
                    <Grid item md={2} sm={6} xs={12}>
                      <label htmlFor="materialCost">Total Material Cost</label>
                      <TextField
                        variant="outlined"
                        size="small"
                        id="materialCost"
                        type="number"
                        className="WidhtFull100"
                        placeholder="Enter a number"
                        value={values.materialCost}
                        InputLabelProps={{ shrink: false }}
                        InputProps={{ readOnly: true }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="materialCost-error"
                      />
                    </Grid>
                    <Grid item md={1} sm={3} xs={12}>
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ marginTop: 23 }}
                        size="medium"
                        onClick={() =>
                          getTotalMaterialCost(values, setFieldValue)
                        }
                      >
                        Calculate
                      </Button>
                    </Grid>
                  </React.Fragment>
                </Grid>
              )}

              {AM.includes(currentProps.slug) && (
                <Grid container spacing={3}>
                  {values.measuresBeingDone &&
                    values.measuresBeingDone?.length > 0 &&
                    values.measuresBeingDone.map((item, index) => (
                      <Grid item md={2} sm={6} xs={12} key={index}>
                        <label
                          htmlFor={`labourCost_${item.label.replace(" ", "")}`}
                        >
                          Labour Cost of {item.label}
                        </label>
                        <TextField
                          variant="outlined"
                          size="small"
                          id={`labourCost_${item.label.replace(" ", "")}`}
                          type="number"
                          className="WidhtFull100"
                          placeholder="Enter a number"
                          value={
                            values[`labourCost_${item.label.replace(" ", "")}`]
                          }
                          InputLabelProps={{ shrink: false }}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          margin="normal"
                          aria-describedby={`labourCost_${item.label.replace(
                            " ",
                            ""
                          )}-error`}
                        />
                      </Grid>
                    ))}

                  <React.Fragment>
                    <Grid item md={2} sm={6} xs={12}>
                      <label htmlFor="labourCost">Total Labour Cost</label>
                      <TextField
                        variant="outlined"
                        size="small"
                        id="labourCost"
                        type="number"
                        className="WidhtFull100"
                        placeholder="Enter a number"
                        value={values.labourCost}
                        InputLabelProps={{ shrink: false }}
                        InputProps={{ readOnly: true }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="labourCost-error"
                      />
                    </Grid>
                    <Grid item md={1} sm={3} xs={12}>
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ marginTop: 23 }}
                        size="medium"
                        onClick={() =>
                          getTotalLabourCost(values, setFieldValue)
                        }
                      >
                        Calculate
                      </Button>
                    </Grid>
                  </React.Fragment>
                </Grid>
              )}

              <Grid container spacing={3}>
                {AM.includes(currentProps.slug) && (
                  <Grid item md={3} sm={6} xs={12}>
                    <label htmlFor="profit">Profit</label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="profit"
                      type="number"
                      className="WidhtFull100"
                      placeholder="Enter a number"
                      value={getTotalProfit(values)}
                      InputLabelProps={{ shrink: false }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="profit-error"
                    />
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={8} sm={6} xs={12}>
                  <label htmlFor="notes">Notes</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="notes"
                    type="number"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    multiline
                    rows={5}
                    value={values.notes}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="notes-error"
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="attachments">Attachments</label>
                  <DropzoneArea
                    filesLimit={1}
                    dropzoneText="Add Attachments"
                    maxFileSize={15000000}
                    onChange={(files) => {
                      if (files.length > 0) {
                        setFileUpload({ ...fileUpload, fileLoading: true });

                        const data = new FormData();
                        data.append("image", files[0]);

                        axios({
                          method: "post",
                          url: baseURL + "upload",
                          data: data,
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                          },
                        })
                          .then((response) => {
                            setFieldValue(
                              "attachments",
                              response.data?.data?.image[0]?.location || ""
                            );
                            setFileUpload({
                              ...fileUpload,
                              fileLoading: false,
                              fileData: response.data?.data?.image[0]?.location,
                            });
                          })
                          .catch((resp) => {
                            setFileUpload({
                              ...fileUpload,
                              fileLoading: false,
                            });
                          });
                      }
                    }}
                    dropzoneClass="drop_lead_upload_data"
                  />

                  {initialData.attachments.length > 0 && (
                    <a
                      href={initialData.attachments}
                      style={{ marginTop: 10, display: "block" }}
                      target="_blank"
                    >
                      View Attachments
                    </a>
                  )}
                </Grid>
              </Grid>

              {currentProps.showingFrom !== "viewQuote" && (
                <Grid container spacing={3}>
                  <Grid item>
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      type="button"
                      onClick={() => generatePaidSolarQuote(values)}
                    // disabled={fileUpload.fileLoading}
                    >
                      Generate Quote
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={fileUpload.fileLoading}
                    >
                      {fileUpload.fileLoading
                        ? "Please be patient file is uploading..."
                        : "Save"}
                    </Button>
                    {startLoader && <CircularProgress />}
                  </Grid>
                </Grid>
              )}
            </form>
          );
        }}
      </Formik>

      <MyDrawer
        drawerSize={"50vw"}
        iconName="Installation Instruction"
        open={instlInstructState.open}
        onClose={handleCloseDrawer}
      >
        <InstallationInstructionApp {...props} />
      </MyDrawer>

      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        onClose={handleCloseModal}
        aria-labelledby="simple-dialog-title"
        open={state.soldServiceModal}
        style={{ textAlign: "center" }}
      >
        <DialogTitle style={{ paddingTop: "30px" }} id="simple-dialog-title">
          Please Confirm, Which Eco Services would you like to Create?
        </DialogTitle>

        <div>
          {state.soldServiceModal &&
            props.singleLead?.subServiceType?.length > 0
            ? props.singleLead.subServiceType.map((x, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    color="primary"
                    onClick={() => handleChangeCheckbox(x)}
                    name="ecoServices"
                  />
                }
                label={x}
                value={x}
              />
            ))
            : "No Service Available"}
        </div>

        <DialogActions
          style={{ justifyContent: "center", paddingBottom: "30px" }}
        >
          <Button
            color="primary"
            variant="contained"
            type="button"
            disabled={
              props.singleLead?.subServiceType?.length > 0 ? false : true
            }
            onClick={() => SoldServiceFun()}
          >
            Generate Quote
          </Button>
          <Button
            color="primary"
            variant="contained"
            type="button"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          {startLoader && <CircularProgress />}
        </DialogActions>
      </Dialog>
    </div>
  );
}
