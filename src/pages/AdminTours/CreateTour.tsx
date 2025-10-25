import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { buscompanies, type BusCompanies } from "../../data/MockData";

interface CreateTourProps {
  open: boolean;
  onClose: () => void;
  onCreate: (tour: any) => void;
}

const CreateTour: React.FC<CreateTourProps> = ({ open, onClose, onCreate }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [name, setName] = useState("");
  const [busCompany, setBusCompany] = useState("");
  const [price, setPrice] = useState("");

  const handleSave = () => {
    if (!origin || !destination || !name || !busCompany || price) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newTour = {
      id: Date.now().toString(),
      origin: { city: origin },
      destination: { city: destination },
      name,
      busCompany,
      price,
    };

    onCreate(newTour);

    // reset
    setOrigin("");
    setDestination("");
    setName("");
    setBusCompany("");
    setPrice("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm Tour mới</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Điểm đi"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            fullWidth
          />
          <TextField
            label="Điểm đến"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            fullWidth
          />
          <TextField
            label="Tên Tour"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Nhà xe</InputLabel>
            <Select
              value={busCompany}
              onChange={(e) => setBusCompany(e.target.value)}
              label="Nhà xe"
            >
              {buscompanies.map((bus: BusCompanies, index) => (
                <MenuItem key={index} value={bus.name}>
                  {bus.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Giá vé"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={handleSave} variant="contained" color="secondary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTour;
