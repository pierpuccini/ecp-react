import React from "react";
import coinLogo from '../../../assets/images/coin-logo.png'
import classes from './PngLoader.module.scss'
import '../../../loading.css'
const PngLoader = () => {
  return (
    <div className="ld ld-breath" style={{animationDuration:"1.5s"}}>
        <div className={classes.Logo} style={{ height: "110px" }}>
          <img src={coinLogo} alt="" />
        </div>
    </div>
  );
};

export default PngLoader;
