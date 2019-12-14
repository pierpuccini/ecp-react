/* React imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
//Icons
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import DynamicText from "../../UI/SpecialFields/DynamicText";
import CodyCopy from "../../UI/SpecialFields/CodeCopy";

const useStyles = makeStyles(theme => ({
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between"
  },
  formSubheader: {
    display: "flex"
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

  const { navActions, info, teacher } = props;

  return (
    <React.Fragment>
      <div className={classes.infoContainer}>
        <div className={classes.infoFieldsContainer}>
          <div className={classes.sectionTitles}>
            <InfoOutlinedIcon style={{ marginRight: "8px" }} />
            <Typography>Basic Info</Typography>
          </div>
          <Divider></Divider>
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
      <div className={classes.formSubheader}>
        <IconButton
          size="small"
          style={{ marginRight: "5px" }}
          onClick={() => {
            navActions();
          }}
        >
          <ArrowBackIosOutlinedIcon />
        </IconButton>
        <Typography style={{ alignSelf: "center" }}>
          Return to classroom List
        </Typography>
      </div>
    </React.Fragment>
  );
};

export default ViewClassroomInfo;
