// src/admin/src/containers/EditView/index.js
import React from "react";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import CustomFileField from "../../components/CustomFileField";

const EditView = () => {
  const { layout } = useCMEditViewDataManager();

  return (
    // Render your component where you want it within your form
    <CustomFileField />
  );
};

export default EditView;
