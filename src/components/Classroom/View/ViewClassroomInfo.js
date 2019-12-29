/* React imports */
import React from "react";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
//Icons
import TimerOutlinedIcon from "@material-ui/icons/TimerOutlined";
/* App Imports */
import DynamicText from "../../UI/SpecialFields/DynamicText";
import CodyCopy from "../../UI/SpecialFields/CodeCopy";
import CoinIcon from "../../UI/CoinIcon/CoinIcon";

const useStyles = makeStyles(theme => ({
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between"
  },
  staticInfo: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  basicInfoContainer: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

const ViewClassroomInfo = props => {
  const classes = useStyles();

  const { info, teacher } = props;

  return (
    <React.Fragment>
      <div className={classes.infoContainer}>
        <div className={classes.basicInfoContainer}>
          <div className={classes.staticInfo}>
            <DynamicText
              style={{ marginBottom: "8px" }}
              text="Teacher"
              mainText={teacher.name}
              variantArray={["body1"]}
              type="subtext"
              capitalize
            />
            <DynamicText
              style={{ marginBottom: "8px" }}
              text="Classroom Name"
              mainText={info.subject_name}
              variantArray={["body1"]}
              type="subtext"
              capitalize
            />
            <DynamicText
              style={{ marginBottom: "8px" }}
              text="Challenge Duration"
              mainText={`${info.challenge_duration} min`}
              variantArray={["body1"]}
              type="subtext"
              icon={<TimerOutlinedIcon />}
            />
          </div>
          <div className={classes.staticInfo}>
            <DynamicText
              style={{ marginBottom: "8px" }}
              text="Classroom ID"
              mainText={info.subject_id}
              variantArray={["body1"]}
              type="subtext"
              capitalize
            />
            <DynamicText
              style={{ marginBottom: "8px" }}
              text="Group Size"
              mainText={info.group_size}
              variantArray={["body1"]}
              type="subtext"
              capitalize
            />
            <DynamicText
              style={{ marginBottom: "8px" }}
              text="Initial Coins"
              mainText={info.initial_coins}
              variantArray={["body1"]}
              type="subtext"
              icon={<CoinIcon width="24px" height="24px" />}
            />
          </div>
        </div>
        <CodyCopy
          value={info.code_classroom}
          label="Join Code"
          helper="Share code with classmates."
        />
      </div>
    </React.Fragment>
  );
};

export default ViewClassroomInfo;
