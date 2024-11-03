"use client";

import React, { useState, useEffect } from "react";
import { Input, Select, Upload, Button, notification, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { postNewStar, searchStarname } from "@/app/lib/features/starSlice";

const { Dragger } = Upload;

const CreateStar = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    starname: "",
    aliases: [],
    birthname: "",
    starprofile: null,
    starcover: null,
  });
  const [inputStatus, setInputStatus] = useState({
    starname: "default", // could be 'default', 'error', 'success', 'exists'
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialLoad, setInitialLoad] = useState(true); // Track the initial load

  const searchResults = useSelector((state) => state.starsData.searchResults);

  useEffect(() => {
    if (formData.starname) {
      dispatch(searchStarname(formData.starname));
    }
  }, [formData.starname, dispatch]);

  useEffect(() => {
    if (formData.starname && searchResults.length > 0) {
      const exists = searchResults.some(
        (star) => star.starname.toLowerCase() === formData.starname.toLowerCase()
      );
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        starname: exists ? "exists" : "success",
      }));
      setErrorMessage(exists ? "Star already exists" : "");
    } else {
      setInputStatus((prevStatus) => ({
        ...prevStatus,
        starname: "default",
      }));
      setErrorMessage("");
    }
  }, [searchResults, formData.starname]);

  useEffect(() => {
    setInitialLoad(false); // Set initialLoad to false after the first render
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "starname" && !value) {
      setInputStatus((prevStatus) => ({ ...prevStatus, starname: "error" }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, aliases: value });
  };

  const handleFileChange = (info, field) => {
    if (info.file.status === "done") {
      setFormData({ ...formData, [field]: info.file.originFileObj });
    }
  };

  const handleSubmit = async () => {
    if (!formData.starname) {
      setInputStatus((prevStatus) => ({ ...prevStatus, starname: "error" }));
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("starname", formData.starname);
    formDataToSubmit.append("aliases", formData.aliases);
    formDataToSubmit.append("birthname", formData.birthname);
    formDataToSubmit.append("starprofile", formData.starprofile);
    formDataToSubmit.append("starcover", formData.starcover);

    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      await dispatch(postNewStar(formDataToSubmit)).unwrap();
      notification.success({
        message: "Success",
        description: "Star created successfully!",
        duration: 3,
      });
      setInputStatus((prevStatus) => ({ ...prevStatus, starname: "success" }));
    } catch (error) {
      if (error.status === 409) {
        setInputStatus((prevStatus) => ({ ...prevStatus, starname: "exists" }));
        setErrorMessage("Star already exists");
      } else {
        notification.error({
          message: "Error",
          description: "Failed to create star. Please try again.",
          duration: 3,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Define color for different input status
  const getBorderColor = (status) => {
    switch (status) {
      case "error":
        return "1px solid red";
      case "success":
        return "1px solid blue";
      case "exists":
        return "1px solid yellow";
      default:
        return "1px solid #d9d9d9"; // default border color
    }
  };

  if (initialLoad) {
    return <Spin size="large" />; // Show a loading spinner while initial load
  }

  return (
    <div>
      <h1>Create Star</h1>
      <Input
        placeholder="Star Name"
        name="starname"
        value={formData.starname}
        onChange={handleInputChange}
        required
        style={{ border: getBorderColor(inputStatus.starname) }}
      />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <label htmlFor="staraliases">Star Aliases:</label>
      <Select
        mode="tags"
        style={{ width: "100%" }}
        onChange={handleSelectChange}
        tokenSeparators={[","]}
      />
      <label htmlFor="starbirthname">Star Birthname:</label>
      <Input
        placeholder="Star Birthname"
        name="birthname"
        value={formData.birthname}
        onChange={handleInputChange}
      />
      <label htmlFor="starcover">Star Cover:</label>
      <Dragger onChange={(info) => handleFileChange(info, "starcover")}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag cover image to upload</p>
      </Dragger>
      <label htmlFor="starprofile">Star Profile:</label>
      <Dragger onChange={(info) => handleFileChange(info, "starprofile")}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag profile image to upload</p>
      </Dragger>
      <Button type="primary" onClick={handleSubmit} loading={loading}>
        {loading ? "Creating..." : "Create Star"}
      </Button>
    </div>
  );
};

export default CreateStar;