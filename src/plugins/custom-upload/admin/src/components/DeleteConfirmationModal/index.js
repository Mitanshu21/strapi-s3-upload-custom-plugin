import React from "react";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@strapi/design-system";
import { Dialog } from "@strapi/design-system";
import CustomUploadForm from "../CustomUploadForm";

// Ensure correct prop-types are used
const FileUploadModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <ModalBody>
        <span style={{ color: "white", fontWeight: "bold" }}>
          Are you sure you want to delete this?
        </span>
      </ModalBody>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "10px 20px",
            maxWidth: "300px",
          }}
        >
          <Button fullWidth variant="tertiary" onClick={() => onClose()}>
            Cancel
          </Button>

          <Button
            fullWidth
            variant="danger-light"
            onClick={() => onConfirm()}
            loading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default FileUploadModal;
