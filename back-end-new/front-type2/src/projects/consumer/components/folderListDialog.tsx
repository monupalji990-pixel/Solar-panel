import {
  Button,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  TextField,
} from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import ApiCall from "../../../sharedUtils/sharedRedux/api";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import debounce from "lodash/debounce";

function FolderListDialog({
  currentFolder,
  setFileDialog,
  childState,
  newState,
  setMsgState,
  showingFrom,
  currentData,
}) {
  const [checked, setChecked] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState(null);

  const [state, setState] = React.useState({
    isLoading: false,
    list: [],
  });

  const fetchFolders = useCallback(
    debounce((query) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      ApiCall.driveAllFolderPostAPI(query).then((response: any) => {
        if (response.success) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            list: response.data,
          }));
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      });
    }, 500),
    []
  );

  useEffect(() => {
    let obj: any = {};
    if (showingFrom === "Consumer") {
      obj.Consumer = currentData._id;
    }
    if (showingFrom === "Company") {
      obj.Company = currentData._id;
    }
    if (searchQuery && searchQuery?.length > 0) {
      obj.search = searchQuery;
    }
    fetchFolders(obj);
  }, [searchQuery, fetchFolders]);

  const handleToggle = (value) => () => {
    setChecked(value._id);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMoveFolder = () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    let obj: any = {};
    if (showingFrom === "Consumer") {
      obj.Consumer = currentData._id;
    }
    if (showingFrom === "Company") {
      obj.Company = currentData._id;
    }

    obj.currentFolderId = currentFolder;
    obj.toFolderId = checked;

    ApiCall.driveMoveFolderPostAPI(obj).then((res: any) => {
      if (res.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
        setMsgState((prev) => ({
          ...prev,
          messageShow: true,
          messageText: res.message,
        }));
        setFileDialog(false);

        childState((prev) => ({ ...prev, isLoading: true }));
        let dataObj: any = {};

        dataObj.limit = 20;
        if (showingFrom === "Consumer") {
          dataObj.Consumer = currentData._id;
        }
        if (showingFrom === "Company") {
          dataObj.Company = currentData._id;
        }

        if (newState.selectedFolder?._id) {
          dataObj.level = 1;
          dataObj.folder = newState.selectedFolder?._id;
        } else {
          dataObj.level = 0;
        }
        dataObj.skip = 0;

        ApiCall.driveListAPI(dataObj).then((response: any) => {
          if (response.success) {
            childState((prev) => ({
              ...prev,
              isLoading: false,
              list: response.data,
              isNext: response.isNext,
            }));
          } else {
            childState((prev) => ({ ...prev, isLoading: false }));
          }
        });
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));

        setMsgState((prev) => ({
          ...prev,
          messageShow: true,
          messageText: res.message,
        }));
      }
    });
  };

  return (
    <React.Fragment>
      <div style={{ margin: "0 20px", display: "flex" }}>
        <TextField
          id="outlined-basic"
          size="small"
          label="Search folder"
          variant="outlined"
          style={{ width: "350px" }}
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<MoveToInboxIcon />}
          style={{ margin: "0 20px" }}
          onClick={handleMoveFolder}
        >
          Move
        </Button>
        {state.isLoading && <CircularProgress />}
      </div>
      {state.isLoading && (
        <div style={{ marginTop: 20 }}>
          <LinearProgress />
        </div>
      )}

      <List style={{ margin: "0 10px" }}>
        {state.list.map((value) => {
          const labelId = `checkbox-list-label-${value._id}`;

          return (
            <ListItem
              key={value._id}
              dense
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Radio
                  edge="start"
                  checked={checked === value._id}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.folderName} />
            </ListItem>
          );
        })}
      </List>
    </React.Fragment>
  );
}

export default FolderListDialog;
