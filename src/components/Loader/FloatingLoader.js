import React from 'react'
import loader from '../../assets/loaders/educoin(B).gif'
import classes from './FloatingLoader.module.scss'

const FloatingLoader = (props) => {
    return (
        <div className={classes.content}>
        <div className={classes.overlay}><div className={classes.overlayContent}><img src={loader} alt="Loading..."/></div></div>
            {props.children}
        </div>
    )
}

export default FloatingLoader
