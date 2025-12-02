import React, { createContext, useContext, useState, type ReactNode,  } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Login from "../pages/login/Login";

interface LoginDialogContextType {
  openLoginDialog: (options?: { skipRedirect?: boolean }) => void;
  closeLoginDialog: () => void;
  isInBookingFlow: boolean; 
}

const LoginDialogContext = createContext<LoginDialogContextType | undefined>(undefined);

export const useLoginDialog = () => {
  const context = useContext(LoginDialogContext);
  if (!context) {
    throw new Error("useLoginDialog must be used within LoginDialogProvider");
  }
  return context;
};

export const LoginDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [skipRedirect, setSkipRedirect] = useState(false); // ⭐ Flag skip redirect

  const openLoginDialog = (options?: { skipRedirect?: boolean }) => {
    setSkipRedirect(options?.skipRedirect || false);
    setOpen(true);
  };

  const closeLoginDialog = () => {
    setOpen(false);
    setSkipRedirect(false); // Reset về false
  };

  return (
    <LoginDialogContext.Provider 
      value={{ 
        openLoginDialog, 
        closeLoginDialog,
        isInBookingFlow: skipRedirect // ⭐ Expose flag này
      }}
    >
      {children}
      
      <Dialog
        open={open}
        onClose={closeLoginDialog}
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Login 
            dialogMode 
            onClose={closeLoginDialog}
            skipRedirect={skipRedirect}
          />
        </DialogContent>
      </Dialog>
    </LoginDialogContext.Provider>
  );
};