/* React Imports */
import React from "react";
import { withRouter } from "react-router-dom";
//Redux
import { connect } from "react-redux";
//App imports
import ClassroomCreator from "../../../components/Classroom/ClassroomCreator";

const CreateClassroom = (props) => {
  const { classrooms } = props;
  
  //Action to push to the main classroom page /classrooms
  const handleNav = () => {
    props.history.push({state: {overwriteLocalNavState: 'classrooms'}});
  }
  
  return <ClassroomCreator navActions={handleNav} classrooms={classrooms}/>;
};

const mapStateToProps = state => {
  return {
    role: state.firebase.profile.role,
    institutions: state.firebase.profile.institutions,
    classrooms: state.firebase.profile.classrooms
  };
};

export default withRouter(connect(mapStateToProps)(CreateClassroom))
