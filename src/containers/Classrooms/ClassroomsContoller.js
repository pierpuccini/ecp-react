/* React imports */
import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
/* Redux */
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Collapse from "@material-ui/core/Collapse";
//Icons
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import ListOutlinedIcon from "@material-ui/icons/ListOutlined";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";
/* App imports */
import Loader from "../../components/UI/Loader/PngLoader/PngLoader";
import asyncComponent from "../../hoc/asyncComponent/asyncComponent";
import AddClassroomModal from "../../components/Classroom/Modals/AddClassroomModal";
import ClassroomListCard from "../../components/Classroom/ClassroomListCard";
import Modal from "../../components/UI/Modal/Modal";
import PngLoader from "../../components/UI/Loader/PngLoader/PngLoader";
import FloatingLoader from "../../components/UI/Loader/FloatingLoader/FloatingLoader";
import { updateObject, checkValidity } from "../../shared/utility";

const createClassroom = asyncComponent(() => {
  return import("./Actions/CreateClassroom");
});

const ViewAndEditClassroom = asyncComponent(() => {
  return import("./Actions/ViewAndEditClassroom");
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
    border: "unset",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "unset",
      border: "2px solid"
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
    justifyContent: "space-between",
    flexWrap : "wrap",
    margin: theme.spacing(1, 1)
  },
  classroomFilters: {
    display: "flex",
    alignSelf: "center",
    margin: theme.spacing(0, 1)
  },
  classroomFiltersContainer: {
    margin: theme.spacing(1, 1)
  },
  classroomFiltersInputs: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  statusSelect: {
    width: "120px"
  },
  classroomCard: {
    display: "flex",
    justifyContent: "space-between"
  },
  classroomNameAndDetails: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center"
  },
  nameAndDetails: {
    textTransform: "capitalize"
  },
  infiniteLoaderContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  }
}));

const ClassroomController = props => {
  const classes = useStyles();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const {
    location,
    role,
    userId,
    loading,
    getAllMyClassrooms,
    classrooms,
    fetchClassrooms,
    addClassroom,
    deleteClassroom,
    restoreClassroom,
    activeClassroom
  } = props;

  //Checks if DOM is ready to un mount loading icon
  const [domReady, setDomReady] = useState(false);
  const [navRoute, setNavRoute] = useState("classrooms");
  const [openAddClassModal, setopenAddClassModal] = useState(false);
  const [selectState, setselectState] = useState({
    status: "all",
    time: "none"
  });
  const [filterToggle, setfilterToggle] = useState(false);
  const [classroomPage, setclassroomPage] = useState(1);
  const [ininiteLoader, setinfiniteLoader] = useState(false);
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

  /* Use efect handles local component routing */
  useEffect(() => {
    const parsedPath = location.pathname.replace("/", "").split("/");
    const paramsPath = location.pathname.replace("/", "");
    let payload = navRoute;
    if (location.state) {
      payload = `${location.state.overwriteLocalNavState}`;
    } else if (location.pathname.includes(":")) {
      payload = `${paramsPath}`;
    } else if (
      (location.pathname.includes("edit") ||
        location.pathname.includes("view")) &&
      !location.pathname.includes(":")
    ) {
      payload = "classrooms";
    } else if (parsedPath.length > 1) {
      payload = `classrooms/${parsedPath[1]}`;
    }
    setNavRoute(payload);
  }, [navRoute, location]);

  /* Incharge of loading infinite loading loader and message */
  useEffect(() => {
    if (loading) {
      setinfiniteLoader(true);
    } else {
      setinfiniteLoader(false);
    }
  }, [loading]);

  /* Incharge of attaching scroll event to scroll screen */
  useEffect(() => {
    /* Incharge of loading more classrooms and showing loader */
    const handleScroll = e => {
      const bottom =
        e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
      if (bottom) {
        if (classrooms.lastPage !== classroomPage) {
          let classroomPageCopy = classroomPage;
          setclassroomPage(classroomPageCopy + 1);
          console.log("loading");
          getAllMyClassrooms({
            role: role,
            uid: userId,
            page: classroomPage
          });
          setinfiniteLoader(true);
        } else {
          setinfiniteLoader(false);
        }
      }
    };

    //Attaches event listener
    if (location.pathname === "/classrooms") {
      // content is the Id of the main container
      document
        .getElementById("content")
        .addEventListener("scroll", handleScroll);
    }
    //Detaches event listener
    return () => {
      document
        .getElementById("content")
        .removeEventListener("scroll", handleScroll);
    };
    /* MISSING DEP: 'getAllMyClassrooms', 'role', and 'userId' */
    //eslint-disable-next-line
  }, [location, classrooms, classroomPage]);

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

  /* Use efect handles async loading for loader */
  // Fetches new course on load and gets the firebase classrooms loaded only once
  useEffect(() => {
    if (isLoaded(clients, teachers, students)) {
      async function getMyClassrooms() {
        await getAllMyClassrooms({
          role: role,
          uid: userId,
          page: classroomPage
        });
      }
      getMyClassrooms()
        .then(res => {
          setDomReady(true);
        })
        .catch(err => {
          console.log("err", err);
        });
    }
    /* MISSING DEP: getAllMyClassrooms, role, userId, firebaseClassrooms */
    // eslint-disable-next-line
  }, [clients, teachers, students]);

  const handleNavChange = (event, newValue) => {
    event.preventDefault();
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
    addClassroom(payload);
  };

  const handleDelete = classroomId => {
    deleteClassroom(classroomId);
  };

  const handleRestore = classroomId => {
    restoreClassroom(classroomId);
  };

  const handleselectState = (event, control) => {
    setselectState({ ...selectState, [control]: event.target.value });
    getAllMyClassrooms({
      role: role,
      uid: userId,
      page: classroomPage,
      filter: { ...selectState, [control]: event.target.value }
    });
  };

  const handleFilterToggle = () => {
    let copy = filterToggle;
    setfilterToggle(!copy);
  };

  /* Incharge of displaying classroom list */
  const classroomsToMap = classroomsArray => {
    return classroomsArray.map(classroom => {
      //Checks if classroom is active in firebase
      let isClassroomActive;
      if (role.includes("admin")) {
        isClassroomActive = classroom.active_classroom;
      } else {
        isClassroomActive = activeClassroom.find(fbClassroom => {
          if (fbClassroom.id === Number(classroom.id)) {
            return classroom.active_classroom;
          }
          return false;
        });
      }
      //Variables to search in data from FB
      let classroomTeacher, classroomInstitution;
      //Finds classroom teacher
      classroomTeacher = teachers.find(
        teacher => teacher.id === classroom.teacher_id
      );
      //Finds classroom institution
      classroomInstitution = clients.find(
        institution => institution.id === classroom.client_id
      );

      return (
        <ClassroomListCard
          classroom={classroom}
          role={role}
          activeClassroom={isClassroomActive}
          classroomTeacher={classroomTeacher}
          classroomInstitution={classroomInstitution}
          prefersDarkMode={prefersDarkMode}
          key={classroom.code_classroom}
          isMobile={isMobile}
          handleNavChange={handleNavChange}
          handleDelete={handleDelete}
          handleRestore={handleRestore}
        />
      );
    });
  };

  /* Define new routes in routes array with their url and corresponding component */
  let routes, redirect;
  const routesArray = [
    { url: "create", comp: createClassroom, availableTo: ["teacher"] },
    {
      url: "view/:id",
      comp: ViewAndEditClassroom,
      availableTo: ["student", "admin", "super-admin"]
    },
    { url: "edit/:id", comp: ViewAndEditClassroom, availableTo: ["teacher"] }
  ];

  /* Conditional routes section */
  redirect = <Redirect to={`/${navRoute}`} />;

  //Available routes or Guarded routes
  routes = (
    <Switch>
      {routesArray.map((route, index) => {
        if (route.availableTo.includes(role)) {
          return (
            <Route
              path={`/classrooms/${route.url}`}
              key={`/classrooms/${route.url}`}
              component={route.comp}
            />
          );
        } else {
          return null;
        }
      })}
    </Switch>
  );

  const filterToggleButton = (
    <div className={classes.classroomFilters}>
      <Button
        variant="outlined"
        onClick={handleFilterToggle}
        size="small"
        style={!role.includes("admin") ? { width: "100%" } : null}
      >
        <Icon style={{ marginRight: "5px" }}>
          <FilterListOutlinedIcon />
        </Icon>
        <Typography>Filters</Typography>
      </Button>
    </div>
  );

  const filterCollapsable = (
    <Collapse in={filterToggle}>
      <div className={classes.classroomFiltersInputs}>
        <TextField
          className={classes.statusSelect}
          label="By Status"
          placeholder="Active"
          type="text"
          margin="normal"
          variant="outlined"
          value={selectState.status}
          onChange={event => {
            handleselectState(event, "status");
          }}
          select
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
        <TextField
          className={classes.statusSelect}
          label="By Time"
          placeholder="Created (Newest)"
          type="text"
          margin="normal"
          variant="outlined"
          value={selectState.time}
          onChange={event => {
            handleselectState(event, "time");
          }}
          select
        >
          <MenuItem value="none">none</MenuItem>
          <MenuItem value="createdNew">created (newest)</MenuItem>
          <MenuItem value="createdOld">created (oldest)</MenuItem>
          <MenuItem value="updatedNew">updated (newest)</MenuItem>
          <MenuItem value="updatedOld">updated (oldest)</MenuItem>
        </TextField>
      </div>
    </Collapse>
  );
  const filtersContainer = (
    <div className={classes.classroomFiltersContainer}>
      {!role.includes("admin") ? filterToggleButton : null}
      {filterCollapsable}
    </div>
  );

  const managerCard = (
    <Paper
      className={classes.paper}
      style={prefersDarkMode ? { border: "unset" } : null}
    >
      <div className={classes.classroomListHeaderContainer}>
        <div className={classes.classroomListHeader}>
          <Icon style={{ marginRight: "5px" }}>
            <ListOutlinedIcon />
          </Icon>
          <Typography>Classroom List</Typography>
        </div>
        {role === "student" ? (
          <Tooltip title="Add Classroom">
            <IconButton onClick={handleAddClassStudent}>
              <AddCircleOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        ) : role === "teacher" ? (
          <Tooltip title="Create Classroom">
            <IconButton
              onClick={event => {
                handleNavChange(event, "classrooms/create");
              }}
            >
              <AddCircleOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        ) : role.includes("admin") ? (
          filterToggleButton
        ) : null}
      </div>
      {!role.includes("admin") ? (
        <React.Fragment>
          <Divider />
          {filtersContainer}
        </React.Fragment>
      ) : filterCollapsable}
    </Paper>
  );

  const modalContainer = (
    <Modal openModal={openAddClassModal} closeModal={handleAddClassStudent}>
      <AddClassroomModal
        addClassroomForm={addClassroomForm}
        addClassroomFormChanged={addClassroomInputHandler}
        submitHandler={addClassroomHandler}
      />
    </Modal>
  );

  if (isLoaded(clients, teachers, students) && domReady && fetchClassrooms) {
    return location.pathname === "/classrooms" ? (
      <Container maxWidth="md" className={classes.container}>
        {loading ? <FloatingLoader></FloatingLoader> : null}
        {modalContainer}
        {redirect}
        {managerCard}
        {classroomsToMap(classrooms.data)}
        {classrooms.page === classrooms.lastPage ? null : ininiteLoader ? (
          <div className={classes.infiniteLoaderContainer}>
            <div style={{ display: "flex" }}>
              <PngLoader />
            </div>
            <Typography variant="caption">Fetching Classrooms</Typography>
          </div>
        ) : (
          <Typography style={{ textAlign: "center", margin: "16px 0px" }}>
            Nothing else to show
          </Typography>
        )}
      </Container>
    ) : (
      <React.Fragment>
        {redirect}
        {routes}
      </React.Fragment>
    );
  } else {
    return (
      <div style={{ alignSelf: "center" }}>
        <Loader />
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    role: state.firebase.profile.role,
    loading: state.classrooms.loading,
    userId: state.firebase.auth.uid,
    classrooms: state.classrooms.classrooms,
    fetchClassrooms: state.classrooms.classrooms != null,
    activeClassroom: state.firebase.profile.classrooms
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addClassroom: payload => dispatch(actions.addClassroom(payload)),
    getAllMyClassrooms: payload =>
      dispatch(actions.getAllMyClassrooms(payload)),
    deleteClassroom: payload => dispatch(actions.deleteClassroom(payload)),
    restoreClassroom: payload => dispatch(actions.restoreClassroom(payload))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClassroomController)
);
