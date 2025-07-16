'use client'
import { Modal, Box, CircularProgress, Typography } from "@mui/material";
import { useAppSelector } from "@/shared/hooks/useAppHook";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { isShowModal, modalType } = useAppSelector(state => state.app);

  const renderModalContent = () => {
    switch (modalType) {
      case "loading":
        return (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            p={3}
          >
            <CircularProgress size={40} />
            <Typography variant="body1" color="text.secondary">
              Đang xử lý...
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        open={isShowModal}
        onClose={() => {}} 
        aria-labelledby="modal-loading"
        aria-describedby="modal-loading-description"
        disableEscapeKeyDown
        disableAutoFocus
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box>
          {renderModalContent()}
        </Box>
      </Modal>
      {children}
    </>
  );
};