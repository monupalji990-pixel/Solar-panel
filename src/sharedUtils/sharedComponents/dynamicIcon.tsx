import React from "react";
import CastForEducationIcon from "@material-ui/icons/CastForEducation";
import SchoolIcon from "@material-ui/icons/School";
import SwapHorizontalCircleSharpIcon from "@material-ui/icons/SwapHorizontalCircleSharp";
import RateReviewSharpIcon from "@material-ui/icons/RateReviewSharp";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import ListAltIcon from "@material-ui/icons/ListAlt";
import EditIcon from "@material-ui/icons/Edit";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";
import Accessible from "@material-ui/icons/Accessible";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DashboardIcon from "../sharedImages/navIcon/dashboard.svg";
import LeadIcon from "../sharedImages/navIcon/lead.svg";
import ImportExport from "../sharedImages/navIcon/up-and-down-arrows-symbol.svg";
import AccountCircleIcon from "../sharedImages/navIcon/add-friend.svg";
import Business from "../sharedImages/navIcon/company.svg";
import SupervisedUserCircleOutlinedIcon from "../sharedImages/navIcon/team.svg";
import LocalLibrary from "../sharedImages/navIcon/document.svg";
import WifiTethering from "../sharedImages/navIcon/live.svg";
import Assignment from "../sharedImages/navIcon/task.svg";
import Renewal from "../sharedImages/navIcon/renewal.svg";
import TemplateIcon from "../sharedImages/navIcon/template.svg";
import EmailIcon from '../sharedImages/navIcon/email.svg';
import PaymentIcon from '../sharedImages/navIcon/bill.png'
import TaskBoardIcon from '../sharedImages/task-board.png'
import AppointmentIcon from '../sharedImages/schedule.png'
import RecordsIcon from '../sharedImages/navIcon/records-icon.png';
import InvoiceIcon from '../sharedImages/navIcon/invoice.png';
import InvoiceItemIcon from '../sharedImages/navIcon/invoiceItem.png'

const useStyles = makeStyles(() => ({
  iconSize: {
    maxWidth: 30,
  },
}));

export default function dynamicIcon(props) {
  const classes = useStyles();

  switch (props.icon) {
    case "DashboardIcon":
      return (
        <img className={classes.iconSize} src={DashboardIcon} alt="Dashboard" />
      );
    case "SupervisedUserCircleOutlined":
      return (
        <img
          className={classes.iconSize}
          src={SupervisedUserCircleOutlinedIcon}
          alt="Consumer"
        />
      );
    case "CollectionsBookmarkIcon":
      return <CollectionsBookmarkIcon />;
    case "Widgets":
      return (
        <img
          className={classes.iconSize}
          src="https://img.icons8.com/color/30/000000/supplier.png"
          alt="Supplier"
        />
      );
    case "Template":
      return (
        <img
          className={classes.iconSize}
          src="https://img.icons8.com/fluent/48/000000/new-resume-template.png"
          alt="Template"

        />
      )
    case "PersonAddIcon":
      return <PersonAddIcon />;
    case "ImportExport":
      return (
        <img
          className={classes.iconSize}
          src={ImportExport}
          alt="import/export"
        />
      );
    case "AccountCircle":
      return (
        <img className={classes.iconSize} src={AccountCircleIcon} alt="User" />
      );
    case "Business":
      return <img className={classes.iconSize} src={Business} alt="Company" />;
    case "Group":
      return <img className={classes.iconSize} src={LeadIcon} alt="" />;
    // case 'Group':
    //   return <Group />;
    case "LocalLibrary":
      return (
        <img className={classes.iconSize} src={LocalLibrary} alt="Quote" />
      );
    case "WifiTethering":
      return (
        <img className={classes.iconSize} src={WifiTethering} alt="Live" />
      );
    case "Sync":
      return <img className={classes.iconSize} src={Renewal} alt="ReNewal" />;
    case "Accessible":
      return <Accessible />;
    case "Assignment":
      return <img className={classes.iconSize} src={Assignment} alt="Task" />;
    case "CastForEducationIcon":
      return <CastForEducationIcon />;
    case "SchoolIcon":
      return <SchoolIcon />;
    case "SwapHorizontalCircleSharpIcon":
      return <SwapHorizontalCircleSharpIcon />;
    case "RateReviewSharpIcon":
      return <RateReviewSharpIcon />;
    case "AddShoppingCartIcon":
      return <AddShoppingCartIcon />;
    case "ListAltIcon":
      return <ListAltIcon />;
    case "AccountCircleIcon":
      return <AccountCircleIcon />;
    case "EditIcon":
      return <EditIcon />;
    case "PaymentIcon":
      return <img className={classes.iconSize} src={PaymentIcon} alt="Payments" />;
    case "TemplateIcon":
      return <img className={classes.iconSize} src={TemplateIcon} alt="Template" />
    case "EmailIcon":
      return <img className={classes.iconSize} src={EmailIcon} alt="Email" />
    case "TaskBoardIcon":
      return <img className={classes.iconSize} src={TaskBoardIcon} alt="Task Board" />
    case "AppointmentIcon":
      return <img className={classes.iconSize} src={AppointmentIcon} alt="Appointment" />
    case "RecordsIcon":
      return <img className={classes.iconSize} src={RecordsIcon} alt="Records" />
    case "ItemsIcon":
      return <img className={classes.iconSize} src={InvoiceItemIcon} alt="Items" />
    case "InvoiceIcon":
      return <img className={classes.iconSize} src={InvoiceIcon} alt="Invoice" />
    default:
      return <div>{props.icon}</div>;
  }
}
