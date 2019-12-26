/* React imports */
import React from "react";
/* App imports */
import CodeCopy from "../../../components/UI/SpecialFields/CodeCopy";

const CreatedClassroomModal = props => {
  const { registrationCode, missingFields } = props;
  return (
    <div>
      <h2>Classroom created succesfully!</h2>
      <p>Share the following code to register students</p>
      <CodeCopy value={registrationCode} />
      {!missingFields.noMissingFields ? (
        <React.Fragment>
          <h4>To activate a classroom, fill the following fields:</h4>
          <ul>
            {Object.keys(missingFields).map(field => {
              return missingFields[field] ? <li key={field}>{field}</li> : null;
            })}
          </ul>
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default CreatedClassroomModal;
