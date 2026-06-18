import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

import { selectLoader} from '../sharedRedux/configuration';
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function loader(props) {
 
  const loader = useSelector(selectLoader);
  let loaderCompo = <div />;
  if (loader > 0) {
    loaderCompo = (
      <div>
        <LinearProgress />
      </div>
    );
  }
  return <React.Fragment>{loaderCompo}</React.Fragment>;
}

export default loader;
