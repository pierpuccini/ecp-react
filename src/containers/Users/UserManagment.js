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
// import { updateObject, checkValidity } from "../../shared/utility";

const UserManagment = () => {
  const [checkboxState, setcheckboxState] = useState({
    students: true,
    teachers: true
  });

  const [selectedUser, setselectedUser] = useState(null);
  const [openCard, setopenCard] = useState(false);

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

  //Incharge of relying the changed information
  const cardChangedHandler = (action, user, changedFields) => {
    setselectedUser(user);
    //Opens the card if the edit button is triggerd and card is closed
    if (action === "edit" && !openCard) {
      openCardHandler("open");
    }
    if (action === 'save') {
        openCardHandler(action);
        if (changedFields.role.value === 'admin') {
            console.log('are you sure you want to make this user an admin?');
        }
        console.log('saving');
    }
  };

  return (
    <UserManager
      students={students}
      teachers={teachers}
      clients={clients}
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
