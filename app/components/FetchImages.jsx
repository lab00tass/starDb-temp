"use client";
import React, { useEffect, useState } from 'react';
import GridView from './GridView';
import RiverView from './RiverView';
import { useDispatch, useSelector } from 'react-redux';
import { getAllImages } from '../lib/features/imageSlice';

const FetchImages = () => {
  const dispatch = useDispatch();
  const { allImages, loading, error } = useSelector((state) => state.imageData); // Check if `images` matches your store setup

  const [isGridView, setIsGridView] = useState(false);

  useEffect(() => {
    dispatch(getAllImages());
  }, [dispatch]);

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className="w-full h-full p-4">
      <button onClick={toggleView}>
        {isGridView ? "River View" : "Grid View"}
      </button>
      {loading && <p>Loading images...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {allImages?.length > 0 ? (
        isGridView ? 
          <GridView images={allImages} /> : 
          <RiverView images={allImages} />
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

export default FetchImages;
