"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from 'antd/lib/pagination';
import { getAlbums } from '@/app/lib/features/albumSlice';
import Link from 'next/link';
import Image from 'next/image';

const GetAllAlbums = () => {
  const dispatch = useDispatch();
  const { albums, loading, error, currentPage, totalPages } = useSelector((state) => state.albumData);

  const [page, setPage] = useState(1);
  const [sortby, setSortby] = useState('albumname');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    dispatch(getAlbums({ page, sortby, sortOrder }));
  }, [dispatch, page, sortby, sortOrder]);

  const handleChangePage = (page) => {
    setPage(page);
  };

  const toggleSortBy = () => {
    setSortby((prev) => (prev === 'albumname' ? 'updatedAt' : 'albumname'));
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pb-20">
      <div className="flex justify-between">
        <h1>All Albums</h1>
        <div className="flex gap-4">
          <button onClick={toggleSortBy}>{sortby === 'albumname' ? 'Date' : 'Name'}</button>
          <button onClick={toggleSortOrder}>{sortOrder === 'asc' ? 'Desc' : 'Asc'}</button>
        </div>
      </div>
      {albums.length > 0 ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {albums.map((album) => (
            <div key={album._id} className="w-full">
              {album.albumimages?.length > 0 ? (
                <Link href={`/albums/${album._id}`}>
                  
                  <img
                    src={album.albumimages[0].thumburl}
                    alt={album.albumname}
                    loading="lazy"
                    className="w-full aspect-video object-cover "
                    draggable="false"
                  />
                </Link>
              ) : (
                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                  <span>No Image Available</span>
                </div>
              )}
              <h4 className="text-[10px] leading-4">{album.albumname}</h4>
            </div>
          ))}
        </div>
      ) : (
        <p>No albums found</p>
      )}
      <div className="mt-4 flex justify-center">
        <Pagination
          current={page}
          total={totalPages * 10} // Ant Design requires total items, assuming 10 items per page
          onChange={handleChangePage}
          showSizeChanger={false}
          showQuickJumper
        />
      </div>
    </div>
  );
};

export default GetAllAlbums;
