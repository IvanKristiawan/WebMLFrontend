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

const FlightPricePrediction = () => {
  const [open, setOpen] = useState(false);
  const [airline, setAirline] = useState("");
  const [dateOfJourney, setDateOfJourney] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [totalStops, setTotalStops] = useState("");
  const [prediction, setPrediction] = useState("-");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const airlineOption = [
    { label: "1 - Jet Airways" },
    { label: "2 - IndiGo" },
    { label: "3 - Air India" },
    { label: "4 - Multiple carriers" },
    { label: "5 - SpiceJet" },
    { label: "6 - Vistara" },
    { label: "7 - Air Asia" },
    { label: "8 - GoAir" },
    { label: "9 - Premium economy" },
    { label: "10 - Jet Airways" },
    { label: "11 - Vistara Premium" },
    { label: "12 - Trujet" }
  ];

  const sourceOption = [
    { label: "1 - Delhi" },
    { label: "2 - Kolkata" },
    { label: "3 - Banglore" },
    { label: "4 - Mumbai" },
    { label: "5 - Chennai" }
  ];

  const destinationOption = [
    { label: "1 - Cochin" },
    { label: "2 - Banglore" },
    { label: "3 - Delhi" },
    { label: "4 - New Delhi" },
    { label: "5 - Hyderabad" },
    { label: "6 - Kolkata" }
  ];

  const totalStopsOption = [
    { label: "1 - 1 Stop" },
    { label: "2 - Non Stop" },
    { label: "3 - 2 Stops" },
    { label: "4 - 3 Stops" },
    { label: "5 - 4 Stops" }
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
      airline.length === 0 ||
      dateOfJourney.length === 0 ||
      source.length === 0 ||
      destination.length === 0 ||
      duration.length === 0 ||
      totalStops.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setProgress(0);
        const newDate = new Date(dateOfJourney);
        let dateMonth = newDate.getMonth() + 1;
        let response = await axios.post(`${tempUrl}/predictFlightPrice`, {
          airline,
          dateOfJourney: dateMonth,
          source,
          destination,
          duration: duration * 60 * 60,
          totalStops
        });
        setPrediction(response.data.toLocaleString());
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
        Flight Price Prediction
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Airline</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={airlineOption}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && airline.length === 0 && true}
                  helperText={
                    error && airline.length === 0 && "Airline harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setAirline(value.split(" ", 1)[0])}
            />
            <Typography sx={[labelInput, spacingTop]}>Date</Typography>
            <TextField
              type="date"
              size="small"
              error={error && dateOfJourney.length === 0 && true}
              helperText={
                error && dateOfJourney.length === 0 && "Km Driven harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={dateOfJourney}
              onChange={(e) => setDateOfJourney(e.target.value)}
            />
            <Typography sx={[labelInput, spacingTop]}>Source</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={sourceOption}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && source.length === 0 && true}
                  helperText={
                    error && source.length === 0 && "Source harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setSource(value.split(" ", 1)[0])}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>Destination</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={destinationOption}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && destination.length === 0 && true}
                  helperText={
                    error &&
                    destination.length === 0 &&
                    "Destination harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) =>
                setDestination(value.split(" ", 1)[0])
              }
            />
            <Typography sx={[labelInput, spacingTop]}>
              Duration (hour)
              {duration !== 0 &&
                !isNaN(parseInt(duration)) &&
                ` : ${parseInt(duration).toLocaleString()}`}
            </Typography>
            <TextField
              suffix="aa"
              size="small"
              error={error && duration.length === 0 && true}
              helperText={
                error && duration.length === 0 && "Duration harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Typography sx={[labelInput, spacingTop]}>Total Stops</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={totalStopsOption}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && totalStops.length === 0 && true}
                  helperText={
                    error &&
                    totalStops.length === 0 &&
                    "Total Stops harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) =>
                setTotalStops(value.split(" ", 1)[0])
              }
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

export default FlightPricePrediction;

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
