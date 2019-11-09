//React imports
import React from 'react'
//Redux
import { connect } from "react-redux";
// import * as actions from "../../store/actions/index";
//App imports
import ClassroomManager from '../../components/Classroom/ClassroomManager'
import ClassroomViewer from '../../components/Classroom/ClassroomViewer'

const Classroom = (props) => {
    let roleView = <ClassroomViewer/>
    if (props.role !== 'student') {
        roleView = <ClassroomManager/>
    }
    return roleView
}

const mapStateToProps = state => {
    return {
      profileLoaded: state.firebase.profile.isLoaded,
      role: state.firebase.profile.role
    };
  };
  
export default connect(mapStateToProps)(Classroom); 
