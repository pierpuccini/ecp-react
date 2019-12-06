/* React imports */
import React, { useState, useEffect } from "react";
import { withRouter, useParams } from "react-router-dom";
/* Redux */
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

const ViewClassroom = props => {
  let { id } = useParams();
  const { createSuccess, getClassroom } = props;

  const [domReady, setDomReady] = useState(false);

  /* Use efect handles async loading for loader */
  // Fetches new course on load
  useEffect(() => {
    async function getMyClassrooms() {
      await getClassroom({ id: id });
    }
    getMyClassrooms()
      .then(() => {
        setDomReady(true);
      })
      .catch(err => {
        console.log("err", err);
      });
    /* MISSING DEP: getAllMyClassrooms, role, userId */
    // eslint-disable-next-line
  }, []);

  /* Fetches a new course when created */
  useEffect(() => {
    async function getMyClassrooms() {
      await getClassroom({ id: id });
    }
    if (createSuccess) {
      getMyClassrooms()
        .then(() => {
          setDomReady(true);
        })
        .catch(err => {
          console.log("err", err);
        });
    }
    /* MISSING DEP: getAllMyClassrooms, role, userId */
    // eslint-disable-next-line
  }, [createSuccess]);

  if (domReady) {
    return <div>view classrom</div>;
  } else {
    return <div>Loading</div>;
  }
};

const mapStateToProps = state => {
  return {
    role: state.firebase.profile.role,
    loading: state.classrooms.loading,
    createSuccess: state.classrooms.success
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getClassroom: payload => dispatch(actions.getClassroom(payload))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewClassroom)
);
