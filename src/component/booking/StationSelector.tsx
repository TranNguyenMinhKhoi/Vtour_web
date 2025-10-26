import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Station } from "./types";

dayjs.extend(utc);

interface StationSelectorProps {
  stations: Station[];
  timeParam: string;
  loading: boolean;
  selectedStation: string;
  onStationChange: (stationId: string) => void;
}

const formatAddress = (address: any): string => {
  if (!address) return "N/A";
  if (typeof address === "string") return address;

  if (typeof address === "object") {
    const parts: string[] = [];
    if (address.street) parts.push(address.street);
    if (address.ward) parts.push(address.ward);
    if (address.district) parts.push(address.district);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  }

  return "N/A";
};

const formatTime = (isoOrFormatted?: string) => {
  if (!isoOrFormatted) return "—";

  const timeOnlyRegex = /^\d{1,2}:\d{2}$/;
  if (timeOnlyRegex.test(isoOrFormatted)) return isoOrFormatted;

  try {
    const d = dayjs.utc(isoOrFormatted);
    if (d.isValid()) return d.format("HH:mm");
    const d2 = dayjs(isoOrFormatted);
    if (d2.isValid()) return d2.format("HH:mm");
    return "—";
  } catch {
    return "—";
  }
};

const StationSelector: React.FC<StationSelectorProps> = ({
  stations,
  timeParam,
  loading,
  selectedStation,
  onStationChange,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (stations.length === 0) {
    return (
      <Typography variant="body2" sx={{ p: 2, color: "text.secondary" }}>
        Không tìm thấy thông tin trạm
      </Typography>
    );
  }

  const displayTime = formatTime(timeParam);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: "error.main",
          }}
        />
        <Typography variant="body1" fontWeight={600}>
          {displayTime}
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {stations.find((s) => s._id === selectedStation)?.stationName ||
            stations[0]?.stationName ||
            "—"}
        </Typography>
      </Box>

      <RadioGroup
        value={selectedStation}
        onChange={(e) => onStationChange(e.target.value)}
      >
        {stations.map((station) => (
          <Box
            key={station._id}
            sx={{
              mb: 2,
              p: 1.5,
              border:
                selectedStation === station._id
                  ? "2px solid #1976d2"
                  : "1px solid #e0e0e0",
              borderRadius: 1,
              bgcolor:
                selectedStation === station._id ? "#f0f7ff" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
            onClick={() => onStationChange(station._id)}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <FormControlLabel
                value={station._id}
                control={<Radio size="small" />}
                label=""
                sx={{ m: 0 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {station.stationName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {formatAddress(station.address)}
                </Typography>
                {station.contactNumber && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    SĐT: {station.contactNumber}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </RadioGroup>

      {stations.length === 1 && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: "#e3f2fd",
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="primary">
            * Xe buýt này có một điểm lên xuống duy nhất
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StationSelector;