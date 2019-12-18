/* React Imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Collapse from "@material-ui/core/Collapse";
//Icons
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";
/* App Imports */
import SearchBar from "../UI/SpecialFields/SearchBar";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    border: "unset",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid"
    }
  },
  button: {
    [theme.breakpoints.down("xs")]: {
      minWidth: "200px",
      width: "100%"
    }
  },
  classroomListHeader: {
    display: "flex",
    alignSelf: "center"
  },
  classroomListHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    margin: theme.spacing(1, 1)
  },
  classroomFilters: {
    display: "flex",
    alignSelf: "center",
    margin: theme.spacing(0, 1)
  },
  classroomFiltersInputs: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  statusSelect: {
    width: "120px"
  },
  backendSearch: {
    display: "flex",
    flexDirection: "column",
    margin: "8px 16px 8px 8px"
  },
  caption: {
    margin: theme.spacing(1),
    color: "#FFA000"
  },
  listOptions: {
      display: "flex",
      justifyContent: "space-between"
  }
}));

const ClassroomManagerCard = props => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const {
    role,
    filterToggle,
    handleFilterToggle,
    selectState,
    handleselectState,
    handleNavChange,
    handleAddClassStudent,
    searchValue,
    searchOnChange,
    serverSearch,
    handleServerSearch
  } = props;

  const filterToggleButton = (
    <div className={classes.classroomFilters}>
      <Button
        variant="outlined"
        onClick={handleFilterToggle}
        style={!role.includes("admin") ? { width: "100%" } : null}
      >
        <Icon style={{ marginRight: "5px" }}>
          <FilterListOutlinedIcon />
        </Icon>
        <Typography variant="button">Filters</Typography>
      </Button>
    </div>
  );

  const filterCollapsable = (
    <Collapse in={filterToggle}>
      <div className={classes.classroomFiltersInputs}>
        <TextField
          className={classes.statusSelect}
          label="By Status"
          placeholder="Active"
          type="text"
          margin="normal"
          variant="outlined"
          value={selectState.status}
          onChange={event => {
            handleselectState(event, "status");
          }}
          select
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
        <TextField
          className={classes.statusSelect}
          label="By Time"
          placeholder="Created (Newest)"
          type="text"
          margin="normal"
          variant="outlined"
          value={selectState.time}
          onChange={event => {
            handleselectState(event, "time");
          }}
          select
        >
          <MenuItem value="none">none</MenuItem>
          <MenuItem value="createdNew">created (newest)</MenuItem>
          <MenuItem value="createdOld">created (oldest)</MenuItem>
          <MenuItem value="updatedNew">updated (newest)</MenuItem>
          <MenuItem value="updatedOld">updated (oldest)</MenuItem>
        </TextField>
      </div>
    </Collapse>
  );

  const serverSearchButton = (
    <div className={classes.backendSearch}>
      <Button
        className={classes.button}
        size="small"
        variant="outlined"
        onClick={() => {
          handleServerSearch();
        }}
      >
        Search all
      </Button>
      <Typography variant="caption" className={classes.caption}>
        *This will take longer as search is done globaly
      </Typography>
    </div>
  );

  let topButton;
  if (role.includes("admin")) {
    topButton = filterToggleButton;
  } else {
    topButton = (
      <Tooltip
        placement="left"
        title={role === "teacher" ? "Create Classroom" : "Add Classroom"}
      >
        <IconButton
          onClick={event => {
            role === "teacher"
              ? handleNavChange(event, "classrooms/create")
              : handleAddClassStudent();
          }}
        >
          <AddCircleOutlineOutlinedIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Paper
      className={classes.paper}
      style={prefersDarkMode ? { border: "unset" } : null}
    >
      <div className={classes.classroomListHeaderContainer}>
        <div className={classes.classroomListHeader}>
          <Icon style={{ marginRight: "5px" }}>
            <ListOutlinedIcon />
          </Icon>
          <Typography>Classroom List</Typography>
        </div>
        {topButton}
      </div>
      <Divider style={{ margin: "8px 0px" }} />
      <div className={classes.listOptions}>
        <SearchBar
          value={searchValue}
          onChange={event => {
            searchOnChange(event);
          }}
          placeholder="Search by Name or ID..."
        />
        {!role.includes("admin") ? filterToggleButton : null}
        </div>
        {serverSearch ? serverSearchButton : null}
      {filterCollapsable}
    </Paper>
  );
};

export default ClassroomManagerCard;
