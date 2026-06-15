import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from '@material-ui/core/Button';
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import PDFApi from '../redux/modal/price_commission';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { selectPriceCommission, sliceKeyPriceCommission, priceCommissionReducer, priceCommissionSaga, priceCommissionAction } from "../redux/price_commission";

const useStyles = makeStyles(() => ({
    ViewActionBtn: {
        background: "#193562",
        width: "26px",
        height: "26px",
        borderRadius: 3,
        padding: "3px",
        color: "#ffffff",
        "&:hover": {
            background: "#193562",
        },
        boxShadow: "0 5px 15px 0 rgba(58, 122, 254, 0.2)",
    },
    DeleteActionBtn: {
        background: "#ef4d56 ",
        width: "26px",
        height: "26px",
        borderRadius: 3,
        padding: "3px",
        color: "#ffffff",
        "&:hover": {
            background: "#ef4d56 ",
        },
        boxShadow: "0 5px 15px 0 rgba(58, 122, 254, 0.2)",
    },
    IconSize: {
        fontSize: "1rem",
    },
}));

export default function priceFilter(props) {

    const dispatch = useDispatch();
    const classes = useStyles();
    const [upliftValue, setUpliftValue] = useState(0.1);

    const [isExport, setIsExport] = React.useState();
    const [isActive, setIsActive] = React.useState("any");
    const [isLoading, setIsLoading] = React.useState(false);

    const hangleUpLift = (e, newValue) => {
        setUpliftValue(newValue);
        props.GUpliftChange("changeGUValue")
        props.setGlobalUplift(newValue);
    }

    const downloadAttachment = async (fileData, fileType, fileName) => {
        try {
            // setIsFileDownloadInProgress(true);
            const typeArray = {
                png: "image/png",
                jpg: "image/jpg",
                jpeg: "image/jpeg",
                pdf: "application/pdf",
                xlsx:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
            const blob = fileData;
            // setIsFileDownloadInProgress(false);
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

    const generatePDF = () => {
        setIsLoading(true);
        PDFApi.getPdfReqAPI(props.pdfData).then((response: any) => {
            if (response) {
                let bString = response;
                let bLength = bString.length;
                let bytes = new Uint8Array(bLength);
                // let bytes = new Array(bLength);
                for (let i = 0; i < bLength; i++) {
                    let ascii = response.charCodeAt(i);
                    bytes[i] = ascii;
                }
                downloadAttachment(
                    bytes,
                    "pdf",
                    `price`
                );
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }
                    }
                    open={true}
                    autoHideDuration={2000}
                    // onClose={handleClose}
                    message="PDF Generated Successfully!"
                />
            }
            setIsLoading(false);
        });
    };

    function submitValue(obj) {
        setIsActive(obj.value);
        if (obj != null) {
            dispatch(priceCommissionAction.BasicActions({ isStatus: true }));
            props.DuartionFilter({ duration: obj.value });
        }
    }

    let supplierList = [];
    if (props.suppliers) {
        props.suppliers.filter((e) => {
            supplierList.push({
                label: e.supplierName,
                value: e.supplierName,
                _id: e._id,
            })
        })
    }

    const supplierFilterFun = (id) => {
        if (id) {
            props.getSupplierData({ priceForSupplier: id });
            dispatch(priceCommissionAction.BasicActions({ isStatus: true }));
        }
    }

    return (
        <>

            <Grid container justify="flex-end" alignItems="center" spacing={2} style={{ paddingBottom: 20, paddingTop: 10 }}>
                <Grid item md={3} xs={12}>
                    <Formik
                        initialValues={{ supplier: '' }}
                        onSubmit={(value) => {
                            // props.getSupplierData(value);
                        }}
                        validationSchema={Yup.object().shape({})}
                    >
                        {(props) => {
                            const {
                                values,
                                touched,
                                errors,
                                handleBlur,
                                handleSubmit,
                                setFieldValue,
                                isSubmitting,
                                submitForm,
                                validateForm,
                            } = props;

                            return (
                                <form onSubmit={handleSubmit}>
                                    <Select
                                        id="supplier"
                                        name="supplier"
                                        className="WidhtFull100"
                                        placeholder="Select Supplier"
                                        value={values.supplier}
                                        onChange={(e) => {
                                            setFieldValue("supplier", e),
                                                supplierFilterFun(e._id);
                                        }}
                                        onBlur={handleBlur}
                                        margin="normal"
                                        aria-describedby="role-number-error"
                                        options={supplierList}
                                    />
                                </form>
                            );
                        }}
                    </Formik>
                </Grid>
                <Grid item md={4} xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', columnGap: 5 }}>
                    <Typography variant="subtitle2">Term:</Typography>
                    <Button variant="contained" color={isActive === "any" ? "primary" : "inherit"} onClick={(e) => submitValue({ value: "any", label: "any" })}>Any</Button>
                    <Button variant="contained" color={isActive === "1" ? "primary" : "inherit"} onClick={(e) => submitValue({ value: "1", label: "1" })}>1</Button>
                    <Button variant="contained" color={isActive === "2" ? "primary" : "inherit"} onClick={(e) => submitValue({ value: "2", label: "2" })}>2</Button>
                    <Button variant="contained" color={isActive === "3" ? "primary" : "inherit"} onClick={(e) => submitValue({ value: "3", label: "3" })}>3</Button>
                    <Button variant="contained" color={isActive === "4" ? "primary" : "inherit"} onClick={(e) => submitValue({ value: "4", label: "4" })}>4</Button>
                    <Button variant="contained" color={isActive === "5" ? "primary" : "inherit"} onClick={(e) => submitValue({ value: "5", label: "5" })}>5</Button>
                </Grid>

                <Grid item md={3} xs={12} style={{ padding: '0 20px' }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Global Uplift ({upliftValue})
                    </Typography>
                    <Slider
                        style={{ width: '100%' }}
                        value={typeof upliftValue === 'number' ? upliftValue : 0}
                        onChange={hangleUpLift}
                        valueLabelDisplay="off"
                        aria-labelledby="range-slider"
                        step={0.1}
                        min={0.1}
                        max={1.5}
                    />
                </Grid>

                <Grid item md={2} xs={12} style={{ textAlign: 'right' }}>
                    {props.pdfData && props.pdfData?.rowData?.length > 0 &&
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={generatePDF}
                                disabled={props.pdfData && props.pdfData?.rowData?.length > 0 ? false : true}
                            >
                                Export PDF
                            </Button>
                            {isLoading && <CircularProgress size={26} style={{ margin: '-6px 10px' }} />}
                        </>
                    }
                </Grid>
            </Grid>
        </>
    );
}