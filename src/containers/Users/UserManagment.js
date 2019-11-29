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

  return (
    <UserManager
      students={students}
      teachers={teachers}
      checkboxState={checkboxState}
      handleCheckboxChange={handleCheckboxChange}
    />
  );
};

export default UserManagment;
