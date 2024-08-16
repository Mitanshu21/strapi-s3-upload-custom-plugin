import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Flex } from "@strapi/design-system";
import CustomUploadForm from "../CustomUploadForm";
import CustomPagination from "../PaginationComponent";
import { Trash, Pencil } from "@strapi/icons";
import DeleteConfirmationDialog from "../DeleteConfirmationModal";
import { useHistory } from "react-router-dom";
import pluginId from "../../pluginId";
import Alert from "../Alert";

const getAuthToken = () => {
  let token = sessionStorage.getItem("jwtToken");

  if (token) {
    token = token.replace(/"/g, "");
  }

  return token;
};

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({});
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const history = useHistory();

  const fetchData = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `http://localhost:1337/upload/files?page=${currentPage}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFiles(response.data.results);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [pageSize, currentPage]);

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleAddFile = () => {
    // setSelectedFile(null);
    history.push(`/plugins/${pluginId}/custom-link-1`);
  };

  const onsubmit = () => {
    setSelectedFile(null);
    fetchData();
  };
  const onCancel = () => {
    setSelectedFile(null);
    fetchData();
  };

  const handleDeletefile = async () => {
    if (!fileToDelete) return;

    const token = getAuthToken();

    setIsDeleting(true);
    const formData = {
      fileIds: [fileToDelete],
    };

    try {
      const response = await axios.post(
        `http://localhost:1337/upload/actions/bulk-delete`,
        formData,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFileToDelete(null);
      setSelectedFile(null);
      fetchData();
      setIsDeleting(false);
      setAlertMessage({
        title: "success",
        message: "file deleted",
        variant: "success",
      });
    } catch (error) {
      setAlertMessage({
        title: error.response.data.error.name || "Error",
        message: error.response.data.error.message || "something went wrong",
        variant: "danger",
      });
    }
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <div style={{ padding: "20px" }}>
          <div style={{ padding: "20px 0" }}>
            <Button onClick={handleAddFile}>Add File</Button>
          </div>

          <div
            style={{
              padding: "15px 0",
              color: "white",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            <span>Assets {pagination.total}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: selectedFile
                    ? "auto auto auto"
                    : "auto auto auto auto auto",
                  gap: "20px",
                }}
              >
                {files.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: "pointer",
                      height: "250px",
                      display: "flex",
                      gap: "15px",
                      width: "250px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        display: "flex",
                        gap: "8px",
                        padding: "3px",
                      }}
                    >
                      <div
                        style={{
                          cursor: "pointer",
                          background: "#4a4a6a",
                          borderRadius: "5px",
                          padding: "8px",
                          border: "1px solid gray",
                        }}
                        onClick={() => setFileToDelete(file.id)}
                      >
                        <Trash fill="danger700" />
                      </div>
                      <div
                        style={{
                          cursor: "pointer",
                          background: "#4a4a6a",
                          borderRadius: "5px",
                          padding: "8px",
                          border: "1px solid gray",
                        }}
                        onClick={() => handleFileClick(file)}
                      >
                        <Pencil fill="neutral900" />
                      </div>
                    </div>
                    <img
                      src={file.url}
                      alt={file.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                ))}
              </div>
              <CustomPagination
                page={pagination.page}
                total={pagination.total}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </div>
            <div>
              {selectedFile && (
                <CustomUploadForm
                  fileData={selectedFile}
                  alertMessage={alertMessage}
                  setAlertMessage={setAlertMessage}
                  onSubmit={onsubmit}
                  onCancel={onCancel}
                />
              )}
            </div>
          </div>
        </div>

        {fileToDelete && (
          <DeleteConfirmationDialog
            isOpen={!!fileToDelete}
            onClose={() => setFileToDelete(null)}
            onConfirm={handleDeletefile}
            isDeleting={isDeleting}
          />
        )}
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

export default FileList;
