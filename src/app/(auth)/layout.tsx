import { Footer, Header } from '@/shared/components'
import { Box } from '@mui/material'
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header/>
      <Box>
        {children}
      </Box>
      <Footer/>
    </div>
  )
}

export default AuthLayout