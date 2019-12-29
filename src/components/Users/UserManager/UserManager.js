/* React Imports */
import React, { useState, useEffect } from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import TextField from "@material-ui/core/TextField";
// import MenuItem from "@material-ui/core/MenuItem";
// import Button from "@material-ui/core/Button";
// import Icon from "@material-ui/core/Icon";
// import InputAdornment from "@material-ui/core/InputAdornment";
/* App Imports */
import SideCollapseCard from "../../UI/SideCollapseCard/SideCollapseCard";
import UserCard from "./UserCard";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  userContainer: {
    height: "65%",
    [theme.breakpoints.down("xs")]: {
      height: "60%"
    }
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
    border: "unset",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid"
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
  userCard: {
    display: "flex",
    justifyContent: "space-between"
  },
  userActions: {
    display: "flex"
  },
  userNameAndRole: {
    textTransform: "capitalize"
  },
  nameAndRole: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center"
  },
  deleteButton: {
    color: theme.palette.error.dark
  },
  editUsersPanel: {
    margin: theme.spacing(2, 0)
  },
  userEditSection: {
    display: "flex",
    flexDirection: "row",
    height: "100%"
  },
  userCardSection: {
    flexDirection: "column",
    display: "flex",
    flexGrow: 1,
    overflow: "auto"
  },
  checkboxPhoneGp: {
    display: "flex",
    flexDirection: "column"
  }
}));

const UserManager = props => {
  const classes = useStyles();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isPhone = useMediaQuery("(max-width: 549px)");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const {
    teachers,
    students,
    pendingUsers,
    admins,
    clients,
    checkboxState,
    handleCheckboxChange,
    cardChangedHandler,
    selectedUser,
    openCard,
    openCardHandler,
    myRole
  } = props;

  const [userType, setuserType] = useState(["all"]);
  const [userDisplayArray, setuserDisplayArray] = useState(
    [].concat([...teachers, ...students, ...pendingUsers, ...admins])
  );

  /* This use effect is in charge of filtering the users */
  useEffect(() => {
    if (
      checkboxState.all ||
      (checkboxState.students && checkboxState.teachers && checkboxState.admins)
    ) {
      setuserType(["all"]);
      setuserDisplayArray(
        [].concat([...teachers, ...students, ...pendingUsers, ...admins])
      );
    } else if (checkboxState.students && checkboxState.teachers) {
      setuserType(["students", "teachers"]);
      setuserDisplayArray([...students, ...teachers]);
    } else if (checkboxState.admins && checkboxState.students) {
      setuserType(["admins", "students"]);
      setuserDisplayArray([...admins, ...students]);
    } else if (checkboxState.admins && checkboxState.teachers) {
      setuserType(["admins", "teachers"]);
      setuserDisplayArray([...admins, ...teachers]);
    } else if (checkboxState.admins) {
      setuserType(["admins"]);
      setuserDisplayArray([...admins]);
    } else if (checkboxState.students) {
      setuserType(["students"]);
      setuserDisplayArray([...students]);
    } else if (checkboxState.teachers) {
      setuserType(["teachers"]);
      setuserDisplayArray([...teachers]);
    } else {
      setuserType([]);
      setuserDisplayArray([...pendingUsers]);
    }
  }, [checkboxState, teachers, students, pendingUsers, admins]);

  let checboxLayout = (
    <React.Fragment>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={checkboxState.all}
            onChange={handleCheckboxChange("all")}
          />
        }
        label="All"
        labelPlacement="start"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={checkboxState.students}
            onChange={handleCheckboxChange("students")}
          />
        }
        label="Students"
        labelPlacement="start"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={checkboxState.teachers}
            onChange={handleCheckboxChange("teachers")}
          />
        }
        label="Teachers"
        labelPlacement="start"
      />
      {admins.length !== 0 ? (
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={checkboxState.admins}
              onChange={handleCheckboxChange("admins")}
            />
          }
          label="Admins"
          labelPlacement="start"
        />
      ) : null}
    </React.Fragment>
  );

  //Changes checkbox layout for phones
  if (isPhone) {
    checboxLayout = (
      <React.Fragment>
        <div className={classes.checkboxPhoneGp}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={checkboxState.all}
                onChange={handleCheckboxChange("all")}
              />
            }
            label="All"
            labelPlacement="start"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={checkboxState.students}
                onChange={handleCheckboxChange("students")}
              />
            }
            label="Students"
            labelPlacement="start"
          />
        </div>
        <div className={classes.checkboxPhoneGp}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={checkboxState.teachers}
                onChange={handleCheckboxChange("teachers")}
              />
            }
            label="Teachers"
            labelPlacement="start"
          />
          {admins.length !== 0 ? (
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={checkboxState.admins}
                  onChange={handleCheckboxChange("admins")}
                />
              }
              label="Admins"
              labelPlacement="start"
            />
          ) : null}
        </div>
      </React.Fragment>
    );
  }

  /* USER CARD IS A SMART COMPONENT IN CASE ERROR ARRISES FROM THERE */
  return (
    <Container>
      <Paper
        className={classes.paper}
        style={prefersDarkMode ? { border: "unset" } : null}
      >
        <Typography>User Accounts</Typography>
        <div className={classes.filterDiv}>
          <Typography>Filter by: </Typography>
          <div className={classes.specificFiltersDiv}>{checboxLayout}</div>
        </div>
      </Paper>
      <div className={classes.userContainer}>
      <Typography style={{ margin: "0px 16px" }}>
        {userType.includes("all")
          ? "All Users"
          : userType.includes("students")
          ? "Students"
          : userType.includes("teachers")
          ? "Teachers"
          : userType.includes("admins")
          ? "Admins"
          : "Pending Users"}
      </Typography>
        <div className={classes.userEditSection}>
          <div className={classes.userCardSection}>
            {userDisplayArray.map(user => {
              return (
                <UserCard
                  key={`${user.id}${user.role}`}
                  user={user}
                  isMobile={isMobile}
                  isChanging={cardChangedHandler}
                  clients={clients}
                  myRole={myRole}
                />
              );
            })}
          </div>
          {!isMobile && openCard ? (
            <SideCollapseCard openCard={openCard}>
              <UserCard
                onlyEditUsersCard
                openCard={openCard}
                user={selectedUser}
                isChanging={cardChangedHandler}
                clients={clients}
                openCardHandler={openCardHandler}
                myRole={myRole}
              />
            </SideCollapseCard>
          ) : null}
        </div>
      </div>
    </Container>
  );
};

export default UserManager;
