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

const UserManagment = () => {
  const [checkboxState, setcheckboxState] = useState({
    students: true,
    teachers: true
  });

  const [selectedUser, setselectedUser] = useState(null);
  const [openCard, setopenCard] = useState(false);

  /* Loads teachers and studets data from Firestore */
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
    }
  ]);
  const students = useSelector(
    ({ firestore: { ordered } }) => ordered.students
  );
  const teachers = useSelector(
    ({ firestore: { ordered } }) => ordered.teachers
  );

  /* Checks if data is loaded from firestore */
  if (!isLoaded(teachers)) {
    return (
      <div className="App" style={{ width: "100%" }}>
        <Loader />
      </div>
    );
  }

  const handleCheckboxChange = name => event => {
    setcheckboxState({ ...checkboxState, [name]: event.target.checked });
  };

  const openCardHandler = action => {
    if (action === "open") {
      setopenCard(true);
    } else {
      setopenCard(false);
    }
  };

  const cardChangedHandler = (action, user) => {
    console.log("action", action);
    console.log("user", user);
    setselectedUser(user);
    //Opens the card if the edit button is triggerd and card is closed
    if (action === "edit" && !openCard) {
      openCardHandler("open");
    }
  };

  return (
    <UserManager
      students={students}
      teachers={teachers}
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
