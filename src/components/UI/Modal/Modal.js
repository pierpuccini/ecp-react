/* React Imports */
import React from 'react'
/* Material UI Imports */
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0,
    borderRadius: "10px"
  },
}));


/**
 * @param {*} openModal: Incharge of opening the modal
 * @param {*} closeModal: Incharge of closing the modal MUST create a Fn.
 * @param {*} children: custom child to display
 * @returns
 */
const AddClassroomModal = (props) => {
    const classes = useStyles();
    const { openModal, closeModal, children } = props

    return (
      <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={openModal}
      onClose={closeModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <div className={classes.paper}>
          {children}
        </div>
      </Fade>
    </Modal>
    )
}

export default AddClassroomModal
