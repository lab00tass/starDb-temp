"use client";
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAlbumById } from '@/app/lib/features/albumSlice';
import { getStarForAlbum } from '@/app/lib/features/starSlice';
import { Image } from 'antd';
import 'antd/dist/reset.css';

const AlbumImages = () => {
  const { id: albumId } = useParams();
  const dispatch = useDispatch();

  const { album, loading: albumLoading, error: albumError } = useSelector((state) => state.albumData);
  const { albumStar, loading: starLoading, error: starError } = useSelector((state) => state.starsData);

  const [fetchedStarNames, setFetchedStarNames] = useState([]);

  useEffect(() => {
    if (albumId) {
      dispatch(getAlbumById(albumId));
    }
  }, [dispatch, albumId]);

  // Fetch stars individually and aggregate names
  useEffect(() => {
    const fetchStarNames = async () => {
      if (album?.starname && Array.isArray(album.starname) && album.starname.length > 0) {
        const starNames = [];
        for (const starId of album.starname) {
          const result = await dispatch(getStarForAlbum(starId));
          if (result.payload?.data) {
            const starData = result.payload.data.find(star => star._id === starId);
            if (starData) {
              starNames.push(starData.starname);
            }
          }
        }
        setFetchedStarNames(starNames);
      }
    };

    fetchStarNames();
  }, [album, dispatch]);

  const isLoading = albumLoading || starLoading;
  const hasError = albumError || starError;

  if (isLoading) {
    return <div>Loading album images...</div>;
  }

  if (hasError) {
    return <div>Error: {albumError?.message || starError?.message || "An error occurred"}</div>;
  }

  return (
    <div className="pb-20">
      <h1>
        {album?.albumname}{' '}
        <span className="text-red-500">
          x{album?.albumimages?.length || 0}
        </span>
      </h1>

      {/* Display star names */}
      <p className="text-[10px] leading-4">
        Star Names: {fetchedStarNames.length > 0 ? fetchedStarNames.join(', ') : 'No star names available'}
      </p>

      <button>Edit Album</button> <button>Delete Album</button>

      <Image.PreviewGroup
        preview={{
          onChange: (current, prev) =>
            console.log(`current index: ${current}, previous index: ${prev}`),
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {album?.albumimages?.length > 0 ? (
            album.albumimages.map((image) => (
              <div key={image._id} className="w-auto h-full relative">
                <Image
                  height="100%"
                  src={image.thumburl}
                  preview={{ src: image.imageurl }}
                  alt={album.albumname}
                  className="object-contain"
                />
                <button className='absolute bottom-0 right-0 z-20 bg-red-700'>⁝</button>
                <p className="text-[10px] leading-4">{image.tags?.join(', ')}</p>
              </div>
            ))
          ) : (
            <p>No images found for this album.</p>
          )}
        </div>
      </Image.PreviewGroup>
    </div>
  );
};

export default AlbumImages;
