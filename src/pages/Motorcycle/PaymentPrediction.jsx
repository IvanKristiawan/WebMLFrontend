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

const PaymentPrediction = () => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [total, setTotal] = useState("");
  const [prediction, setPrediction] = useState("-");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const makePrediction = async (e) => {
    e.preventDefault();

    let isFailedValidation =
      quantity.length === 0 || unitPrice.length === 0 || total.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setProgress(0);
        let response = await axios.post(`${tempUrl}/predictPayment`, {
          quantity,
          unitPrice,
          total
        });
        setPrediction(response.data);
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
        Payment Prediction
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>
              Quantity
              {quantity !== 0 &&
                !isNaN(parseInt(quantity)) &&
                ` : ${parseInt(quantity).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && quantity.length === 0 && true}
              helperText={
                error && quantity.length === 0 && "Quantity harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Unit Price
              {unitPrice !== 0 &&
                !isNaN(parseInt(unitPrice)) &&
                ` : $ ${parseInt(unitPrice).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && unitPrice.length === 0 && true}
              helperText={
                error && unitPrice.length === 0 && "Unit Price harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>
              Total
              {total !== 0 &&
                !isNaN(parseInt(total)) &&
                ` : $ ${parseInt(total).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && total.length === 0 && true}
              helperText={error && total.length === 0 && "Total harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
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

export default PaymentPrediction;

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
