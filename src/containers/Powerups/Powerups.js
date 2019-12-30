/* React Imports */
import React, { useState, useEffect } from "react";
import { withRouter, useParams } from "react-router-dom";
/* Redux */
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
//Icons
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
/* App Imports */
import Modal from "../../components/UI/Modal/Modal";
import EditCreatePowerup from "../../components/Powerups/Modals/EditCreatePowerup";
import PowerupInfoCard from "../../components/Powerups/PowerupInfoCard";
import PowerupCards from "../../components/Powerups/PowerupCards";
import PngLoader from "../../components/UI/Loader/PngLoader/PngLoader";
import FloatingLoader from "../../components/UI/Loader/FloatingLoader/FloatingLoader";
import DynamicText from "../../components/UI/SpecialFields/DynamicText";
import CoinIcon from "../../components/UI/CoinIcon/CoinIcon";
import {
  updateObject,
  checkValidity,
  stateToPayload
} from "../../shared/utility";

const useStyles = makeStyles(theme => ({
  powerupsContainer: {
    padding: "unset !important",
    overflow: "auto",
    maxWidth: "unset"
  },
  grid: {
    width: "100%",
    margin: "unset"
  },
  classroomDivider: {
    display: "flex",
    margin: theme.spacing(0, 3),
    justifyContent: "space-between"
  },
  button: {
    margin: theme.spacing(1),
    backgroundColor: green[700]
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
    getPowerups,
    purchasePowerupAPI
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
    classroom: {
      value: { subject_name: "" },
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    benefit: {
      value: { type: "", value: 0 },
      validation: {
        required: true
      },
      valid: false,
      touched: false
    }
  });
  const [openModal, setopenModal] = useState(false);
  const [checkoutCart, setcheckoutCart] = useState({});

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
      collection: "clients",
      storeAs: "clients",
      where: ["active", "==", true]
    }
  ]);

  const students = useSelector(
    ({ firestore: { ordered } }) => ordered.students
  );
  const teachers = useSelector(
    ({ firestore: { ordered } }) => ordered.teachers
  );
  const clients = useSelector(({ firestore: { ordered } }) => ordered.clients);

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

  const benefitChangeHandler = (event, value, control) => {
    let updatedControls = updateObject(createEditPowerup, {
      benefit: updateObject(createEditPowerup.benefit, {
        value: updateObject(createEditPowerup.benefit.value, {
          [control]: value
        }),
        valid: checkValidity(
          value == null ? "" : value.toString(),
          createEditPowerup.benefit.validation
        ),
        touched: true
      })
    });

    let { benefit } = updatedControls;
    benefit = benefit.value;

    let valid = false,
      descriptionValue;
    if (benefit.type != null && benefit.value != null && benefit.value !== 0) {
      valid = true;
      descriptionValue = `This powerup will ${
        benefit.type === "*" ? "Multiply" : "Divide"
      } the challenges coins by ${benefit.value}`;
    }

    if (benefit.type == null) {
      descriptionValue = "Please select a benefit type";
    }
    if (benefit.value == null || benefit.value === 0) {
      descriptionValue = "Please select a benefit value";
    }

    updatedControls = updateObject(updatedControls, {
      description: updateObject(updatedControls.description, {
        value: descriptionValue,
        valid: valid,
        touched: true
      })
    });
    setcreateEditPowerup(updatedControls);
  };

  const powerupActionButtons = (action, id) => {
    console.log("action", action);
    switch (action) {
      case "save":
        let info = stateToPayload(createEditPowerup);
        powerupActions({ ...info, id: id, teacher_id: userId });
        break;
      case "cancel":
        handleCloseModal();
        break;
      case "delete":
        powerupActions({ deleted: "", id: id });
        break;
      case "edit":
        setEditPowerup(id);
        handlePowerupModal();
        break;
      default:
        handleCloseModal();
        break;
    }
  };

  const handlePowerupModal = () => {
    setopenModal(true);
  };

  const setEditPowerup = powerup => {
    console.log("editing", powerup);
    let updatedControls = createEditPowerup;
    for (const controlName in updatedControls) {
      if (updatedControls.hasOwnProperty(controlName)) {
        updatedControls[controlName] = {
          ...updatedControls[controlName],
          value: powerup[controlName],
          valid: true,
          touched: true
        };
      }
    }
    setcreateEditPowerup({ ...updatedControls, id: powerup.id });
  };

  const clearCreateEditState = () => {
    let updatedControls = createEditPowerup;
    for (const controlName in updatedControls) {
      if (updatedControls.hasOwnProperty(controlName)) {
        updatedControls[controlName] = {
          ...updatedControls[controlName],
          value:
            controlName === "benefit"
              ? { type: "", value: 0 }
              : controlName === "classroom"
              ? { subject_name: "" }
              : "",
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

  const handleCart = data => {
    if (data.classroom in checkoutCart && data.type === "+") {
      let updatedCart = checkoutCart[data.classroom].push(data.powerup);
      setcheckoutCart({ ...checkoutCart, updatedCart });
    } else if (data.classroom in checkoutCart && data.type === "-") {
      let powerupToRemove = checkoutCart[data.classroom].findIndex(
        pw => pw.id === data.powerup.id
      );
      if (powerupToRemove !== -1) {
        let updatedCart = checkoutCart[data.classroom].splice(
          powerupToRemove,
          1
        );
        setcheckoutCart({ ...checkoutCart, updatedCart });
      }
    }
  };

  const createCarts = classrooms => {
    if (classrooms != null && classrooms.length > 0) {
      let carts = {};
      classrooms.forEach(cl => (carts[cl] = []));
      setcheckoutCart(carts);
    }
  };

  const getOccurrence = (array, value) => array.filter(v => v === value).length;

  const purchasePowerup = classroomName => {
    let payload = [];
    let uniquecheckoutCart = [...new Set(checkoutCart[classroomName])];
    uniquecheckoutCart.forEach(pw => {
      let quantity = getOccurrence(checkoutCart[classroomName], pw);
      let master_id = pw.id;
      let benefit = pw.benefit;
      let buyer = userId;
      payload = [...payload, { quantity, master_id, benefit, buyer }];
    });
    purchasePowerupAPI(payload);
  };

  /* Creates cart per classroom */
  useEffect(() => {
    if (powerups != null) {
      let classrooms = [];
      powerups.forEach(pw => {
        classrooms = [...classrooms, ...Object.keys(pw)];
      });
      createCarts(classrooms);
    }
  }, [powerups]);

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
        createCarts(powerups);
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
      handleCloseModal();
    }
    /* MISSING DEP: 'classrooms', 'getPowerups', 'role', and 'userId', handleCloseModal */
    // eslint-disable-next-line
  }, [success]);

  if (isLoaded(clients, teachers, students) && domReady) {
    let localPowerups = powerups != null ? [...powerups] : [];
    return (
      <Container className={classes.powerupsContainer}>
        {loading ? <FloatingLoader></FloatingLoader> : null}
        <Modal openModal={openModal} closeModal={handleCloseModal}>
          <EditCreatePowerup
            form={createEditPowerup}
            inputChangedHandler={createEditInputHandler}
            buttonClickHandler={powerupActionButtons}
            teacherId={userId}
            handleAutocompleteChange={handleAutocompleteChange}
            dbLoading={loading}
            benefitChangeHandler={benefitChangeHandler}
          />
        </Modal>
        <PowerupInfoCard
          viewType={type}
          role={role}
          handlePowerupModal={handlePowerupModal}
        />
        {localPowerups.length === 0 ? (
          <Typography style={{ textAlign: "center" }}>
            No power ups available.
          </Typography>
        ) : null}
        {localPowerups.map((powerupsByClassroom, index) => {
          const classroomName = Object.keys(powerupsByClassroom);
          return (
            <React.Fragment key={index}>
              <div className={classes.classroomDivider}>
                <DynamicText
                  mainText={classroomName}
                  text="Classroom"
                  variantArray={["body1"]}
                  type="subtext"
                />
                {role !== "teacher" ? (
                  <React.Fragment>
                    <DynamicText
                      mainText={"900"}
                      text="Coins for this course"
                      variantArray={["body1"]}
                      type="subtext"
                      icon={<CoinIcon width="24px" height="24px" />}
                    />
                    <Button
                      variant="contained"
                      className={classes.button}
                      size="small"
                      disabled={checkoutCart[classroomName] == null || checkoutCart[classroomName].length === 0}
                      onClick={() => {
                        purchasePowerup(classroomName);
                      }}
                    >
                      <ShoppingCartOutlinedIcon /> Buy (
                      {checkoutCart[classroomName] == null
                        ? 0
                        : checkoutCart[classroomName].length}
                      )
                    </Button>
                  </React.Fragment>
                ) : null}
              </div>
              <Divider variant="middle"></Divider>
              <Grid container spacing={2} className={classes.grid}>
                {powerupsByClassroom[classroomName].map((powerUp, index) => {
                  return (
                    <Grid key={index} item md={3} sm={6} xs={12}>
                      <PowerupCards
                        viewType={type}
                        role={role}
                        powerup={powerUp}
                        actionHandler={powerupActionButtons}
                        handleClassroomCart={handleCart}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </React.Fragment>
          );
        })}
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
    getPowerups: payload => dispatch(actions.getPowerups(payload)),
    purchasePowerupAPI: payload => dispatch(actions.purchasePowerup(payload))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Powerups)
);
