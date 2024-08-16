import React, { useState } from "react";
import CustomUploadForm from "../../components/CustomUploadForm";
import Alert from "../../components/Alert";

const UploadCustomPage = () => {
  const [alertMessage, setAlertMessage] = useState(null);

  return (
    <>
      <CustomUploadForm
        alertMessage={alertMessage}
        setAlertMessage={setAlertMessage}
      />
      {alertMessage && (
        <Alert
          title={alertMessage.title}
          message={alertMessage.message}
          variant={alertMessage.variant}
          closeAlert={() => setAlertMessage(null)}
        />
      )}
    </>
  );
};

export default UploadCustomPage;
