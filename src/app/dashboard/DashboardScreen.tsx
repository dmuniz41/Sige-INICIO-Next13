
import React from 'react'
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const DashboardScreen = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <Navbar />
    </div>
  )
}


