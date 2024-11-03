import Link from 'next/link'
import React from 'react'

const MainSidebar = () => {
  return (
    <>
        <div className='w-full h-[50px] md:w-[60px] md:h-screen bg-[#f0f0f0] shadow-xl'>
          <div className='w-full h-full flex flex-row gap-4 md:gap-0 md:flex-col justify-center items-center'>
            <Link href='/'>home</Link>
            <Link href='/stars'>star</Link>
            <Link href='/images'>imgs</Link>
            <Link href='/albums'>albm</Link>
            <Link href='/videos'>vdos</Link>
            <Link href='/dashboard'>dash</Link>
          </div>
        </div>
    </>
  )
}

export default MainSidebar