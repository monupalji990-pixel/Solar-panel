import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import { globalConfigActions, selectGlobalConfig } from '../sharedRedux/configuration';

export function PasswordMasking(props) {
  const dispatch = useDispatch();
  const globalConfig = useSelector(selectGlobalConfig);
  const visible = globalConfig.visible;
  const _IsVisible = payload => dispatch(globalConfigActions.changeIsVisible(payload));

  return <Button className="password__show" onClick={() => globalConfig.visible === 'text' ? _IsVisible('password') : _IsVisible('text')}>{visible === 'text' ? <VisibilityIcon /> : <VisibilityOffIcon />}</Button>
}

export function PasswordMaskingSame(props) {
  const dispatch = useDispatch();
  const globalConfig = useSelector(selectGlobalConfig);
  const visibleSame = globalConfig.visibleSame;
  const _IsVisibleSame = payload => dispatch(globalConfigActions.changeIsVisibleSame(payload));

  return <Button className="password__show" onClick={() => visibleSame === 'text' ? _IsVisibleSame('password') : _IsVisibleSame('text')}>{visibleSame === 'text' ? <VisibilityIcon /> : <VisibilityOffIcon />}</Button>
}

export function PasswordMaskingThird(props) {
  const dispatch = useDispatch();
  const globalConfig = useSelector(selectGlobalConfig);
  const visibleThird = globalConfig.visibleThird;
  const _IsVisibleThird = payload => dispatch(globalConfigActions.changeIsVisibleSameThird(payload));

  return <Button className="password__show" onClick={() => visibleThird === 'text' ? _IsVisibleThird('password') : _IsVisibleThird('text')}>{visibleThird === 'text' ? <VisibilityIcon /> : <VisibilityOffIcon />}</Button>
}