/* React imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";
//Icons
/* App Imports */
import DynamicText from "../../UI/SpecialFields/DynamicText";
import CodyCopy from "../../UI/SpecialFields/CodeCopy";

const useStyles = makeStyles(theme => ({
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between"
  },
  sectionTitles: {
    display: "flex",
    margin: theme.spacing(1, 1)
  },
  sectionContent: {
    margin: theme.spacing(1, 1)
  },
  staticInfo: {
    textTransform: "capitalize",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  teacher: {
    display: "flex"
  }
}));

const ViewClassroomInfo = props => {
  const classes = useStyles();

  const { info, teacher } = props;

  return (
    <React.Fragment>
      <div className={classes.infoContainer}>
        <div className={classes.infoFieldsContainer}>
          <div className={classes.sectionContent}>
            <div className={classes.staticInfo}>
              <DynamicText
                text="teacher"
                dynamicText={teacher.name}
                orientation="horizantal"
                variantArray={["body1", "body1"]}
              />
              <DynamicText
                text="Classroom ID"
                dynamicText={info.subject_id}
                orientation="horizantal"
                variantArray={["body1", "body1"]}
              />
            </div>
            <CodyCopy
              value={info.code_classroom}
              label="Join Code"
              helper="Share code with classmates."
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ViewClassroomInfo;
