/* React imports */
import React from 'react'
import { withRouter, useParams } from "react-router-dom";

const ViewClassroom = () => {
    let { id } = useParams();
    console.log('id',id)
    return (
        <div>
            view classrom
        </div>
    )
}

export default withRouter(ViewClassroom)
