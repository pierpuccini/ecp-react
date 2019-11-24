export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const checkValidity = (value, rules) => {
  let isValid = true;
  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
  }

  if (rules.isName) {
    const pattern = /(\w.+\s+\w.).+/i;
    isValid = pattern.test(value) && isValid;
  }

  return isValid;
};

export const stateToPayload = state => {
  let payload,
    formFieldsArr = [];
    //extracts the keys in order to be able to map the object
  Object.keys(state).forEach(formField => {
    formFieldsArr.push(formField);
  });
  //Returns false for untouched fields, else returns the value
  payload = formFieldsArr.map(formFields => {
    return {
      ...payload,
      [formFields]: state[formFields].touched
        ? state[formFields].value
        : state[formFields].touched
    };
  });
  return payload;
};
