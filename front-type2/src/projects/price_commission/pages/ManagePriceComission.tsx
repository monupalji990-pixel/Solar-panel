import React, { useEffect, useRef, useState } from "react";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { selectPriceCommission, sliceKeyPriceCommission, priceCommissionReducer, priceCommissionSaga, priceCommissionAction } from "../redux/price_commission";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RangeSlider from '../sections/rangeSlider'
import Button from '@material-ui/core/Button';
import PriceFilter from "../sections/priceFilter"
import GetQuote from "../sections/getQuote"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ViewPricesCommission from '../sections/viewPriceCommission'

const useStyles = makeStyles(() => ({
  root: {
    width: 300
  },
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
  CountBtnStyle: {
    minWidth: "200px",
    textAlign: "center",
    "@media(max-width:480px)": {
      minWidth: "auto",
      display: "block",
      padding: 15,
    },
  },
  logoStyle: {
    width: '120px',
    height: '93px',
    objectFit: 'cover',
    border: '1px solid #ccc',
    display: 'inline-block',
  },
  logoImgStyle: {
    width: '100%',
    maxHeight: '87px',
    objectFit: 'cover',
  }
}));

let arr = []
export function ManagePriceCommission(props) {
  useInjectReducer({ key: sliceKeyPriceCommission, reducer: priceCommissionReducer });
  useInjectSaga({ key: sliceKeyPriceCommission, saga: priceCommissionSaga });

  const priceState = useSelector(selectPriceCommission);
  const getUserTable = useRef(null);

  const classes = useStyles();

  const dispatch = useDispatch();

  const _getPriceList = (payload) => dispatch(priceCommissionAction.List(payload));
  const _getPostcode = (payload) => dispatch(priceCommissionAction.getLdzFromPostcode(payload));
  const _getSupplierData = (payload) => dispatch(priceCommissionAction.SupplierFilter(payload));
  const _DuartionFilter = (payload) => dispatch(priceCommissionAction.DuartionFilter(payload));
  const _ClearAPIData = (payload) => dispatch(priceCommissionAction.ClearAPIData(payload));

  useEffect(() => {
    if (props.open === null) {
      _ClearAPIData({})
      arr = [];
    }
  }, [props.open]);

  useEffect(() => {
    if (priceState.isStatus) {
      setIsExport(false);
      arr = [];
    }
  }, [priceState.isStatus])

  const [isExport, setIsExport]: any = React.useState();
  const [getData, setData] = useState({});
  const [isTotal, setIsTotal] = useState(0);
  const [isPrevSpend, setIsPrevSpend] = useState(0);
  const [tabledata, setTableData] = useState([]);
  const [range, setRange] = useState(0.1);
  const [upliftValue, setUpliftValue] = useState(0.1);
  const [totalSChargeCost, setTotalSChargeCost] = useState();
  const [PDFstate, setPDFstate] = useState([]);
  const [setDrawer, setSetDrawer] = useState(null);
  const [drawerIs, setDrawerIs] = useState(null);
  const [details, setDetails] = useState({});
  const [isGUpliftChange, setIsGUpliftChange] = useState('');

  useEffect(() => {
    if (priceState?.priceList) {
      const x = priceState.priceList.map((e) => {
        var a = { ...e };
        if (a.unitRate !== undefined && a.unitRate !== null && a.unitRate !== "") a.unitRate = e.unitRate + 0.1;
        if (a.ewRate !== undefined && a.ewRate !== null && a.ewRate !== "") a.ewRate = e.ewRate + 0.1;
        if (a.nightRate !== undefined && a.nightRate !== null && a.nightRate !== "") a.nightRate = e.nightRate + 0.1;
        return a;
      });

      setTableData(x)
    }
    if (priceState.isStatus) {
      dispatch(priceCommissionAction.BasicActions({ isStatus: false }));
    }
  }, [priceState.priceList])

  const handleChangeSwitch = (event, rowData) => {

    const updateddata = tabledata.map(ele => {
      var returnValue = { ...ele };
      priceState.priceList.map((v) => {
        if (v._id === rowData._id) {
          if (ele._id === rowData._id) {
            returnValue.isExport = event.target.checked;
          }
        }
      })
      return returnValue;
    })
    setTableData(updateddata);

    const prevSpend = (priceState?.priceData?.standingCharge * 365 / 100)
      + ((priceState?.priceData?.unitrate !== undefined ? priceState?.priceData?.unitrate : 0) * priceState?.priceData?.aq / 100)
      + ((priceState?.priceData?.night !== undefined ? priceState?.priceData?.night : 0) * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100)
      + ((priceState?.priceData?.ew !== undefined ? priceState?.priceData?.ew : 0) * (priceState?.priceData?.ewRate !== undefined ? priceState?.priceData?.ewRate : 0) / 100)

    const x = updateddata.map((e) => e).filter(f => f.isExport !== false);

    let pdfData: any = {
      rowData: x.map((e) => e),
      isPrevSpend: prevSpend,
      localData: priceState?.priceData,
    }
    setData(pdfData);
  };

  const handleChangePage = (event, newPage) => {
    dispatch(priceCommissionAction.LoaderStart(true));
    dispatch(priceCommissionAction.BasicActions({ count: -1, isStatus: true }));
    dispatch(priceCommissionAction.NewPage({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(priceCommissionAction.LoaderStart(true));
    dispatch(priceCommissionAction.BasicActions({ count: -1, isStatus: true }));
    dispatch(priceCommissionAction.ChangeLimit({ limit: event.target.value }));
  };

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  // total cost logic -------------------
  const totalCost = (data) => {
    if (data) {
      const total: any = (
        (data.standingCharge * 365 / 100)
        + (data.unitRate !== undefined && data.unitRate * priceState?.priceData?.aq / 100)
        + (data.nightRate !== undefined && data.nightRate * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100)
        + (data.ewRate !== undefined && data.ewRate * (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0) / 100)
      )
      return Number(total).toFixed(5);
    }
  }

  // monthly cost logic -------------------
  const monthlyCost = (data) => {
    if (data) {
      const total = ((data.standingCharge * 365 / 100)
        + ((data.unitRate !== undefined ? data.unitRate : 0) * priceState?.priceData?.aq / 100)
        + ((data.nightRate !== undefined ? data.nightRate : 0) * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100)
        + ((data.ewRate !== undefined ? data.ewRate : 0) * (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0) / 100))

      const totalCCL = (priceState?.priceData?.ccl *
        (priceState?.priceData?.aq
          + (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0)
          + (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0)
        ))
        / 100;

      const totalVAT = ((
        (data.standingCharge * 365 / 100)
        + ((data.unitRate !== undefined ? data.unitRate : 0) * priceState?.priceData?.aq / 100)
        + ((data.nightRate !== undefined ? data.nightRate : 0) * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100)
        + ((data.ewRate !== undefined ? data.ewRate : 0) * (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0) / 100)
        + ((priceState?.priceData?.ccl * (priceState?.priceData?.aq
          + (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0)
          + (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0)
        ))
          / 100)
      ) * (priceState?.priceData?.vat) / 100);

      const mc = (total + totalCCL + totalVAT) / 12;
      return <div>£{Number(mc).toFixed(5)}</div>;
    }
  }

  const savings = (data: any) => {
    if (data) {
      const prevSpend = (priceState?.priceData?.standingCharge * 365 / 100)
        + ((priceState?.priceData?.unitrate !== undefined ? priceState?.priceData?.unitrate : 0) * priceState?.priceData?.aq / 100)
        + ((priceState?.priceData?.night !== undefined ? priceState?.priceData?.night : 0) * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100)
        + ((priceState?.priceData?.ew !== undefined ? priceState?.priceData?.ew : 0) * (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0) / 100);
      const s: any = Number(totalCost(data)) - prevSpend
      // setIsPrevSpend(prevSpend);
      // setIsSaving(s.toFixed(5));
      return <div>£{Number(s).toFixed(5)}</div>;
    }
  }

  const viewDetails = (rowData, range) => {

    let supplierName = []
    if (props.suppliers) {
      props.suppliers.filter((e) => {
        if (e.supplierName === rowData.supplier) {
          supplierName.push({
            label: e.supplierName,
            value: e._id,
          })
        }
      })
    }

    const soldData = {
      data: rowData,
      localData: priceState?.priceData,
      supplier: supplierName,
      serviceType: priceState?.priceData?.serviceType,
    }

    setSetDrawer("manageViewPrice");
    setDetails(soldData);
  }

  const columns = [
    {
      title: "Supplier",
      field: "supplier",
      render: data => <>
        <span className={classes.logoStyle}>
          <img src={data.logo} alt={data.supplier} className={classes.logoImgStyle} />
        </span>
        <p>{data.supplier}</p>
      </>
    },
    {
      title: "Term",
      field: "duration",
      render: data => <> {data.duration} Years</>
    },
    {
      title: "Total Cost / Rates",
      render: data => <>
        {data.unitRate !== undefined && <p>£{totalCost(data)}</p>}
        <p><b>SC:</b> {Number(data.standingCharge).toFixed(5)}</p>
        {data.unitRate !== undefined && <p><b>Day:</b> {Number(data.unitRate >= 0 ? (data.unitRate) : '-').toFixed(5)}p</p>}
        {data.nightRate !== undefined && data.nightRate !== null && data.nightRate !== "" && <p><b>Night:</b> {Number(data.nightRate).toFixed(5)}p</p>}
        {data.ewRate !== undefined && data.ewRate !== null && data.ewRate !== "" && <p><b>EW:</b> {Number(data.ewRate).toFixed(5)}p</p>}
      </>
    },
    {
      title: "Monthly Cost",
      field: "monthlyCost",
      render: data => monthlyCost(data)
    },
    {
      title: "Savings",
      field: "saving",
      render: data => savings(data)
    },
    {
      title: "Commission",
      field: "commission",
      render: (data: any) =>
        <RangeSlider
          setrange={fetchValue}
          upliftValue={upliftValue}
          range={range}
          data={data}
          priceState={priceState?.priceData}
        />
    },
    {
      width: "170px",
      sorting: false,
      field: "isExport",
      render: (rowData) =>
      (
        <>
          <Button variant="contained" color="primary" onClick={() => viewDetails(rowData, range)}>
            Sold Tariff
          </Button>
          <br />
          <FormControlLabel
            value="start"
            control={<Switch checked={rowData.isExport} name="isExport" color="primary" />}
            onChange={(event) => handleChangeSwitch(event, rowData)}
            label="Export"
            labelPlacement="start"
          />

        </>
      ),
    },
  ];


  const fetchValue = (value, id, gUplift) => {
    setRange(value);
    
    if (gUplift === 'globalUplift' && isGUpliftChange === 'changeGUValue') {
      const updateddata = priceState.priceList.map(ele => {
        var returnValue = { ...ele };
        if(ele.unitRate !== undefined && ele.unitRate !== null) returnValue.unitRate = ele.unitRate + value;
        if(ele.nightRate !== undefined && ele.nightRate !== null) returnValue.nightRate = ele.nightRate + value;
        if(ele.ewRate !== undefined && ele.ewRate !== null) returnValue.ewRate = ele.ewRate + value;
        return returnValue;
      })
      setTableData(updateddata);
    }
    else {
      const updateddata = tabledata.map(ele => {
        var returnValue = { ...ele };
        priceState.priceList.map((v) => {
          if (v._id === id) {
            if (ele._id === id) {
              if(v.unitRate !== undefined && v.unitRate !== null) returnValue.unitRate = v.unitRate + value;
             if(v.nightRate !== undefined && v.nightRate !== null) returnValue.nightRate =  v.nightRate + value;
             if(v.ewRate !== undefined && v.ewRate !== null) returnValue.ewRate = v.ewRate + value;
              returnValue.uplift = value;
            }
          }
        })
        return returnValue;
      })
      
      setTableData(updateddata);
    }
  }

  const globalUplift = (value) => {
    setUpliftValue(value);
  }

  const totalStandingChargeCost = (rowData) => {
    const x: any = Number(rowData.standingCharge * 365 / 100).toFixed(5);
    setTotalSChargeCost(x);
    return x;
  }

  function closeDrawer() {
    setSetDrawer(null);
    setDrawerIs(null);
  }

  const totalCCLFunc = (rowData) => {
    return Number(
      (priceState?.priceData?.ccl * (priceState?.priceData?.aq
        + (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0)
        + (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0)
      ))
      / 100).toFixed(5)
  }

  const monthlyCostFunc = (rowData) => {
    return (Number(
      ((rowData.standingCharge * 365 / 100)
        + ((rowData.unitRate !== undefined ? rowData.unitRate : 0) * priceState?.priceData?.aq / 100)
        + ((rowData.nightRate !== undefined ? rowData.nightRate : 0) * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100)
        + ((rowData.ewRate !== undefined ? rowData.ewRate : 0) * (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0) / 100)
        + ((priceState?.priceData?.ccl * (priceState?.priceData?.aq
          + (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0)
          + (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0)
        ))
          / 100)
        + Number(totalVATFunc(rowData))
      ) / 12).toFixed(5)
    );
  }

  const totalVATFunc = (rowData) => {
    return Number((
      (rowData.standingCharge * 365 / 100)
      + ((rowData.unitRate !== undefined ? rowData.unitRate : 0) * priceState?.priceData?.aq / 100)
      + ((rowData.nightRate !== undefined ? rowData.nightRate : 0) * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100)
      + ((rowData.ewRate !== undefined ? rowData.ewRate : 0) * (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0) / 100)
      + ((priceState?.priceData?.ccl * (priceState?.priceData?.aq
        + (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0)
        + (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0)
      ))
        / 100)
    ) * (priceState?.priceData?.vat) / 100).toFixed(5);
  }

  const prevSpendFunc = (rowData) => {
    return (Number(
      (priceState?.priceData?.standingCharge * 365 / 100)
      + ((priceState?.priceData?.unitrate !== undefined ? priceState?.priceData?.unitrate : 0) * priceState?.priceData?.aq / 100)
      + ((priceState?.priceData?.night !== undefined ? priceState?.priceData?.night : 0) * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100)
      + ((priceState?.priceData?.ew !== undefined ? priceState?.priceData?.ew : 0) * (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0) / 100)
    ).toFixed(5));
  }

  return (
    <Grid item md={12} xs={12} className="TableScrolling">

      <GetQuote {...props} _getPostcode={_getPostcode} getPriceList={_getPriceList} ClearAPIData={_ClearAPIData} />

      {priceState.isShowList &&
        <>
          <PriceFilter {...props} GUpliftChange={setIsGUpliftChange} pdfData={getData} setGlobalUplift={globalUplift} getSupplierData={_getSupplierData} DuartionFilter={_DuartionFilter} />

          <MaterialTable
            columns={columns}
            tableRef={props.tableRef}
            title="Supplier"
            isLoading={priceState.remote}
            data={tabledata}
            options={{
              pageSize: priceState?.obj?.limit,
              emptyRowsWhenPaging: false,
              exportButton: false,
              filtering: false,
              search: false,
            }}
            onOrderChange={(sort, sortType) => {
              let h = { ...props };
              if (sort === -1) {
                h.sort = "createdAt";
                h.sortType = "desc";
              } else {
                h.sort = columns[sort].field;
                h.sortType = sortType;
              }
            }}
            key={priceState?.obj?.limit}
            components={{
              Pagination: () => {
                return (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    count={priceState.count}
                    rowsPerPage={priceState?.obj?.limit}
                    page={priceState?.obj?.page - 1}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                );
              },
            }}

            detailPanel={rowData => {
              return (
                <Grid container>
                  <Grid item md={8} xs={12}>
                    <TableContainer style={{ padding: '2rem', boxSizing: 'border-box' }}>
                      <Table aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Type</StyledTableCell>
                            <StyledTableCell align="right">Price</StyledTableCell>
                            <StyledTableCell align="right">Units</StyledTableCell>
                            <StyledTableCell align="right">Cost</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <StyledTableRow>
                            <StyledTableCell><strong>Standing Charge</strong></StyledTableCell>
                            <StyledTableCell align="right">{Number(rowData.standingCharge).toFixed(5)}p</StyledTableCell>
                            <StyledTableCell align="right">365 days</StyledTableCell>
                            <StyledTableCell align="right">£{totalStandingChargeCost(rowData)}</StyledTableCell>
                          </StyledTableRow>

                          {rowData.unitRate !== undefined && rowData.unitRate !== null &&
                            <StyledTableRow>
                              <StyledTableCell><strong>Day</strong></StyledTableCell>
                              <StyledTableCell align="right">{Number(rowData.unitRate).toFixed(5)}p</StyledTableCell>
                              <StyledTableCell align="right">{priceState?.priceData?.aq}Kwh</StyledTableCell>
                              <StyledTableCell align="right">£{Number((rowData.unitRate) * priceState?.priceData?.aq / 100).toFixed(5)}</StyledTableCell>
                            </StyledTableRow>
                          }

                          {rowData.nightRate !== undefined && rowData.nightRate !== null &&
                            <StyledTableRow>
                              <StyledTableCell><strong>Night</strong></StyledTableCell>
                              <StyledTableCell align="right">{Number(rowData.nightRate).toFixed(5)}p</StyledTableCell>
                              <StyledTableCell align="right">{(priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0)}Kwh</StyledTableCell>
                              <StyledTableCell align="right">£{Number((rowData.nightRate) * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100).toFixed(5)}</StyledTableCell>
                            </StyledTableRow>
                          }

                          {rowData.ewRate !== undefined && rowData.ewRate !== null &&
                            <StyledTableRow>
                              <StyledTableCell><strong>Evening & Weekend</strong></StyledTableCell>
                              <StyledTableCell align="right">{Number(rowData.ewRate).toFixed(5)}p</StyledTableCell>
                              <StyledTableCell align="right">{(priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0)}Kwh</StyledTableCell>
                              <StyledTableCell align="right">£{Number((rowData.ewRate) * (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0) / 100).toFixed(5)}</StyledTableCell>
                            </StyledTableRow>
                          }

                          <StyledTableRow>
                            <StyledTableCell><strong>Total</strong></StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                            <StyledTableCell align="right">
                              £{Number
                                (
                                  (rowData.standingCharge * 365 / 100)
                                  +
                                  (((rowData.unitRate !== undefined && rowData.unitRate !== null) ? rowData.unitRate : 0) * priceState?.priceData?.aq / 100)
                                  +
                                  (((rowData.nightRate !== undefined && rowData.nightRate !== null) ? rowData.nightRate : 0) * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100)
                                  +
                                  (((rowData.ewRate !== undefined && rowData.ewRate !== null) ? rowData.ewRate : 0) * (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0) / 100)
                                ).toFixed(5)
                              }
                            </StyledTableCell>
                          </StyledTableRow>

                          <StyledTableRow>
                            <StyledTableCell><strong>CCL</strong></StyledTableCell>
                            <StyledTableCell align="right">{priceState?.priceData?.ccl}p</StyledTableCell>
                            <StyledTableCell align="right">{priceState?.priceData?.aq
                              + (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0)
                              + (priceState?.priceData?.ewkwh !== undefined ? priceState?.priceData?.ewkwh : 0)
                            }Kwh</StyledTableCell>
                            <StyledTableCell align="right">
                              £{totalCCLFunc(rowData)}
                            </StyledTableCell>
                          </StyledTableRow>

                          <StyledTableRow>
                            <StyledTableCell><strong>VAT</strong></StyledTableCell>
                            <StyledTableCell align="right">{priceState?.priceData?.vat}%</StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                            <StyledTableCell align="right">£{totalVATFunc(rowData)}</StyledTableCell>
                          </StyledTableRow>

                          <StyledTableRow>
                            <StyledTableCell><strong>Monthly Cost</strong></StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                            <StyledTableCell align="right">12 Months</StyledTableCell>
                            <StyledTableCell align="right">£
                              {monthlyCostFunc(rowData)}
                            </StyledTableCell>
                          </StyledTableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <TableContainer style={{ padding: '2rem', boxSizing: 'border-box' }}>
                      <Table aria-label="customized table">
                        <TableBody>
                          <StyledTableRow>
                            <StyledTableCell><strong>Total Cost</strong></StyledTableCell>
                            <StyledTableCell align="right">£{
                              ((rowData.standingCharge * 365 / 100)
                                + (((rowData.unitRate !== undefined && rowData.unitRate !== null) ? rowData.unitRate : 0) * priceState?.priceData?.aq / 100)
                                + (((rowData.nightRate !== undefined && rowData.nightRate !== null) ? rowData.nightRate : 0) * (priceState?.priceData?.nightkwh !== undefined ? priceState?.priceData?.nightkwh : 0) / 100)
                                + (((rowData.ewRate !== undefined && rowData.ewRate !== null) ? rowData.ewRate : 0) * (priceState?.priceData?.ewRate !== undefined ? priceState?.priceData?.ewRate : 0) / 100)
                              ).toFixed(5)}</StyledTableCell>
                          </StyledTableRow>

                          <StyledTableRow>
                            <StyledTableCell><strong>Previous Spend</strong></StyledTableCell>

                            <StyledTableCell align="right">
                              £{prevSpendFunc(rowData)}

                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell><strong>Savings</strong></StyledTableCell>
                            <StyledTableCell align="right">{savings(rowData)}</StyledTableCell>
                          </StyledTableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              )
            }}
          />
        </>
      }

      <ViewPricesCommission
        {...props}
        open={setDrawer}
        getUserTable={getUserTable}
        onClose={closeDrawer}
        details={details}
        showingFrom="priceModule"
      />

      {drawerIs}

    </Grid>
  );
}
