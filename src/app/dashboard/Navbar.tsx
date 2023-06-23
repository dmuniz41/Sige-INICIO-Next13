import React from 'react'
import Image from 'next/image';
import userImage from '../../assets/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'

export const Navbar = () => {
  return (
    <div className='flex justify-between items-center h-[5rem] bg-primary-500 w-full'>
      <div className="flex items-center justify-end bg-primary-500 w-full h-full p-[1rem]">
        <ul className='list-none'>
          <li className='flex items-center gap-[1rem] font-bold text-white'>
              <Image src={userImage} width={50} height={50} priority={true} alt='user image' className='rounded-full'/>
              <span>Daniel</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

