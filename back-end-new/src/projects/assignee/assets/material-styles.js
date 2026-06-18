import makeStyles from '@material-ui/core/styles/makeStyles';
function styles(theme) {
  return {};
}
let nonfunctionalStyle = theme => styles(theme);
let functionalStyle = makeStyles(theme => styles(theme));
export { functionalStyle, nonfunctionalStyle };
