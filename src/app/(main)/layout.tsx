'use client'
import { Footer, Header } from '@/shared/components'
import { ChatbotModelView } from '@/widgets/public/chatbot/view/chatbot-view'
import { Cancel } from '@mui/icons-material'
import { Dialog, Slide, Typography, useTheme } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import Image from 'next/image'
import React, { forwardRef, Ref, useState } from 'react'
const Transition = forwardRef<
  Ref<unknown>,
  TransitionProps & {
    children: React.ReactElement;
  }
>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const theme = useTheme();
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <div
        style={{
            position: 'fixed',
            bottom: 50,
            right: 50,
            cursor: 'pointer',
            zIndex: 100
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
            backgroundColor: theme.palette.text.secondary,
            zIndex: 9999
            
          },
        }}
      >
        <Typography
          onClick={() => setShowChatbot(false)}
          sx={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }}
        >
          <Cancel sx={{color: theme.palette.text.secondary}} />
        </Typography>
        <ChatbotModelView />
      </Dialog>
    </>
  )
}

export default MainLayout