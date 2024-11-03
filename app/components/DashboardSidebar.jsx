import Link from 'next/link'
import React from 'react'

const DashboardSidebar = () => {
  return (
    <div>
        <div className='w-[250px] h-screen flex flex-col bg-slate-600 capitalize'>
            <Link href='/dashboard'>create star</Link>
            <Link href='/dashboard/edit-star'>edit star</Link>
            <Link href='/dashboard/create-album'>create album</Link>
            <Link href='/dashboard/create-images'>create image</Link>
            <Link href='/dashboard/create-video'>create video</Link>
            <Link href='/dashboard/show-all-stars'>show all stars</Link>
        </div>
    </div>
  )
}

export default DashboardSidebar