import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/Edit';
export default function viewComponent(myProps): JSX.Element {
  const props: any = myProps;
  const htmlCode: any[] = [];
  if (props.viewC) {
    htmlCode.push(props.viewC);
  } else if (props.viewType) {
    if (props.viewType == 'text' || props.viewType == 'number') {
      htmlCode.push(<DefaultTextView {...props} />);
    }
    if (props.viewType == 'chip') {
      htmlCode.push(<DefaultChipView {...props} />);
    }
    if (props.viewType == 'array') {
      htmlCode.push(<DefaultCheckView {...props} />);
    }
    if (props.viewType == 'image') {
      htmlCode.push(<DefaultImageView {...props} />);
    }
  }
  return (
    <>{htmlCode}</>
  );
}

function DefaultTextView(props) {
  return props.value ? props.value : "";
}
function DefaultChipView(props) {
  return props.value.map(e =>
    <Chip label={e} />
  )
}
function DefaultCheckView(props) {
  return props.value.join(', ');
}
function DefaultImageView(props) {
  return <img src={props.value} />
}