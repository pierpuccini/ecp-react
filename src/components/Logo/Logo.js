import React from 'react';

import coinLogo from '../../assets/images/coin-logo.png';
import classes from './Logo.module.scss';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={coinLogo}/>
    </div>
);

export default logo;