import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {  globalConfigActions, selectFeedback, selectFeedbackShow} from '../sharedRedux/configuration';

function SnackbarComponent(props) {

  const feedback = useSelector(selectFeedback);
  const feedbackShow = useSelector(selectFeedbackShow);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(globalConfigActions.disableFeedback(false));
  };

  if (feedbackShow) {
    setTimeout(function () {
      handleClose();
    }, 6000);
  }

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={feedbackShow}
        onClose={handleClose}
        message={feedback}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}

export default SnackbarComponent
