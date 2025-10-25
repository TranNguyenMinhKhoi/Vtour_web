import React from "react";
import { Box, Grid, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        color: "black",
        bgcolor: "background.paper",
        py: 4,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Grid
        container
        spacing={3}
        maxWidth="lg"
        sx={{ mx: "auto", px: { xs: 2, md: 4 } }}
      >
        {/* <Grid xs={12} md={4}> */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6">VBus</Typography>
          <Typography variant="body2" color="text.secondary">
            Plan, book & enjoy — sample footer inspired by Traveloka layout.
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Typography variant="subtitle2">Support</Typography>
          <MuiLink component={Link} to="/help">
            Help Center
          </MuiLink>
          <br />
          <MuiLink component={Link} to="/contact">
            Contact
          </MuiLink>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <Typography variant="subtitle2">Company</Typography>
          <MuiLink component={Link} to="/about">
            About
          </MuiLink>
          <br />
          <MuiLink component={Link} to="/careers">
            Careers
          </MuiLink>
        </Grid> 
        <Grid size={{ xs: 12, md: 4}}>
          <Typography variant="subtitle2">Download</Typography>
          <Typography variant="body2" color="text.secondary">
            Links to mobile apps, partner programs, and more.
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "center", pt: 3, px: 2 }}>
        <Typography variant="caption">
          © {new Date().getFullYear()} Vtour. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
