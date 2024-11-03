"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLastCreatedStar } from '../lib/features/starSlice';

const LatestStars = () => {
  const dispatch = useDispatch();

  // Select state from Redux store
  const { lastCreatedStar, loading, error } = useSelector((state) => state.starsData);
  console.log('Redux State:', lastCreatedStar);

  // Fetch data when the component mounts
  useEffect(() => {
    if (!lastCreatedStar.data?.length) {
      dispatch(getLastCreatedStar());
    }
  }, [dispatch, lastCreatedStar.data]);

  // Render loading, error, and no-data states
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (lastCreatedStar.data?.length === 0) return <p>No stars available.</p>;

  // Render the list of stars
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Latest Stars</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 capitalize">
        {lastCreatedStar.data.map((star) => (
          <div key={star._id} className="w-full aspect-video border rounded p-4 shadow-md">
            <div className="w-full h-full bg-slate-400">
            <img
              src={star.starcover}
              alt={`Cover of ${star.starname}`}
              draggable="false"
              className="w-full h-full object-cover"
            />
            </div>
            <h3 className="text-[12px] font-semibold">{star.starname}</h3>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestStars;
