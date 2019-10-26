import React from 'react'
import Loader from '../PngLoader/PngLoader'
import classes from './FloatingLoader.module.scss'

const FloatingLoader = (props) => {
    return (
        <div className={classes.content}>
        <div className={classes.overlay}><div className={classes.overlayContent}><Loader/></div></div>
            {props.children}
        </div>
    )
}

export default FloatingLoader
