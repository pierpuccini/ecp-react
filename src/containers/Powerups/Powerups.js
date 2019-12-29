/* React Imports */
import React, { useState } from "react";
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
  const { role, loading, userId, powerupActions } = props;

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
    classroom: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    }
  });
  const [openModal, setopenModal] = useState(false);

  if (type === "view" && role === "teacher") {
    type = "manage";
  } else if (type === "manage") {
    type = "manage";
  } else {
    type = "view";
  }
  let test = ["a", "a", "a", "a", "a"];

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
        value: value != null ? value.id : "",
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
    }
  };

  const handlePowerupModal = () => {
    setopenModal(true);
  };

  const handleCloseModal = () => {
    let openModalCopy = openModal;
    setopenModal(!openModalCopy);
  };

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
        {test.map((item, index) => {
          return (
            <Grid key={index} item md={3} sm={6} xs={12}>
              <PowerupCards viewType={type} role={role} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    role: state.firebase.profile.role,
    loading: state.powerups.loading,
    userId: state.firebase.auth.uid
  };
};

const mapDispatchToProps = dispatch => {
  return {
    powerupActions: payload => dispatch(actions.powerupActions(payload))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Powerups)
);
