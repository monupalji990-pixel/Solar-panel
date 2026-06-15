import React from "react";
import { useSelector } from "react-redux";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import { selectLoggedUser } from "../../../../projects/authentication/redux/auth";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import { useSpring, animated } from "react-spring/web.cjs";
import { List, ListItem, ListItemText } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: "1px solid",
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
  })
);

function Search(props) {
  const classes = useStyles();
  const userData = useSelector(selectLoggedUser);
  const [moduleContent, setModule] = React.useState<any>(
    userData.role.containers
  );

  const [searchKey, setSearchKey] = React.useState<string>("");
  const [expandMenu, setExpandMenu] = React.useState<boolean>(false);
  const AutoCompleteModuleDebounce = () => {
    let element: any = (document.getElementById("search") as HTMLInputElement)
      .value;
    AutoCompleteModule(element);
  };

  const AutoCompleteModule = (value) => {
    if (value.length < 3) {
      setSearchKey(value);
    } else {
      setSearchKey(value);
      setExpandMenu(true);
    }
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    expandMenu ? setExpandMenu(false) : setExpandMenu(true);
  };
  const id = expandMenu ? "spring-popper" : undefined;
  return (
    <div
      style={{
        margin: "0 6rem 0 auto ",
      }}
    >
      <Input
        placeholder="Search"
        id="search"
        value={searchKey}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="start">
            <Button onClick={handleClick}>
              <ExpandMoreIcon />
            </Button>
          </InputAdornment>
        }
        onChange={() => AutoCompleteModuleDebounce()}
      />
      <Popper id={id} open={expandMenu} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            {moduleContent.map((e) => {
              return (
                <List>
                  <ListItem>
                    <ListItemText>{e.name}</ListItemText>
                  </ListItem>
                </List>
              );
            })}
          </Fade>
        )}
      </Popper>
    </div>
  );
}

export default Search;

interface FadeProps {
  children?: React.ReactElement;
  in?: boolean;
  onEnter?: () => {};
  onExited?: () => {};
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(
  props,
  ref
) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});
