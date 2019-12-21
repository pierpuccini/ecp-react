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
    formFieldsArr = [],
    payloadArr2Obj = {};
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
        : "no-touch"
    };
  });
  payload.forEach(fields => {
    // eslint-disable-next-line
    Object.keys(fields).map(field => {
      payloadArr2Obj = { ...payloadArr2Obj, [field]: fields[field] };
    });
  });
  payload = payloadArr2Obj;
  return payload;
};

/**
 *Date sorter
 *
 * @param {*} how new, old
 * @param {*} list array to sort
 * @param {*} listOrObjectParam specific parameter to search for in
 * @returns
 */
export const sortDates = (how, list, listOrObjectParam) => {
  let sortedList;
  if (how === "new") {
    sortedList = list.sort((a, b) => {
      return new Date(b[listOrObjectParam]) - new Date(a[listOrObjectParam]);
    });
  } else {
    sortedList = list.sort((a, b) => {
      return new Date(a[listOrObjectParam]) - new Date(b[listOrObjectParam]);
    });
  }
  return sortedList;
};

/**
 * Transforms user ID's to readable names
 *
 * @param {*} usersArray array of user ids from back end
 * @param {*} fbUsers array of users from firebase
 * @param {*} teacher true if evaluating teachers
 * @returns array of user names and id for processing
 */
export const userObjCreator = (usersArray, fbUsers, teacher) => {
  if (usersArray == null || usersArray.length === 0) {
    return [];
  }

  let usersObj = [];
  usersArray.forEach(userId => {
    const foundUser = fbUsers.find(user => user.id === userId);
    if (foundUser != null) {
      usersObj.push({ id: userId, name: foundUser.displayName });
    }
  });
  if (usersObj.length === 1 && teacher) {
    usersObj = usersObj[0];
  }
  return usersObj;
};
