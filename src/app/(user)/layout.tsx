'use client'
import { Header } from '@/shared/components/layout/private/Header'
import { SidebarUser } from '@/shared/components/layout/private/SidebarUser'
import React, { useState } from 'react'

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
      }}
    >
      <div
        style={{
          width: isCollapsed ? '4.5%' : '15%'
        }}
      >
        <SidebarUser
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>
      <div
        style={{
          width: isCollapsed? '95.5%' : '84%',
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

export default UserLayout