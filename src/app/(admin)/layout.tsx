'use client'
import { Header } from '@/shared/components/layout/private/Header'
import { Sidebar } from '@/shared/components/layout/private/Sidebar'
import React, { useState } from 'react'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        width: '100%'
      }}
    >
      <div
        style={{
          width: isCollapsed ? '4.5%' : '19%'
        }}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>
      <div
        style={{
          width: isCollapsed? '95.5%' : '81%',
          transition: 'width 0.4s ease',
          paddingRight: 10
        }}
      >
          <Header/>
        <div
          style={{
            paddingTop: 75,
            width: '100%'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout