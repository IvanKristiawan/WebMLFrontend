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
  Autocomplete,
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

const CompanyProfitPrediction = () => {
  const [open, setOpen] = useState(false);
  const [rDSpend, setRDSpend] = useState("");
  const [administration, setAdministration] = useState("");
  const [marketingSpend, setMarketingSpend] = useState("");
  const [state, setState] = useState("");
  const [prediction, setPrediction] = useState("-");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const stateOption = [
    { label: "1 - California" },
    { label: "2 - New York" },
    { label: "3 - Florida" }
  ];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const makePrediction = async (e) => {
    e.preventDefault();

    let isFailedValidation =
      rDSpend.length === 0 ||
      administration.length === 0 ||
      marketingSpend.length === 0 ||
      state.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setProgress(0);
        let response = await axios.post(`${tempUrl}/predictCompanyProfit`, {
          rDSpend,
          administration,
          marketingSpend,
          state
        });
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
        Company Profit Prediction
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>
              R&D Spend
              {rDSpend !== 0 &&
                !isNaN(parseInt(rDSpend)) &&
                ` : $ ${parseInt(rDSpend).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && rDSpend.length === 0 && true}
              helperText={
                error && rDSpend.length === 0 && "R&D Spend harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={rDSpend}
              onChange={(e) => setRDSpend(e.target.value)}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Administration
              {administration !== 0 &&
                !isNaN(parseInt(administration)) &&
                ` : $ ${parseInt(administration).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && administration.length === 0 && true}
              helperText={
                error &&
                administration.length === 0 &&
                "Administration harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={administration}
              onChange={(e) => setAdministration(e.target.value)}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>
              Marketing Spend
              {marketingSpend !== 0 &&
                !isNaN(parseInt(marketingSpend)) &&
                ` : $ ${parseInt(marketingSpend).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && marketingSpend.length === 0 && true}
              helperText={
                error &&
                marketingSpend.length === 0 &&
                "Marketing Spend harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={marketingSpend}
              onChange={(e) => setMarketingSpend(e.target.value)}
            />
            <Typography sx={[labelInput, spacingTop]}>State</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={stateOption}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && state.length === 0 && true}
                  helperText={
                    error && state.length === 0 && "State harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setState(value.split(" ", 1)[0])}
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

export default CompanyProfitPrediction;

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
