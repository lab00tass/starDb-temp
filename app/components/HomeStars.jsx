"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStars } from '../lib/features/starSlice';
import { Pagination } from 'antd';

const HomeStars = () => {
  const dispatch = useDispatch();
  const { allStars, loading, error } = useSelector((state) => state.starsData);
  
  const [page, setPage] = useState(1);
  const [sortby, setSortby] = useState('starname');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    dispatch(getAllStars({ page, limit: allStars.limit, sortby, sortOrder }));
  }, [dispatch, page, sortby, sortOrder]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const toggleSortBy = () => {
    setSortby((prev) => (prev === 'starname' ? 'updatedAt' : 'starname'));
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Stars</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={toggleSortBy}>
          {sortby === 'starname' ? 'Sort by Date' : 'Sort by Name'}
        </button>
        <button onClick={toggleSortOrder}>
          {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {allStars.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allStars.data.map((star) => (
            <div key={star._id} className="bg-gray-100 p-4 shadow-md rounded">
              <h2 className="font-semibold text-lg">{star.starname}</h2>
              <img
                src={star.starcover}
                alt={`${star.starname} profile`}
                className="w-full h-auto object-cover mb-2"
              />
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No stars available.</p>
      )}

      <div className="flex justify-center mt-4">
        <Pagination
          current={page}
          total={allStars.totalPages * allStars.limit}
          onChange={handlePageChange}
          pageSize={allStars.limit}
        />
      </div>
    </div>
  );
};

export default HomeStars;
