//React Imports
import React from 'react'
//App Imports
import classes from './Auth.module.scss'
import Logo from '../../components/Logo/Logo'
import Input from '../../components/UI/Input/Input'
import { updateObject, checkValidity } from "../../shared/utility";

const Auth = () => {
    const [values, setValues] = React.useState({
        controls: {
            email: {
              elementType: "input",
              elementConfig: {
                type: "email",
                label: "Email",
                placeholder: 'Enter Your Email',
                variant: "outlined"
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
                placeholder: 'Enter Your Password',
                variant: "outlined"
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

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(values.controls, {
          [controlName]: updateObject(values.controls[controlName], {
            value: event.target.value,
            valid: checkValidity(
              event.target.value,
              values.controls[controlName].validation
            ),
            touched: true
          })
        });
        this.setValues({...values, controls: updatedControls });
      };
      const formElementsArray = [];
      // eslint-disable-next-line
      for (let key in values.controls) {
        formElementsArray.push({
          id: key,
          config: values.controls[key]
        });
      }
      let form = formElementsArray.map(formElement => (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed={event => inputChangedHandler(event, formElement.id)}
        />
      ));

    return (
        <div className={classes.Auth}>
            <strong>
                Welcome
            </strong>
            <Logo height="85px" />
            <form>
            {form}
          </form>
        </div>
    )
}

export default Auth
