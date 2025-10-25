// src/pages/StationList.tsx
import { Link } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { buscompanies } from "../../data/MockData";

const BusCompanyList: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          textAlign: "left",
        }}
      >
        <Typography variant="h3" color="black">
          Các nhà xe hiện hành
        </Typography>
      </Box>

      <Box>
        {buscompanies.map((buscompany) => (
          <Link
            key={buscompany.id}
            to={`/buscompanies/${buscompany.id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Typography variant="h5" sx={{ mb: 2, cursor: "pointer" }}>
              {buscompany.name}
            </Typography>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default BusCompanyList;
