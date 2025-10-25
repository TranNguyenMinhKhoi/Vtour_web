import {
  Box,
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
import { accounts, type Users } from "../../data/MockData";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const MainAdminAccount = () => {
  const handleRowClick = (account: Users) => {
    console.log("Clicked row:", account);
  };

  const handleEdit = (account: Users) => {
    console.log("Edit:", account);
  };

  const handleDelete = (account: Users) => {
    console.log("Delete:", account);
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
      <Typography variant="h4" color="black">
        Quản trị tài khoản
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>STT</TableCell>
              {/* <TableCell>ID</TableCell>
              <TableCell>Hình ảnh</TableCell> */}
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Quyền người dùng</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account, index) => (
              <TableRow
                key={index}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(account)}
              >
                <TableCell>{index + 1}</TableCell>
                {/* <TableCell>{company.id}</TableCell>
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
                /> */}
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.role}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(account);
                    }}
                  >
                    <StarBorderIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(account);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(account);
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
    </Box>
  );
};

export default MainAdminAccount;
