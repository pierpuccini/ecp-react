/* React imports */
import React, { useState } from "react";
/* Redux Imports */
// import { connect } from "react-redux";
// import * as actions from "../../store/actions/index";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
/* App imports */
import Loader from "../../components/UI/Loader/PngLoader/PngLoader";
import UserManager from "../../components/Users/UserManager/UserManager";
import { updateObject, checkValidity } from "../../shared/utility";

const UserManagment = () => {
  const [checkboxState, setcheckboxState] = useState({
    students: true,
    teachers: true
  });

  const [selectedUser, setselectedUser] = useState(null);
  const [openCard, setopenCard] = useState(false);

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
    { collection: "clients", storeAs: "clients", where: ["active", "==", true] }
  ]);
  const students = useSelector(
    ({ firestore: { ordered } }) => ordered.students
  );
  const teachers = useSelector(
    ({ firestore: { ordered } }) => ordered.teachers
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
    setcheckboxState({ ...checkboxState, [name]: event.target.checked });
  };

  //Incharge of openeing the side card
  const openCardHandler = action => {
    if (action === "open") {
      setopenCard(true);
    } else {
      setopenCard(false);
    }
  };

  //TODO: Remove when accepting more than 1 institution
  //Incharge of assigning an institution the the state
  const whichInstitutions = institutions => {
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
      })
    });
    setuserManagerEditor(updatedControls);
  };

  //Incharge of relying the changed information
  const cardChangedHandler = (action, user) => {
    whichInstitutions(user.institutions);
    setselectedUser(user);
    //Opens the card if the edit button is triggerd and card is closed
    if (action === "edit" && !openCard) {
      openCardHandler("open");
    }
  };

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

  return (
    <UserManager
      students={students}
      teachers={teachers}
      clients={clients}
      userManagerEditor={userManagerEditor}
      inputChangedHandler={userManagerEditorInputChangedHandler}
      checkboxState={checkboxState}
      handleCheckboxChange={handleCheckboxChange}
      cardChangedHandler={cardChangedHandler}
      selectedUser={selectedUser}
      openCard={openCard}
      openCardHandler={openCardHandler}
    />
  );
};

export default UserManagment;
