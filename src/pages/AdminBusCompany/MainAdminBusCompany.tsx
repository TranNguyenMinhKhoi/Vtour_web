import {
  Box,
  Button,
  CardMedia,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { buscompanies, type BusCompanies } from "../../data/MockData";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import CreateBusCompany from "./CreateBusCompany";
import { useState } from "react";

const MainAdminBusCompany = () => {
  const [companies, setCompanies] = useState<BusCompanies[]>(buscompanies);
  const [open, setOpen] = useState(false);

  console.log(companies);

  const handleCreate = (newCompany: BusCompanies) => {
    setCompanies((prev) => [...prev, newCompany]);
  };

  const handleRowClick = (company: BusCompanies) => {
    console.log("Clicked row:", company);
  };

  const handleEdit = (company: BusCompanies) => {
    console.log("Edit:", company);
  };

  const handleDelete = (company: BusCompanies) => {
    console.log("Delete:", company);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" color="black">
          Quản trị nhà xe
        </Typography>

        <Button
          sx={{
            bgcolor: "blueviolet",
            color: "white",
          }}
          onClick={() => setOpen(true)}
        >
          <AddIcon /> Tạo mới
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>STT</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên nhà xe</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buscompanies.map((company, index) => (
              <TableRow
                key={index}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(company)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{company.id}</TableCell>
                <CardMedia
                  component="img"
                  image={company?.img ?? ""}
                  alt={company?.name ?? ""}
                  sx={{
                    height: { xs: 60, sm: 70, md: 60 },
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <TableCell>{company.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(company);
                    }}
                  >
                    <StarBorderIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(company);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(company);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateBusCompany
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
      />
    </Box>
  );
};

export default MainAdminBusCompany;
