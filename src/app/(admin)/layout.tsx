import { Header } from '@/shared/components/layout/private/Header'
import { Sidebar } from '@/shared/components/layout/private/Sidebar'
import React from 'react'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%'
      }}
    >
      <Sidebar/>
      <div>
          <Header/>
        <div
          style={{
            paddingTop: 70,
            paddingLeft: 20
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout