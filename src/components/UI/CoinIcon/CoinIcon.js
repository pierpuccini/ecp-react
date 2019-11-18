//React Impors
import React from "react";
//Material UI
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
//App icons
import coinIcon from "../../../assets/images/coin-logo.png";

const useStyles = makeStyles(theme => ({
  imageIcon: {
    height: "100%"
  },
  iconRootCoin: {
    textAlign: "center",
    "font-size": "unset"
  }
}));

const CoinIcon = (props) => {
  const classes = useStyles();

  return (
    <Icon classes={{ root: classes.iconRootCoin }} style={{width: props.width, height: props.height}}>
      <img className={classes.imageIcon} src={coinIcon} alt="coin icon" />
    </Icon>
  );
};

export default CoinIcon;
