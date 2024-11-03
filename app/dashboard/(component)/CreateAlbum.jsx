"use client";
import React, { useState, useEffect } from 'react';
import { Input, Select, Upload, Button, Form, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { postNewAlbum } from '../../lib/features/albumSlice';
import { getStarNamesSelect } from '../../lib/features/starSlice'; // Import the action

const { Option } = Select;
const { Dragger } = Upload;

const CreateAlbum = () => {
  const dispatch = useDispatch();
  const [albumName, setAlbumName] = useState('');
  const [starName, setStarName] = useState([]);
  const [tags, setTags] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  // Get the star names from the Redux state
  const starNames = useSelector((state) => state.starsData.starNames || []);

  useEffect(() => {
    if (searchValue) {
      dispatch(getStarNamesSelect(searchValue));
    }
  }, [dispatch, searchValue]);

  const handleAlbumNameChange = (e) => {
    setAlbumName(e.target.value);
  };

  const handleStarNameChange = (value) => {
    setStarName(value);
  };

  const handleTagsChange = (value) => {
    setTags(value);
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSearchStarName = (value) => {
    setSearchValue(value);
  };

  const handleSubmit = async () => {
    if (!albumName || !starName.length || !fileList.length) {
      message.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append('albumname', albumName);
    formData.append('starname', starName.join(','));
    formData.append('tags', tags.join(','));
    fileList.forEach((file) => {
      formData.append('upload', file.originFileObj);
    });

    // Dispatch action to create a new album
    try {
      await dispatch(postNewAlbum(formData)).unwrap();
      message.success("Album created successfully!");
      // Reset form fields after successful submission
      setAlbumName('');
      setStarName([]);
      setTags([]);
      setFileList([]);
    } catch (error) {
      message.error("Failed to create album. Please try again.");
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Album Name" name="albumName" rules={[{ required: true, message: 'Please enter the album name' }]}>
        <Input
          placeholder="Enter album name"
          value={albumName}
          onChange={handleAlbumNameChange}
        />
      </Form.Item>

      <Form.Item label="Star Name" name="starName" rules={[{ required: true, message: 'Please select a star name' }]}>
        <Select
          mode="multiple"
          placeholder="Select star names"
          value={starName}
          onChange={handleStarNameChange}
          onSearch={handleSearchStarName} // Added to handle searching
          showSearch
        >
          {starNames.map((star) => (
            <Option key={star._id} value={star._id}>
              {star.starname}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Tags" name="tags">
        <Select
          mode="multiple"
          placeholder="Select tags"
          value={tags}
          onChange={handleTagsChange}
        >
          <Option value="Tag1">Tag1</Option>
          <Option value="Tag2">Tag2</Option>
          <Option value="Tag3">Tag3</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Upload Images" name="upload">
        <Dragger
          multiple
          beforeUpload={() => false} // Prevents automatic upload
          fileList={fileList}
          onChange={handleUploadChange}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Click or drag files to this area to upload</p>
          <p className="ant-upload-hint">Supports single or multiple file uploads.</p>
        </Dragger>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />} className='w-full'>
          Create Album
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateAlbum;
