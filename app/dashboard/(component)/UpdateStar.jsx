"use client";

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { Input, Select, Upload, Button, message, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateStar, getStarById, getStarNamesSelect } from '@/app/lib/features/starSlice';
import debounce from 'lodash/debounce';
import ImageCropper from './ImageCropper';

const { Dragger } = Upload;

const UpdateStar = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    starId: '',
    starname: '',
    aliases: [],
    birthname: '',
    starprofile: null,
    starcover: null,
  });
  const [loading, setLoading] = useState(false);
  const [isCoverCropperVisible, setIsCoverCropperVisible] = useState(false);
  const [isProfileCropperVisible, setIsProfileCropperVisible] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropField, setCropField] = useState(null);

  const selectStar = useSelector((state) => state.starsData.selectStar);
  const starDetails = useSelector((state) => state.starsData.singleStar);

  useEffect(() => {
    if (starDetails) {
      console.log("Pre-filling form data with fetched star details:", starDetails);
      setFormData({
        ...formData,
        starname: starDetails.starname,
        aliases: starDetails.aliases,
        birthname: starDetails.birthname,
        starprofile: null,
        starcover: null,
      });
    }
  }, [starDetails]);

  const handleInputChange = (e) => {
    console.log("Changing input:", e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value) => {
    console.log("Updating aliases:", value);
    setFormData({ ...formData, aliases: value });
  };

  const handleStarSelect = (value) => {
    console.log("Star selected with ID:", value);
    setFormData({ ...formData, starId: value });
    dispatch(getStarById(value));
  };

  const handleFileClick = (field) => {
    console.log(`File input clicked for ${field}`);
    setCropField(field);
  };

  const handleFileChange = (info, field) => {
    console.log("File selected for cropping:", info.file.originFileObj);
    if (info.file.originFileObj) {
      setCropImage(URL.createObjectURL(info.file.originFileObj));
      setCropField(field);
      field === 'starcover'
        ? setIsCoverCropperVisible(true)
        : setIsProfileCropperVisible(true);
    }
  };

  const handleCrop = (croppedImage) => {
    console.log("Cropped image for field:", cropField, croppedImage);
    setFormData({ ...formData, [cropField]: croppedImage });
    setIsCoverCropperVisible(false);
    setIsProfileCropperVisible(false);
  };

  const handleSubmit = async () => {
    console.log("Preparing form data for submission...");
    const formDataToSubmit = new FormData();

    formDataToSubmit.append('starname', formData.starname);
    formDataToSubmit.append('aliases', formData.aliases);
    formDataToSubmit.append('birthname', formData.birthname);

    const imageToBlob = async (imageUrl) => {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return blob;
    };

    if (formData.starprofile) {
      console.log("Adding profile image...");
      const profileBlob = await imageToBlob(formData.starprofile);
      formDataToSubmit.append('starprofile', profileBlob, 'profile.jpg');
    }

    if (formData.starcover) {
      console.log("Adding cover image...");
      const coverBlob = await imageToBlob(formData.starcover);
      formDataToSubmit.append('starcover', coverBlob, 'cover.jpg');
    }

    dispatch(updateStar({ starId: formData.starId, starData: formDataToSubmit }))
      .then((response) => {
        console.log('Success:', response);
        message.success('Star updated successfully!', 3);
      })
      .catch((error) => {
        console.error('Error:', error);
        message.error('Failed to update star. Please try again.', 3);
      });
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value) {
        console.log("Searching for stars with query:", value);
        setLoading(true);
        dispatch(getStarNamesSelect(value)).finally(() => setLoading(false));
      }
    }, 300),
    [dispatch]
  );

  const handleSearch = (value) => {
    debouncedSearch(value);
  };

  return (
    <Suspense fallback={<Spin size="large" />}>
      <div>
        <h1>Update Star</h1>
        <label>Select Star:</label>
        <Select
          showSearch
          value={formData.starId}
          placeholder="Select a star"
          style={{ width: '100%' }}
          onSearch={handleSearch}
          onChange={handleStarSelect}
          allowClear
          loading={loading}
          options={Array.isArray(selectStar.data) 
            ? selectStar.data.map((star) => ({ label: star.starname, value: star._id }))
            : []
          }
          notFoundContent={loading ? <Spin size="small" /> : "No stars found"}
        />
        <label>Star Name:</label>
        <Input
          placeholder="Star Name"
          name="starname"
          value={formData.starname}
          onChange={handleInputChange}
          required
        />
        <label>Star Aliases:</label>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          value={formData.aliases}
          onChange={handleSelectChange}
          tokenSeparators={[',']}
          className="capitalize"
        />
        <label>Star Birthname:</label>
        <Input
          placeholder="Star Birthname"
          name="birthname"
          value={formData.birthname}
          onChange={handleInputChange}
        />
        <label>Star Cover:</label>
        <Dragger
          onClick={() => handleFileClick('starcover')}
          onChange={(info) => handleFileChange(info, 'starcover')}
          maxCount={1}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag cover image to upload</p>
        </Dragger>
        <label>Star Profile:</label>
        <Dragger
          onClick={() => handleFileClick('starprofile')}
          onChange={(info) => handleFileChange(info, 'starprofile')}
          maxCount={1}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag profile image to upload</p>
        </Dragger>
        <Button type="primary" onClick={handleSubmit}>
          Update Star
        </Button>
        <ImageCropper
          visible={isCoverCropperVisible}
          image={cropImage}
          onCancel={() => setIsCoverCropperVisible(false)}
          onCrop={handleCrop}
          aspectRatio={16 / 9} // Aspect ratio for cover image
        />
        <ImageCropper
          visible={isProfileCropperVisible}
          image={cropImage}
          onCancel={() => setIsProfileCropperVisible(false)}
          onCrop={handleCrop}
          aspectRatio={2 / 3} // Aspect ratio for profile image
        />
      </div>
    </Suspense>
  );
};

export default UpdateStar;
