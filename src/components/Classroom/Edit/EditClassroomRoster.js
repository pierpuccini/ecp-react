/* React Imports */
import React, { useState } from "react";
/* Material imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
//Icons
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ArrowForwardOutlinedIcon from "@material-ui/icons/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import ArrowUpwardOutlinedIcon from "@material-ui/icons/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@material-ui/icons/ArrowDownwardOutlined";

const useStyles = makeStyles(theme => ({
  root: {
    margin: "auto"
  },
  cardHeader: {
    padding: theme.spacing(1, 2)
  },
  list: {
    width: "100%",
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto"
  },
  button: {
    margin: theme.spacing(1)
  },
  studentsTransferCards: {
    border: "unset",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid #808080"
    }
  },
  gridItemSize: {
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  }
}));

const not = (a, b) => {
  return a.filter(value => b.indexOf(value) === -1);
};

const intersection = (a, b) => {
  return a.filter(value => b.indexOf(value) !== -1);
};

const union = (a, b) => {
  return [...a, ...not(b, a)];
};

const EditClassroomRoster = props => {
  const classes = useStyles();
  const isTablet = useMediaQuery("(min-width: 959px)");

  const { pending_students, active_students } = props;

  const [checked, setChecked] = useState([]);
  const [pendingStudents, setpendingStudents] = useState([...pending_students]);
  const [activeStudents, setactiveStudents] = useState([...active_students]);

  const pendingStudentsChecked = intersection(checked, pendingStudents);
  const activeStudentsChecked = intersection(checked, activeStudents);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = items => intersection(checked, items).length;

  const handleToggleAll = items => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedActiveStudents = () => {
    setactiveStudents(activeStudents.concat(pendingStudentsChecked));
    setpendingStudents(not(pendingStudents, pendingStudentsChecked));
    setChecked(not(checked, pendingStudentsChecked));
  };

  const handleCheckedPendingStudents = () => {
    setpendingStudents(pendingStudents.concat(activeStudentsChecked));
    setactiveStudents(not(activeStudents, activeStudentsChecked));
    setChecked(not(checked, activeStudentsChecked));
  };

  const customList = (title, items) => (
    <Card className={classes.studentsTransferCards}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map(value => {
          const labelId = `transfer-list-all-item-${value.id}-label`;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />
              {title === "Pending Students" ? (
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <HighlightOffOutlinedIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              ) : null}
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item className={classes.gridItemSize}>
        {customList("Pending Students", pendingStudents)}
      </Grid>
      <Grid item>
        <Grid
          container
          direction={isTablet ? "column" : "row"}
          alignItems="center"
        >
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedActiveStudents}
            disabled={pendingStudentsChecked.length === 0}
            aria-label="move selected activeStudents"
          >
            {isTablet ? (
              <ArrowForwardOutlinedIcon />
            ) : (
              <ArrowDownwardOutlinedIcon />
            )}
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedPendingStudents}
            disabled={activeStudentsChecked.length === 0}
            aria-label="move selected pendingStudents"
          >
            {isTablet ? <ArrowBackOutlinedIcon /> : <ArrowUpwardOutlinedIcon />}
          </Button>
        </Grid>
      </Grid>
      <Grid item className={classes.gridItemSize}>
        {customList("Active Students", activeStudents)}
      </Grid>
    </Grid>
  );
};

export default EditClassroomRoster;
