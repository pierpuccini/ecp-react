/* React imports */
import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
/* Redux */
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
//Icons
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
/* App imports */
import PermisionError from "../../components/Errors/PermisionError/PermisionError";
import Loader from "../../components/UI/Loader/PngLoader/PngLoader";
import asyncComponent from "../../hoc/asyncComponent/asyncComponent";
import customClasses from "./ClassroomsContoller.module.scss";
import AddClassroomModal from "../../components/Classroom/AddClassroomModal";
import Modal from "../../components/UI/Modal/Modal";
import FloatingLoader from "../../components/UI/Loader/FloatingLoader/FloatingLoader";
import { updateObject, checkValidity } from "../../shared/utility";

const createClassroom = asyncComponent(() => {
  return import("./Actions/CreateClassroom");
});

const useStyles = makeStyles(theme => ({
  container: {
    padding: "unset !important",
    [theme.breakpoints.up("md")]: {
      minWidth: "685px !important"
    }
  },
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      "box-shadow": "unset"
    }
  },
  button: {
    [theme.breakpoints.down("xs")]: {
      minWidth: "200px",
      width: "100%"
    }
  },
  actionButtonsContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap"
  },
  classroomListHeader: {
    display: "flex",
    alignSelf: "center"
  },
  classroomListHeaderContainer: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

const ClassroomController = props => {
  const classes = useStyles();
  const {
    location,
    role,
    userId,
    loading,
    getAllMyClassrooms,
    createSuccess
  } = props;

  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);
  const [navRoute, setNavRoute] = useState("classrooms");
  const [openAddClassModal, setopenAddClassModal] = useState(false);
  const [addClassroomForm, setaddClassroomForm] = useState({
    linkCode: {
      value: "",
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  });

  /* Use efect handles async loading for loader */
  // Fetches new course on load
  useEffect(() => {
    async function getMyClassrooms() {
      await getAllMyClassrooms({ role: role, uid: userId });
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
      await getAllMyClassrooms({ role: role, uid: userId });
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

  /* TODO: REMOVE SHOW COIN LOADER IN USE EFECT BELLOW AND THE RETURN */
  /* Use efect handles local component routing */
  useEffect(() => {
    // let showCoinLoader = setTimeout(() => {
    //   setDomReady(true);
    // }, 750);
    const parsedPath = location.pathname.replace("/", "").split("/");
    if (parsedPath.length > 1) {
      setNavRoute(`classrooms/${parsedPath[1]}`);
    }
    if (location.state) {
      setNavRoute(`${location.state.overwriteLocalNavState}`);
    }
    // return () => {
    //   clearTimeout(showCoinLoader);
    // };
  }, [location]);

  const handleNavChange = (event, newValue) => {
    setNavRoute(newValue);
  };

  let openAddClassModalCopy;
  const handleAddClassStudent = () => {
    openAddClassModalCopy = openAddClassModal;
    if (!openAddClassModal) {
      setaddClassroomForm({
        linkCode: {
          value: "",
          validation: {
            required: true,
            minLength: 6
          },
          valid: false,
          touched: false
        }
      });
    }
    setopenAddClassModal(!openAddClassModalCopy);
  };

  const addClassroomInputHandler = (event, controlName) => {
    const updatedControls = updateObject(addClassroomForm, {
      [controlName]: updateObject(addClassroomForm[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          addClassroomForm[controlName].validation
        ),
        touched: true
      })
    });
    setaddClassroomForm(updatedControls);
  };

  const addClassroomHandler = event => {
    event.preventDefault();
    setopenAddClassModal(false);
    const payload = {
      code_classroom: addClassroomForm.linkCode.value
    };
    props.addClassroom(payload);
  };
  /* Define new routes in routes array with their url and corresponding component */
  let routes, redirect;
  const routesArray = [
    { url: "create", comp: createClassroom, restriction: "student" }
  ];

  /* Conditional routes section */
  redirect = <Redirect to={`/${navRoute}`} />;

  //Available routes or Guarded routes
  routes = (
    <Switch>
      {routesArray.map((route, index) => {
        if (route.restriction !== role) {
          return (
            <Route
              path={`/classrooms/${route.url}`}
              key={`/classrooms/${route.url}`}
              component={route.comp}
            />
          );
        } else {
          return <PermisionError key={index} />;
        }
      })}
    </Switch>
  );

  const classroomManager = (
    <React.Fragment>
      <Typography>Classroom Manager</Typography>
      <div className={classes.actionButtonsContainer}>
        <Button
          variant="contained"
          color="primary"
          className={customClasses.button}
          endIcon={<AddCircleOutlineOutlinedIcon />}
          onClick={event => {
            handleNavChange(event, "classrooms/create");
          }}
        >
          Create Classroom
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={customClasses.button}
          endIcon={<EditOutlinedIcon />}
          onClick={event => {
            handleNavChange(event, "classrooms/edit");
          }}
        >
          Edit Classroom
        </Button>
      </div>
    </React.Fragment>
  );

  let floatingLoader;
  if (loading) {
    floatingLoader = <FloatingLoader></FloatingLoader>;
  }

  const classrooomController =
    location.pathname === "/classrooms" ? (
      <Container maxWidth="md" className={classes.container}>
        {redirect}
        <Paper className={classes.paper}>
          {role === "student" ? null : classroomManager}
          <div className={classes.classroomListHeaderContainer}>
            <div className={classes.classroomListHeader}>
              <Icon style={{ marginRight: "5px" }}>
                <ListOutlinedIcon />
              </Icon>
              <Typography>Classroom List</Typography>
            </div>
            {role === "student" ? (
              <IconButton onClick={handleAddClassStudent}>
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            ) : null}
          </div>
          {floatingLoader}
          <Modal
            openModal={openAddClassModal}
            closeModal={handleAddClassStudent}
          >
            <AddClassroomModal
              addClassroomForm={addClassroomForm}
              addClassroomFormChanged={addClassroomInputHandler}
              submitHandler={addClassroomHandler}
            />
          </Modal>
        </Paper>
      </Container>
    ) : (
      <React.Fragment>
        {redirect}
        {routes}
      </React.Fragment>
    );

  const loadingDom = (
    <div style={{ alignSelf: "center" }}>
      <Loader />
    </div>
  );

  return (
    <React.Fragment>
      {domReady ? classrooomController : loadingDom}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    role: state.firebase.profile.role,
    loading: state.classrooms.loading,
    userId: state.firebase.auth.uid,
    createSuccess: state.classrooms.success
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addClassroom: payload => dispatch(actions.addClassroom(payload)),
    getAllMyClassrooms: payload => dispatch(actions.getAllMyClassrooms(payload))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClassroomController)
);
