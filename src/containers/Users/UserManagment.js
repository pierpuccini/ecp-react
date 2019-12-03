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
import UserManager from "../../components/Users/UserManager/UserManager";
import Modal from "../../components/UI/Modal/Modal";

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
    teachers: true
  });

  const [selectedUser, setselectedUser] = useState(null);
  const [openCard, setopenCard] = useState(false);
  const [openAdminChangeModal, setopenAdminChangeModal] = useState(false);
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
    { collection: "clients", storeAs: "clients", where: ["active", "==", true] }
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
  const clients = useSelector(({ firestore: { ordered } }) => ordered.clients);

  /* Checks if data is loaded from firestore */
  if (!isLoaded(clients)) {
    return (
      <div className="App" style={{ width: "100%" }}>
        <Loader />
      </div>
    );
  }

  //Incharge of the checkbox filters
  const handleCheckboxChange = name => event => {
      console.log('name',name);
    if (name === "all" && event.target.checked) {
      setcheckboxState({
        all: true,
        students: true,
        teachers: true
      });
    } else {
      setcheckboxState({ ...checkboxState,all: false, [name]: event.target.checked });
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
        setopenAdminChangeModal(true);
      } else {
        const payload = { userId: user.id, ...stateToPayload(changedFields) };
        console.log("saved payload", payload);
        props.userManager(payload);
        openCardHandler(action);
      }
    }
    if (action === "confirmAdminChange") {
      openCardHandler(false);
      handleModal("cancel");
      console.log("saved", changedFields, user);
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
          style={{ alignSelf: "center", marginRight: "8px", color: amber[700] }}
        />
        <h2 style={{ color: amber[700] }}>Warning!</h2>
      </div>
      <p>Are you sure you want to convert this user to admin?</p>
      <p style={{ textAlign: "center" }}>THIS CHANGE IS NOT REVERSIBLE</p>
      <div className={classes.modalActions}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="small"
          style={{ backgroundColor: "#f44336", color: "#ffffff" }}
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
              "confirmAdminChange",
              localTemp.user,
              localTemp.changedFields
            );
          }}
        >
          Proceed at your own risk
        </Button>
      </div>
    </div>
  );

  return (
    <React.Fragment>
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
        pendingUsers={pendingUsers}
        clients={clients}
        checkboxState={checkboxState}
        handleCheckboxChange={handleCheckboxChange}
        cardChangedHandler={cardChangedHandler}
        selectedUser={selectedUser}
        openCard={openCard}
        openCardHandler={openCardHandler}
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    userManager: payload => dispatch(actions.userManager(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManagment);
