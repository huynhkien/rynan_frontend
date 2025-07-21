'use client'
import { Header } from '@/shared/components/layout/private/Header'
import { SidebarAdmin } from '@/shared/components/layout/private/SidebarAdmin'
import { ChatbotManagementView } from '@/widgets/private/chatbot-management/view/chatbot-management-view'
import { Cancel } from '@mui/icons-material'
import { Dialog, Slide, Typography, useTheme } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import Image from 'next/image'
import React, { forwardRef, Ref, useState } from 'react'
// Tạo Transition component cho slide dưới lên
const Transition = forwardRef<
  Ref<unknown>,
  TransitionProps & {
    children: React.ReactElement;
  }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const theme = useTheme();
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
        <SidebarAdmin
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
            width: '100%',
            position: 'relative'
          }}
        >
          {children}
          <div
            style={{
              position: 'fixed',
              bottom: 50,
              right: 50,
              cursor: 'pointer'
            }}
            onClick={() => setShowChatbot(true)}
          >
            <Image
              src='/logo/chatbot-logo.png'
              alt='chatbot'
              width={50}
              height={50}
            />
          </div>
          <Dialog
            open={showChatbot}
            onClose={() => setShowChatbot(false)}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            BackdropProps={{ invisible: true }}
            PaperProps={{
              style: {
                position: 'fixed',
                bottom: 30,
                right: 50,
                margin: 0,
                width: '400px',
                height: '600px',
                borderRadius: '12px',
                backgroundColor: theme.palette.text.secondary
                
              },
            }}
          >
            <Typography
              onClick={() => setShowChatbot(false)}
              sx={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }}
            >
              <Cancel sx={{color: theme.palette.text.secondary}} />
            </Typography>
            <ChatbotManagementView />
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout