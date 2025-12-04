// import { Link } from "react-router-dom";
// import { Typography, Box } from "@mui/material";
// import { buscompanies } from "../../data/MockData";

// const BusCompanyList: React.FC = () => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 2,
//       }}
//     >
//       <Box
//         sx={{
//           textAlign: "left",
//         }}
//       >
//         <Typography variant="h3" color="black">
//           Các nhà xe hiện hành
//         </Typography>
//       </Box>

//       <Box>
//         {buscompanies.map((buscompany) => (
//           <Link
//             key={buscompany.id}
//             to={`/buscompanies/${buscompany.id}`}
//             style={{ textDecoration: "none", color: "black" }}
//           >
//             <Typography variant="h5" sx={{ mb: 2, cursor: "pointer" }}>
//               {buscompany.name}
//             </Typography>
//           </Link>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default BusCompanyList;

import { Typography, Box } from "@mui/material";
import { buscompanies } from "../../data/MockData";

const BusCompanyList: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        color: "black",
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

      <Box
      >
        {buscompanies.map((buscompany) => {
          return (
            <a
              key={buscompany.id}
              href={buscompany.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1.5,
                  p: 1,
                  borderRadius: 1,
                  "&:hover": {
                    boxShadow: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src={buscompany.img}
                  alt={buscompany.name}
                  sx={{
                    width: 200,
                    height: 200,
                    minWidth: 80,
                    borderRadius: 1,
                    objectFit: "cover",
                    backgroundColor: "#f0f0f0",
                  }}
                />

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="h4"
                    sx={{ cursor: "pointer", lineHeight: 1.1 }}
                  >
                    {buscompany.name}
                  </Typography>
                </Box>
              </Box>
            </a>
          );
        })}
      </Box>
    </Box>
  );
};

export default BusCompanyList;
