/* React Imports */
import React, { useState, useEffect } from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
//Icons
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import PowerSettingsNewOutlinedIcon from "@material-ui/icons/PowerSettingsNewOutlined";
//Animations
import Collapse from "@material-ui/core/Collapse";
/* App Imports */
import { updateObject, checkValidity } from "../../../shared/utility";
import EditUsersCard from "./EditUsersCard";

const useStyles = makeStyles(theme => ({
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
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    border: "unset",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid"
    }
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
  }
}));

const UserCard = props => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const {
    user,
    isMobile,
    isChanging,
    clients,
    onlyEditUsersCard,
    openCardHandler,
    openCard
  } = props;

  const [editToggle, seteditToggle] = useState(false);
  const [userManagerEditor, setuserManagerEditor] = useState({
    role: {
      value: "",
      validation: {
        isName: true
      },
      valid: false,
      touched: false
    },
    institution: {
      value: { id: "", value: "" },
      validation: {},
      valid: false,
      touched: false
    }
  });

  //TODO: Remove when accepting more than 1 institution
  //Incharge of assigning an institution the the state and users role on user selection
  const updateEditorInputs = (institutions, role) => {
    let institutionsArr, updatedControls;
    institutionsArr =
      institutions.length === 0 || institutions == null
        ? { id: "", value: "" }
        : institutions.length === 1
        ? institutions[0]
        : institutions;
    updatedControls = updateObject(userManagerEditor, {
      institution: updateObject(userManagerEditor.institution, {
        value: { id: institutionsArr.id, value: institutionsArr.value },
        valid: false,
        touched: false
      }),
      role: updateObject(userManagerEditor.role, {
        value: role,
        valid: false,
        touched: false
      })
    });
    setuserManagerEditor(updatedControls);
  };

  let editToggleCopy;
  const userActionsHandler = action => {
    switch (action) {
      case "edit":
        editToggleCopy = editToggle;
        isChanging(action, user);
        updateEditorInputs(user.institutions, user.role);
        seteditToggle(!editToggleCopy);
        break;
      case "inactivate":
        isChanging(action, user);
        break;
      case "delete":
        isChanging(action, user);
        break;
      case "save":
        isChanging(action, user, userManagerEditor);
        break;
      case "close":
        seteditToggle(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (openCard) {
      updateEditorInputs(user.institutions, user.role);
    }
    // eslint-disable-next-line
  }, [user]);

  //Incharge of changing the state for the editor inputs
  const userManagerEditorInputChangedHandler = (event, controlName) => {
    let updatedControls;
    if (controlName === "institution") {
      //Gets the proper institution to push into user profile
      let selectedClient;
      clients.forEach(client => {
        if (client.id === event.target.value) {
          selectedClient = client;
        }
      });
      updatedControls = updateObject(userManagerEditor, {
        [controlName]: updateObject(userManagerEditor[controlName], {
          value: selectedClient,
          valid: checkValidity(
            event.target.value,
            userManagerEditor[controlName].validation
          ),
          touched: true
        })
      });
    } else {
      updatedControls = updateObject(userManagerEditor, {
        [controlName]: updateObject(userManagerEditor[controlName], {
          value: event.target.value,
          valid: checkValidity(
            event.target.value,
            userManagerEditor[controlName].validation
          ),
          touched: true
        })
      });
    }
    setuserManagerEditor(updatedControls);
  };

  if (onlyEditUsersCard) {
    return (
      <EditUsersCard
        openCardHandler={openCardHandler}
        user={user}
        clients={clients}
        isChanging={userActionsHandler}
        userManagerEditor={userManagerEditor}
        inputChangedHandler={userManagerEditorInputChangedHandler}
      />
    );
  } else {
    return (
      <Paper
        className={classes.paper}
        style={prefersDarkMode ? { border: "unset" } : null}
      >
        <div className={classes.userCard}>
          <div className={classes.nameAndRole}>
            <Typography className={classes.userNameAndRole}>
              {user.displayName}
            </Typography>
            <Typography variant="caption" className={classes.userNameAndRole}>              
              {user.role}
            </Typography>
          </div>
          <div className={classes.userActions}>
            <IconButton
              aria-label="edit"
              color="primary"
              onClick={() => {
                userActionsHandler("edit");
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
            <IconButton
              aria-label="inactivate"
              onClick={() => {
                userActionsHandler("inactivate");
              }}
            >
              <PowerSettingsNewOutlinedIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              className={classes.deleteButton}
              onClick={() => {
                userActionsHandler("delete");
              }}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </div>
        </div>
        <Collapse in={editToggle && isMobile} timeout="auto">
          <div className={classes.editUsersPanel}>
            <EditUsersCard
              isMobile
              user={user}
              openCardHandler={userActionsHandler}
              clients={clients}
              userManagerEditor={userManagerEditor}
              inputChangedHandler={userManagerEditorInputChangedHandler}
              isChanging={userActionsHandler}
            />
          </div>
        </Collapse>
      </Paper>
    );
  }
};

export default UserCard;
