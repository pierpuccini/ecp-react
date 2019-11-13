import React from 'react';

import errorLogo from '../../../assets/images/warning_light.png';
import classes from './ErrorLogo.module.scss';

const ErrorLogo = (props) => (
    <div className={classes.errorLogo} style={{height: props.height}}>
        <img src={errorLogo} alt=""/>
    </div>
);

export default ErrorLogo;