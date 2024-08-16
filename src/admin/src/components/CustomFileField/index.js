// src/admin/src/components/CustomFileField/index.js
import React from "react";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import { TextInput } from "@strapi/design-system/TextInput";

const CustomFileField = () => {
  const { modifiedData, onChange } = useCMEditViewDataManager();

  const handleChange = (e) => {
    onChange({ target: { name: e.target.name, value: e.target.value } });
  };

  return (
    <TextInput
      name="extraField"
      label="Extra Field"
      value={modifiedData.extraField || ""}
      onChange={handleChange}
    />
  );
};

export default CustomFileField;


