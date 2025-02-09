/* React imports */
import React, { useState } from "react";
/* Redux Imports */
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { amber } from "@material-ui/core/colors";
//Icons
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
/* App imports */
import { stateToPayload } from "../../shared/utility";
import Loader from "../../components/UI/Loader/PngLoader/PngLoader";
import FloatingLoader from "../../components/UI/Loader/FloatingLoader/FloatingLoader";
import UserManager from "../../components/Users/UserManager/UserManager";
import Modal from "../../components/UI/Modal/Modal";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  modalActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
}));

const UserManagment = props => {
  const classes = useStyles();

  const [checkboxState, setcheckboxState] = useState({
    all: true,
    students: true,
    teachers: true,
    admins: true
  });

  const [selectedUser, setselectedUser] = useState(null);
  const [openCard, setopenCard] = useState(false);
  const [openAdminChangeModal, setopenAdminChangeModal] = useState(false);
  const [modalType, setmodalType] = useState(null);
  const [localTemp, setlocalTemp] = useState(null);

  /* Loads clients, teachers and studets data from Firestore */
  useFirestoreConnect(() => [
    {
      collection: "users",
      storeAs: "students",
      where: ["role", "==", "student"]
    },
    {
      collection: "users",
      storeAs: "teachers",
      where: ["role", "==", "teacher"]
    },
    {
      collection: "users",
      storeAs: "pendingUsers",
      where: ["role", "==", ""]
    },
    {
      collection: "users",
      storeAs: "admins",
      where: ["role", "==", "admin"]
    },
    {
      collection: "clients",
      storeAs: "clients",
      where: ["active", "==", true]
    }
  ]);
  const students = useSelector(
    ({ firestore: { ordered } }) => ordered.students
  );
  const teachers = useSelector(
    ({ firestore: { ordered } }) => ordered.teachers
  );
  const pendingUsers = useSelector(
    ({ firestore: { ordered } }) => ordered.pendingUsers
  );
  let admins = useSelector(({ firestore: { ordered } }) => ordered.admins);
  const clients = useSelector(({ firestore: { ordered } }) => ordered.clients);

  /* Checks if data is loaded from firestore */
  if (!isLoaded(clients, admins, pendingUsers, teachers, students)) {
    return (
      <div className="App" style={{ width: "100%" }}>
        <Loader />
      </div>
    );
  }

  /* shows admins to only super admin accounts */
  if (props.myRole === "super-admin") {
    let myAccIndex;
    admins.forEach((adminAccounts, index) => {
      if (adminAccounts.id === props.myAccountId) {
        return (myAccIndex = index);
      }
    });
    if (myAccIndex != null) {
      admins.splice(myAccIndex, 1);
    }
  } else {
    admins = [];
  }

  //Incharge of the checkbox filters
  const handleCheckboxChange = name => event => {
    if (name === "all" && event.target.checked) {
      setcheckboxState({
        all: true,
        students: true,
        teachers: true,
        admins: true
      });
    } else {
      setcheckboxState({
        ...checkboxState,
        all: false,
        [name]: event.target.checked
      });
    }
  };

  //Incharge of openeing the side card
  const openCardHandler = action => {
    if (action === "open") {
      setopenCard(true);
    } else {
      setopenCard(false);
    }
  };

  //Incharge of relying the changed information
  const cardChangedHandler = (action, user, changedFields) => {
    setselectedUser(user);
    //Opens the card if the edit button is triggerd and card is closed
    if (action === "edit" && !openCard) {
      openCardHandler("open");
    }
    if (action === "save") {
      if (changedFields.role.value === "admin") {
        setlocalTemp({
          user: user,
          changedFields: changedFields
        });
        setmodalType(null);
        setopenAdminChangeModal(true);
      } else {
        const payload = {
          userId: user.id,
          ...stateToPayload(changedFields)
        };
        props.userManager(payload);
        openCardHandler(action);
      }
    }
    if (action === "confirmAdminChange") {
      openCardHandler(false);
      handleModal("cancel");
      const payload = {
        userId: user.id,
        adminBy: "get-user",
        ...stateToPayload(changedFields)
      };
      console.log("saved payload", payload);
      props.userManager(payload);
      openCardHandler(action);
    }
    if (action === "inactivate") {
      const payload = {
        uid: user.id,
        action: "disabled",
        disabled: !user.disabled
      };
      props.userManagerAuthActions(payload);
    }
    if (action === "delete") {
      setlocalTemp({
        user: user
      });
      setopenAdminChangeModal(true);
      setmodalType("delete");
    }
    if (action === "confirmDelete") {
      openCardHandler(false);
      handleModal("cancel");
      const payload = {
        uid: localTemp.user.id,
        action: "delete"
      };
      props.userManagerAuthActions(payload);
      openCardHandler(action);
    }
  };

  /* Handles modal on create succes */
  const handleModal = action => {
    if (action === "continue") {
      openCardHandler("confirmAdminChange");
      setopenAdminChangeModal(false);
    } else {
      setopenAdminChangeModal(false);
    }
  };

  const modalTemplate = (
    <div>
      <div className={classes.modalHeader}>
        <ReportProblemOutlinedIcon
          style={
            modalType !== "delete"
              ? {
                  alignSelf: "center",
                  marginRight: "8px",
                  color: amber[700]
                }
              : {
                  alignSelf: "center",
                  marginRight: "8px",
                  color: "#d32f2f"
                }
          }
        />
        <Typography
          variant="h5"
          style={
            modalType !== "delete"
              ? { color: amber[700] }
              : { color: "#d32f2f" }
          }
        >
          Warning!
        </Typography>
      </div>
      <Typography
        variant="body2"
        style={{
          textAlign: "center",
          margin: "8px 0px"
        }}
      >
        {modalType !== "delete" ? (
          <div>
            Are you sure you want to convert this user to <strong>Admin</strong>
            ?
          </div>
        ) : (
          "Are you sure you want to delete this user"
        )}
      </Typography>
      <Typography variant="body2" style={{ textAlign: "center" }}>
        THIS CHANGE IS NOT REVERSIBLE
      </Typography>
      <div className={classes.modalActions}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="small"
          style={{
            backgroundColor: "#f44336",
            color: "#ffffff"
          }}
          onClick={() => {
            handleModal("cancel");
          }}
        >
          cancel
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          style={{ backgroundColor: amber[700] }}
          size="small"
          onClick={() => {
            cardChangedHandler(
              modalType !== "delete" ? "confirmAdminChange" : "confirmDelete",
              localTemp.user,
              localTemp.changedFields
            );
          }}
        >
          Proceed at your own risk
        </Button>
      </div>
      {modalType !== "delete" ? (
        <Typography
          variant="caption"
          style={{
            textAlign: "center",
            margin: "8px 0px"
          }}
        >
          *This user will not appear in the user list anymore.
        </Typography>
      ) : null}
    </div>
  );

  //Floating Loader
  let floatingLoader;
  if (props.loading) {
    floatingLoader = <FloatingLoader></FloatingLoader>;
  }
  return (
    <React.Fragment>
      {floatingLoader}
      <Modal
        openModal={openAdminChangeModal}
        closeModal={() => {
          handleModal();
        }}
      >
        {modalTemplate}
      </Modal>
      <UserManager
        students={students}
        teachers={teachers}
        pendingUsers={pendingUsers == null ? [] : pendingUsers}
        admins={admins}
        clients={clients}
        checkboxState={checkboxState}
        handleCheckboxChange={handleCheckboxChange}
        cardChangedHandler={cardChangedHandler}
        selectedUser={selectedUser}
        openCard={openCard}
        openCardHandler={openCardHandler}
        myRole={props.myRole}
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    myAccountId: state.firebase.auth.uid,
    myRole: state.firebase.profile.role,
    loading: state.users.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userManager: payload => dispatch(actions.userManager(payload)),
    userManagerAuthActions: payload =>
      dispatch(actions.userManagerAuthActions(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManagment);
