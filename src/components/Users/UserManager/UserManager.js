/* React Imports */
import React, { useState } from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
// import TextField from "@material-ui/core/TextField";
// import MenuItem from "@material-ui/core/MenuItem";
// import Button from "@material-ui/core/Button";
// import Icon from "@material-ui/core/Icon";
// import InputAdornment from "@material-ui/core/InputAdornment";
//Animations
// import Collapse from "@material-ui/core/Collapse";
//Icons
import EditOutlinedIcon from "@material-ui/icons/EditOutlined"; // import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined"; // import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import PowerSettingsNewOutlinedIcon from "@material-ui/icons/PowerSettingsNewOutlined";
/* App Imports */

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  },
  inputFullName: {
    "text-transform": "capitalize"
  },
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset"
    }
  },
  MuiMenuList: {
    width: "auto !important"
  },
  filterDiv: {
    margin: theme.spacing(1, 0)
  },
  specificFiltersDiv: {
    margin: theme.spacing(1, 0),
    display: "flex",
    justifyContent: "space-evenly"
  },
  userCard: { display: "flex", justifyContent: "space-between" },
  userActions: { display: "flex" },
  userNameAndRole: { textTransform: "capitalize" },
  nameAndRole: { display: "flex", flexDirection: "column", alignSelf: "center" }
}));

const UserManager = props => {
  const classes = useStyles();
  const { teachers, students } = props;
  const [userType, setuserType] = useState(["all"]);

  let userDisplayArray = [...teachers, ...students];
  console.log("userDisplayArray", userDisplayArray);
  return (
    <Container maxWidth="sm" className={classes.myAccountContainer}>
      <Paper className={classes.paper}>
        <Typography>User Accounts</Typography>
        <div className={classes.filterDiv}>
          <Typography>Filter by: </Typography>
          <div className={classes.specificFiltersDiv}>
            <span>Students</span>
            <span>Teachers</span>
          </div>
        </div>
      </Paper>
      <Typography>
        {userType.includes("all")
          ? "All Users"
          : userType.includes("students")
          ? "Students"
          : "Teachers"}
      </Typography>
      {userDisplayArray.map(user => {
        return (
          <Paper className={classes.paper} key={user.id}>
            <div className={classes.userCard}>
              <div className={classes.nameAndRole}>
                <Typography className={classes.userNameAndRole}>
                  {user.displayName}
                </Typography>
                <Typography
                  variant="caption"
                  className={classes.userNameAndRole}
                >
                  {user.role}
                </Typography>
              </div>
              <div className={classes.userActions}>
                <IconButton aria-label="edit" color="primary">
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton aria-label="inactivate">
                  <PowerSettingsNewOutlinedIcon />
                </IconButton>
                <IconButton aria-label="delete" style={{ color: "#d32f2f" }}>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </div>
            </div>
          </Paper>
        );
      })}
    </Container>
  );
};

export default UserManager;

// <form onSubmit={props.submitHandler}>
//           <div className={classes.container}>
//             <TextField
//               className={classes.textField}
//               label="Full Name"
//               placeholder="John Doe"
//               type="text"
//               value
//               onChange={event =>
//                 props.inputChangedHandler(event, "displayName")
//               }
//               margin="normal"
//               variant="outlined"
//             />
//           </div>
//         </form>
