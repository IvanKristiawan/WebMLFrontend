import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const Header = () => {
  const container = {
    height: "65px",
    backgroundColor: "black"
  };

  const contained = {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    paddingLeft: "50px",
    paddingRight: "50px",
    paddingTop: "10px"
  };

  return (
    <Box style={container}>
      <Box style={contained}>
        <Box sx={wrapper}>
          <Link to="/" className="logo" style={titleStyle}>
            Web AI
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;

const titleStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "20px",
  paddingTop: "8px"
};

const wrapper = {
  display: "flex"
};
