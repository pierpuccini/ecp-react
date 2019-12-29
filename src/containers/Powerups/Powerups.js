/* React Imports */
import React, { useState, useEffect } from "react";
import { withRouter, useParams } from "react-router-dom";
/* Redux */
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
/* App Imports */
import Modal from "../../components/UI/Modal/Modal";
import EditCreatePowerup from "../../components/Powerups/Modals/EditCreatePowerup";
import PowerupInfoCard from "../../components/Powerups/PowerupInfoCard";
import PowerupCards from "../../components/Powerups/PowerupCards";
import PngLoader from "../../components/UI/Loader/PngLoader/PngLoader";
import {
  updateObject,
  checkValidity,
  stateToPayload
} from "../../shared/utility";

const useStyles = makeStyles(theme => ({
  powerupsContainer: {
    padding: "unset !important",
    overflow: "auto"
  },
  grid: {
    width: "100%",
    margin: "unset"
  }
}));

const Powerups = props => {
  const classes = useStyles();

  let { type } = useParams();
  const {
    role,
    classrooms,
    loading,
    success,
    powerups,
    userId,
    powerupActions,
    getPowerups
  } = props;

  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);
  const [createEditPowerup, setcreateEditPowerup] = useState({
    name: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    description: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    cost: {
      value: "",
      validation: {
        required: true,
        specialNumber: {
          min: 0,
          max: null,
          step: 1
        }
      },
      valid: false,
      touched: false
    },
    quantity: {
      value: "",
      validation: {
        required: true,
        specialNumber: {
          min: 0,
          max: null,
          step: 1
        }
      },
      valid: false,
      touched: false
    },
    classroom_id: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    }
  });
  const [openModal, setopenModal] = useState(false);

  /* Fetches powerups on initial load */
  useEffect(() => {
    async function getMyPowerups(payload) {
      await getPowerups(payload);
    }
    let payload = { role: role };
    if (role === "teacher") {
      payload.id = userId;
    } else {
      let classroomIds = [];
      classrooms.forEach(classrooms => {
        classroomIds.push(classrooms.id);
      });
      payload.id = classrooms;
    }
    getMyPowerups(payload)
      .then(res => {
        setDomReady(true);
      })
      .catch(err => {
        console.log("err", err);
      });
    /* MISSING DEP: 'classrooms', 'getPowerups', 'role', and 'userId' */
    // eslint-disable-next-line
  }, []);

  /* Fetches powerups after creating them */
  useEffect(() => {
    if (success) {
      async function getMyPowerups(payload) {
        await getPowerups(payload);
      }
      let payload = { role: role };
      if (role === "teacher") {
        payload.id = userId;
      } else {
        let classroomIds = [];
        classrooms.forEach(classrooms => {
          classroomIds.push(classrooms.id);
        });
        payload.id = classrooms;
      }
      getMyPowerups(payload)
        .then(res => {
          setDomReady(true);
        })
        .catch(err => {
          console.log("err", err);
        });
      setopenModal(false);
    }
    /* MISSING DEP: 'classrooms', 'getPowerups', 'role', and 'userId' */
    // eslint-disable-next-line
  }, [success]);

  if (type === "view" && role === "teacher") {
    type = "manage";
  } else if (type === "manage") {
    type = "manage";
  } else {
    type = "view";
  }

  const createEditInputHandler = (event, controlName) => {
    const updatedControls = updateObject(createEditPowerup, {
      [controlName]: updateObject(createEditPowerup[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          createEditPowerup[controlName].validation
        ),
        touched: true
      })
    });
    setcreateEditPowerup(updatedControls);
  };

  const handleAutocompleteChange = (event, value) => {
    console.log(value);
    const updatedControls = updateObject(createEditPowerup, {
      classroom: updateObject(createEditPowerup.classroom, {
        value: value,
        valid: checkValidity(
          value != null ? value.subject_name : "",
          createEditPowerup.classroom.validation
        ),
        touched: true
      })
    });
    setcreateEditPowerup(updatedControls);
  };

  const createEditActions = (action, id) => {
    console.log("action", action);
    if (action === "save") {
      let info = stateToPayload(createEditPowerup);
      powerupActions({ ...info, id: id, teacher_id: userId });
    } else if (action === "cancel") {
      handleCloseModal();
    }
  };

  const handlePowerupModal = () => {
    setopenModal(true);
  };

  const clearCreateEditState = () => {
    let updatedControls = createEditPowerup;
    for (const controlName in updatedControls) {
      if (updatedControls.hasOwnProperty(controlName)) {
        updatedControls[controlName] = {
          ...updatedControls[controlName],
          value: "",
          valid: false,
          touched: false
        };
      }
    }
    setcreateEditPowerup(updatedControls);
  };

  const handleCloseModal = () => {
    let openModalCopy = openModal;
    clearCreateEditState();
    setopenModal(!openModalCopy);
  };

  if (domReady && !loading) {
    return (
      <Container className={classes.powerupsContainer}>
        <Modal openModal={openModal} closeModal={handleCloseModal}>
          <EditCreatePowerup
            form={createEditPowerup}
            inputChangedHandler={createEditInputHandler}
            buttonClickHandler={createEditActions}
            teacherId={userId}
            handleAutocompleteChange={handleAutocompleteChange}
            dbLoading={loading}
          />
        </Modal>
        <PowerupInfoCard
          viewType={type}
          role={role}
          handlePowerupModal={handlePowerupModal}
        />
        <Grid container spacing={2} className={classes.grid}>
          {powerups.map((powerUp, index) => {
            return (
              <Grid key={index} item md={3} sm={6} xs={12}>
                <PowerupCards viewType={type} role={role} powerUp={powerUp} />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    );
  } else {
    return (
      <div style={{ alignSelf: "center" }}>
        <PngLoader />
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    role: state.firebase.profile.role,
    classrooms: state.firebase.profile.classrooms,
    loading: state.powerups.loading,
    powerups: state.powerups.dbPowerups,
    success: state.powerups.success,
    userId: state.firebase.auth.uid
  };
};

const mapDispatchToProps = dispatch => {
  return {
    powerupActions: payload => dispatch(actions.powerupActions(payload)),
    getPowerups: payload => dispatch(actions.getPowerups(payload))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Powerups)
);
