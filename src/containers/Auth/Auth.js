//React Imports
import React from 'react'

//App Imports
// import classes from './Auth.module.scss'
import Logo from '../../components/Logo/Logo'
import Input from '../../components/UI/Input/Input'

const Auth = () => {
    const [values, setValues] = React.useState({
        controls: {
            email: {
              elementType: "input",
              elementConfig: {
                type: "email",
                label: "Email",
                placeholder: 'Enter Your Email'
              },
              value: "",
              validation: {
                required: true,
                isEmail: true
              },
              valid: false,
              touched: false
            },
            password: {
              elementType: "input",
              elementConfig: {
                type: "password",
                label: "Password",
                placeholder: 'Enter Your Password'
              },
              value: "",
              validation: {
                required: true,
                minLength: 6
              },
              valid: false,
              touched: false
            }
          },
          isSignUp: true
    })
    return (
        <div>
            <strong>
                Welcome
            </strong>
            <Logo height="85px" />
        </div>
    )
}

export default Auth
