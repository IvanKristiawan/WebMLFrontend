import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  Paper,
  CircularProgress
} from "@mui/material";
import PropTypes from "prop-types";
import { tempUrl } from "../../contexts/ContextProvider";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired
};

const MotorcyclePricePrediction = () => {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState("");
  const [kmDriven, setKmDriven] = useState("");
  const [exShowroomPrice, setExShowroomPrice] = useState("");
  const [prediction, setPrediction] = useState("-");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const makePrediction = async (e) => {
    e.preventDefault();

    let isFailedValidation =
      year.length === 0 ||
      kmDriven.length === 0 ||
      exShowroomPrice.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setProgress(0);
        let response = await axios.post(
          `${tempUrl}/predictPriceUsedMotorcycle`,
          {
            year,
            kmDriven,
            exShowroomPrice
          }
        );
        setPrediction(`$ ${response.data.toLocaleString()}`);
        setInterval(() => {
          setProgress((prevProgress) =>
            prevProgress >= 100 ? 100 : prevProgress + 10
          );
        }, 100);
        return () => {
          clearInterval();
        };
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box sx={container}>
      <Typography color="#757575">Prediction</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Used Motorcycle Price Prediction
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Year</Typography>
            <TextField
              type="number"
              size="small"
              error={error && year.length === 0 && true}
              helperText={error && year.length === 0 && "Year harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Km Driven
              {kmDriven !== 0 &&
                !isNaN(parseInt(kmDriven)) &&
                ` : ${parseInt(kmDriven).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && kmDriven.length === 0 && true}
              helperText={
                error && kmDriven.length === 0 && "Km Driven harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={kmDriven}
              onChange={(e) => setKmDriven(e.target.value)}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>
              Ex Showroom Price
              {exShowroomPrice !== 0 &&
                !isNaN(parseInt(exShowroomPrice)) &&
                ` : $ ${parseInt(exShowroomPrice).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && exShowroomPrice.length === 0 && true}
              helperText={
                error &&
                exShowroomPrice.length === 0 &&
                "Ex Showroom Price harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={exShowroomPrice}
              onChange={(e) => setExShowroomPrice(e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={spacingTop}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
            sx={{ marginRight: 2 }}
          >
            {"< Back"}
          </Button>
          <Button
            variant="contained"
            startIcon={<AutoFixHighIcon />}
            onClick={makePrediction}
          >
            Predict
          </Button>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontWeight: "900" }}>Result:</Typography>
          {progress < 100 ? (
            <CircularProgressWithLabel value={progress} />
          ) : (
            <Typography sx={{ color: "green", fontWeight: "600" }}>
              {prediction}
            </Typography>
          )}
        </Box>
      </Paper>
      <Divider sx={spacingTop} />
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default MotorcyclePricePrediction;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const dividerStyle = {
  mt: 2
};

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const labelInput = {
  fontWeight: "600",
  marginLeft: 1
};

const contentContainer = {
  p: 3,
  pt: 1,
  mt: 2,
  backgroundColor: "#f5f5f5"
};

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};
