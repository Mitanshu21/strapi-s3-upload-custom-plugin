import React, { useState, useRef, useEffect } from "react";
import { Button } from "@strapi/design-system/Button";
import { TextInput } from "@strapi/design-system/TextInput";
import Alert from "../Alert";
import axios from "axios";

const getAuthToken = () => {
  let token = sessionStorage.getItem("jwtToken");

  if (token) {
    token = token.replace(/"/g, "");
  }

  return token;
};

const CustomUploadForm = ({
  fileData,
  onSubmit,
  onCancel,
  alertMessage = null,
  setAlertMessage = () => {},
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([{ key: "", value: "" }]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (fileData) {
      setTags(JSON.parse(fileData.tags) || [{ key: "", value: "" }]);
      setPreview(fileData.url || null);
    } else {
      setFile(null);
      setPreview(null);
      setTags([{ key: "", value: "" }]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [fileData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !fileData.url) return;
    const formData = new FormData();
    if (file) {
      formData.append("files", file);
    }
    formData.append("tags", JSON.stringify(tags));

    setIsLoading(true);
    try {
      const token = getAuthToken();

      let response;
      if (fileData) {
        formData.append("key", fileData.hash + fileData.ext);
        response = await axios.post(
          `http://localhost:1337/api/update-custom?id=${fileData.id}`,
          formData,
          {
            method: "POST",
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:1337/api/upload-custom",
          formData,
          {
            method: "POST",
          }
        );
      }

      // Clear the form fields on successful submission
      setFile(null);
      setPreview(null);
      setTags([{ key: "", value: "" }]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      console.log("not reacingd");

      setAlertMessage({
        title: "success",
        message: fileData ? "file update" : "uploaded",
        variant: "success",
      });

      if (fileData) onSubmit();
    } catch (error) {
      setAlertMessage({
        title: error.response.data.error.name || "Error",
        message: error.response.data.error.message || "something went wrong",
        variant: "danger",
      });
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setTags([{ key: "", value: "" }]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleTagChange = (index, type, value) => {
    const newTags = [...tags];
    newTags[index][type] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, { key: "", value: "" }]);
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          padding: "40px",
        }}
      >
        <div style={{ flex: 1 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              {!fileData && (
                <input
                  type="file"
                  name="files"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              )}
            </div>
            <div>
              {tags.map((tag, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    alignItems: "flex-end",
                    gap: "6px",
                  }}
                >
                  <TextInput
                    name={`tags[${index}][key]`}
                    label="Key"
                    value={tag.key}
                    onChange={(e) =>
                      handleTagChange(index, "key", e.target.value)
                    }
                    style={{ marginRight: "10px" }}
                  />
                  <TextInput
                    name={`tags[${index}][value]`}
                    label="Value"
                    value={tag.value}
                    disabled={!tag.key}
                    onChange={(e) =>
                      handleTagChange(index, "value", e.target.value)
                    }
                    style={{ marginRight: "10px" }}
                  />
                  <Button type="button" onClick={() => removeTag(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={addTag}
                style={{ marginBottom: "20px" }}
              >
                Add More
              </Button>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <Button type="submit" loading={isLoading}>
                {fileData ? "Update" : "Upload"}
              </Button>
              <Button
                variant="tertiary"
                onClick={() => (fileData ? onCancel() : handleReset())}
              >
                {fileData ? "Cancel" : "Reset"}
              </Button>
            </div>
          </form>
        </div>
        <div
          style={{
            padding: "20px 0",
          }}
        >
          <div
            style={{
              height: "400px",
              width: "400px",
              border: "1px solid lightgray",
              padding: "20px 0",
            }}
          >
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{ objectFit: "contain" }}
                width="100%"
                height="100%"
              />
            )}
          </div>
        </div>
      </div>
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

export default CustomUploadForm;
