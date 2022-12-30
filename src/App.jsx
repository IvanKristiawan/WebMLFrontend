import "./styles.css";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import {
  Sidebar,
  Menu,
  SubMenu,
  MenuItem,
  useProSidebar
} from "react-pro-sidebar";
import { Divider, Box, Typography, CssBaseline, Tooltip } from "@mui/material";
import { Header } from "./components";
import MenuIcon from "@mui/icons-material/Menu";
import {
  PaymentPrediction,
  MotorcyclePricePrediction,
  ProduksiPadiPrediction,
  CompanyProfitPrediction,
  FlightPricePrediction
} from "./pages/index";
import MopedIcon from "@mui/icons-material/Moped";
import PaymentIcon from "@mui/icons-material/Payment";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import GrassIcon from "@mui/icons-material/Grass";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";

export default function App() {
  const { collapseSidebar } = useProSidebar();
  const [open, setOpen] = useState(true);

  const openMenuFunction = () => {
    setOpen(!open);
    collapseSidebar();
  };

  return (
    <Box>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <div style={container}>
          <Sidebar backgroundColor={"#e3f2fd"} collapsedWidth="0px">
            <Menu>
              <SubMenu
                label="Motorcycle"
                icon={<MopedIcon name="motorcycle-icon" color="secondary" />}
              >
                <Link to="/paymentPrediction" style={linkText}>
                  <MenuItem
                    icon={
                      <PaymentIcon
                        name="payment-prediction-icon"
                        color="secondary"
                      />
                    }
                  >
                    Payments Prediction
                  </MenuItem>
                </Link>
                <Link to="/priceMotorcyclePrediction" style={linkText}>
                  <MenuItem
                    icon={
                      <PriceCheckIcon
                        name="price-prediction-icon"
                        color="secondary"
                      />
                    }
                  >
                    Price Prediction
                  </MenuItem>
                </Link>
                <Divider />
              </SubMenu>
              <SubMenu
                label="Agriculture"
                icon={
                  <AgricultureIcon name="agriculture-icon" color="secondary" />
                }
              >
                <Link to="/produksiPadiPrediction" style={linkText}>
                  <MenuItem
                    icon={
                      <GrassIcon
                        name="produksi-padi-prediction-icon"
                        color="secondary"
                      />
                    }
                  >
                    Produksi Padi Prediction
                  </MenuItem>
                </Link>
                <Divider />
              </SubMenu>
              <SubMenu
                label="Company"
                icon={<ApartmentIcon name="company-icon" color="secondary" />}
              >
                <Link to="/companyProfitPrediction" style={linkText}>
                  <MenuItem
                    icon={
                      <ReceiptLongIcon
                        name="company-profit-prediction-icon"
                        color="secondary"
                      />
                    }
                  >
                    Company Profit Prediction
                  </MenuItem>
                </Link>
                <Divider />
              </SubMenu>
              <SubMenu
                label="Airplane"
                icon={
                  <AirplanemodeActiveIcon
                    name="airplane-icon"
                    color="secondary"
                  />
                }
              >
                <Link to="/flightPricePrediction" style={linkText}>
                  <MenuItem
                    icon={
                      <AirplaneTicketIcon
                        name="flight-price-prediction-icon"
                        color="secondary"
                      />
                    }
                  >
                    Flight Price Prediction
                  </MenuItem>
                </Link>
                <Divider />
              </SubMenu>
            </Menu>
          </Sidebar>
          <main>
            <Tooltip title="Menu">
              <MenuIcon
                onClick={() => openMenuFunction()}
                sx={sidebarIcon}
                fontSize="large"
              />
            </Tooltip>
            <Box sx={contentWrapper}>
              <Routes>
                <Route
                  path="/paymentPrediction"
                  element={<PaymentPrediction />}
                />
                <Route
                  path="/priceMotorcyclePrediction"
                  element={<MotorcyclePricePrediction />}
                />
                <Route
                  path="/produksiPadiPrediction"
                  element={<ProduksiPadiPrediction />}
                />
                <Route
                  path="/companyProfitPrediction"
                  element={<CompanyProfitPrediction />}
                />
                <Route
                  path="/flightPricePrediction"
                  element={<FlightPricePrediction />}
                />
              </Routes>
            </Box>
          </main>
        </div>
      </BrowserRouter>
    </Box>
  );
}

const sidebarIcon = {
  backgroundColor: "#e0e0e0",
  borderRadius: "20px",
  padding: 1,
  marginLeft: 1,
  marginTop: 1,
  cursor: "pointer"
};

const contentWrapper = {
  minHeight: "100vh",
  width: "80vw"
};

const container = {
  display: "flex",
  height: "100%",
  minHeight: "100vh"
};

const linkText = {
  textDecoration: "none",
  color: "inherit"
};
