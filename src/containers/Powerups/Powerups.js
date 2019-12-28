/* React Imports */
import React from 'react'
import { withRouter, useParams } from "react-router-dom";

const Powerups = () => {
    let { type } = useParams();
    console.log('type',type)
    return (
        <div>
            {type}
        </div>
    )
}

export default withRouter(Powerups)
