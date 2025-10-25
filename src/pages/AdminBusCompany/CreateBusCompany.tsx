import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import type {BusCompanies} from "../../data/MockData";


interface CreateBusCompanyProps {
  open: boolean;
  onClose: () => void;
  onCreate: (company: BusCompanies) => void;
}

const CreateBusCompany: React.FC<CreateBusCompanyProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = () => {
    if (!name || !code) {
      alert("Vui lòng nhập đầy đủ Tên nhà xe và Mã nhà xe!");
      return;
    }

    const newCompany: BusCompanies = {
      id: code.toLowerCase().replace(/\s+/g, "-"),
      name,
      code,
      address,
      img: "https://cdn-i2.congthuong.vn/stores/news_dataimages/2023/112023/07/12/phuong-trang-thanh-buoi20231107122849.jpg?rt=20231107122850", // default ảnh
    };

    onCreate(newCompany);
    setName("");
    setCode("");
    setAddress("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm nhà xe mới</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Tên nhà xe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Mã nhà xe"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
          />
          <TextField
            label="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={handleSave} variant="contained" color="secondary">
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBusCompany;
