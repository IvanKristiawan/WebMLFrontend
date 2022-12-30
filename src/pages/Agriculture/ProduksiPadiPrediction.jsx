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

const ProduksiPadiPrediction = () => {
  const [open, setOpen] = useState(false);
  const [provinsi, setProvinsi] = useState("");
  const [tahun, setTahun] = useState("");
  const [luasPanen, setLuasPanen] = useState("");
  const [curahHujan, setCurahHujan] = useState("");
  const [kelembapan, setKelembapan] = useState("");
  const [suhuRataRata, setSuhuRataRata] = useState("");
  const [prediction, setPrediction] = useState("-");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const provinsiOption = [
    { label: "1 - Aceh" },
    { label: "2 - Sumatera Utara" },
    { label: "3 - Sumatera Barat" },
    { label: "4 - Riau" },
    { label: "5 - Jambi" },
    { label: "6 - Sumatera Selatan" },
    { label: "7 - Bengkulu" },
    { label: "8 - Lampung" }
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
      provinsi.length === 0 ||
      tahun.length === 0 ||
      luasPanen.length === 0 ||
      curahHujan.length === 0 ||
      kelembapan.length === 0 ||
      suhuRataRata.length === 0;
    if (isFailedValidation) {
      setError(true);
      setOpen(!open);
    } else {
      try {
        setProgress(0);
        let response = await axios.post(`${tempUrl}/predictProduksiPadi`, {
          provinsi,
          tahun,
          luasPanen,
          curahHujan,
          kelembapan,
          suhuRataRata
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
        Produksi Padi Prediction
      </Typography>
      <Divider sx={dividerStyle} />
      <Paper sx={contentContainer} elevation={12}>
        <Box sx={showDataContainer}>
          <Box sx={showDataWrapper}>
            <Typography sx={labelInput}>Provinsi</Typography>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={provinsiOption}
              renderInput={(params) => (
                <TextField
                  size="small"
                  error={error && provinsi.length === 0 && true}
                  helperText={
                    error && provinsi.length === 0 && "Provinsi harus diisi!"
                  }
                  {...params}
                />
              )}
              onInputChange={(e, value) => setProvinsi(value.split(" ", 1)[0])}
            />
            <Typography sx={[labelInput, spacingTop]}>Tahun</Typography>
            <TextField
              type="number"
              size="small"
              error={error && tahun.length === 0 && true}
              helperText={error && tahun.length === 0 && "Tahun harus diisi!"}
              id="outlined-basic"
              variant="outlined"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Luas Panen
              {luasPanen !== 0 &&
                !isNaN(parseInt(luasPanen)) &&
                ` : ${parseInt(luasPanen).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && luasPanen.length === 0 && true}
              helperText={
                error && luasPanen.length === 0 && "Luas Panen harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={luasPanen}
              onChange={(e) => setLuasPanen(e.target.value)}
            />
          </Box>
          <Box sx={[showDataWrapper, secondWrapper]}>
            <Typography sx={labelInput}>
              Curah Hujan
              {curahHujan !== 0 &&
                !isNaN(parseInt(curahHujan)) &&
                ` : ${parseInt(curahHujan).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && curahHujan.length === 0 && true}
              helperText={
                error && curahHujan.length === 0 && "Curah Hujan harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={curahHujan}
              onChange={(e) => setCurahHujan(e.target.value)}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Kelembapan
              {kelembapan !== 0 &&
                !isNaN(parseInt(kelembapan)) &&
                ` : ${parseInt(kelembapan).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && kelembapan.length === 0 && true}
              helperText={
                error && kelembapan.length === 0 && "kelembapan harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={kelembapan}
              onChange={(e) => setKelembapan(e.target.value)}
            />
            <Typography sx={[labelInput, spacingTop]}>
              Suhu Rata-Rata
              {suhuRataRata !== 0 &&
                !isNaN(parseInt(suhuRataRata)) &&
                ` : ${parseInt(suhuRataRata).toLocaleString()}`}
            </Typography>
            <TextField
              type="number"
              size="small"
              error={error && suhuRataRata.length === 0 && true}
              helperText={
                error &&
                suhuRataRata.length === 0 &&
                "Suhu Rata-Rata harus diisi!"
              }
              id="outlined-basic"
              variant="outlined"
              value={suhuRataRata}
              onChange={(e) => setSuhuRataRata(e.target.value)}
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

export default ProduksiPadiPrediction;

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
