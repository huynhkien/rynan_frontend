'use client'
import { Modal, Box, CircularProgress } from "@mui/material";
import { useAppSelector } from "@/shared/hooks/useAppHook";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { isShowModal, modalType } = useAppSelector(state => state.app);

  const renderModalContent = () => {
    switch (modalType) {
      case "loading":
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <CircularProgress />
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
          backdropFilter: "blur(2px)",
        }}
      >
        <Box
          sx={{
            outline: "none",
            backgroundColor: "white",
            borderRadius: 2,
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderModalContent()}
        </Box>
      </Modal>
      {children}
    </>
  );
};
