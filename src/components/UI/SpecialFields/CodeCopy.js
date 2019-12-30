//React Imports
import React, { useRef, useState } from "react";
//MaterialUI Imports
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  textContainer: {
    display: "flex",
    flexDirection: "column"
  },
  success: {
    color: "#38a23d"
  }
}));

const CodeCopy = props => {
  const matClasses = useStyles();
  const { value, label, helper} = props
  //Incharge of copying code to clipboard
  const [copySuccess, setCopySuccess] = useState("");
  const textAreaRef = useRef(null);

  const copyToClipboard = event => {
    textAreaRef.current.select();
    document.execCommand("copy");
    event.target.focus()
    setCopySuccess("Copied!");
  };

  return (
    <div className={matClasses.textContainer}>
      <TextField
        inputRef={textAreaRef}
        className={matClasses.textField}
        value={value}
        label={label}
        type="text"
        margin="normal"
        variant="outlined"
        helperText={helper}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment>
              <IconButton
                onClick={event => {
                  copyToClipboard(event);
                }}
              >
                <FileCopyOutlinedIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <div className={matClasses.success}>{copySuccess}</div>
    </div>
  );
};

export default CodeCopy;
