import React, { useState } from "react";
import { Box, Card, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import TicketCardForm from "./TicketCardForm";
import SeatMap from "./SeatMap";

dayjs.extend(utc);

interface Props {
  schedules: any[];
  passengers?: string;
  onBook?: (schedule: any) => void;
  departureCity?: string;
  arrivalCity?: string;
}

const API_BASE = "http://localhost:5000";

const RoutesResults: React.FC<Props> = ({
  schedules = [],
  passengers = "",
  onBook,
  departureCity = "",
  arrivalCity = "",
}) => {
  const [openScheduleId, setOpenScheduleId] = useState<string | null>(null);
  const [seatMaps, setSeatMaps] = useState<Record<string, any>>({});
  const [loadingSeatFor, setLoadingSeatFor] = useState<string | null>(null);
  const [seatError, setSeatError] = useState<Record<string, string>>({});

  const toggleSeatPanel = async (schedule: any) => {
    const scheduleId = schedule._id ?? schedule.id ?? schedule.scheduleId;
    if (!scheduleId) {
      console.warn("Schedule does not have an id:", schedule);
      return;
    }

    if (openScheduleId === scheduleId) {
      setOpenScheduleId(null);
      return;
    }

    setOpenScheduleId(scheduleId);

    if (seatMaps[scheduleId]) return;

    try {
      setLoadingSeatFor(scheduleId);
      setSeatError((prev) => ({ ...prev, [scheduleId]: "" }));
      const res = await axios.get(`${API_BASE}/api/schedules/${scheduleId}/seats`);
      const seatMap = res.data?.seatMap ?? res.data ?? null;
      setSeatMaps((prev) => ({ ...prev, [scheduleId]: seatMap }));
    } catch (err: any) {
      console.error("Lỗi lấy seatMap:", err);
      const msg =
        err?.response?.data?.message ??
        (err?.response?.status === 500
          ? "Server error (500). Kiểm tra logs server."
          : "Lỗi khi lấy sơ đồ ghế");
      setSeatError((prev) => ({ ...prev, [scheduleId]: msg }));
    } finally {
      setLoadingSeatFor(null);
    }
  };

  const formatTime = (iso?: string) => (iso ? dayjs.utc(iso).format("HH:mm") : "—");

  return (
    <Box mt={4}>
      <Grid container spacing={2}>
        {schedules.map((s: any, idx: number) => {
          const route = s.routeId || s.route || null;
          const bus = s.busId || null;
          const company = bus?.companyId || null;

          const logo =
            company?.logoUrl ||
            company?.logo ||
            company?.logoUrlThumb ||
            "/placeholder-logo.png";

          const companyName =
            company?.name ||
            company?.companyName ||
            bus?.companyName ||
            bus?.operatorName ||
            "Nhà xe";

          const departureTimeISO = s.departureTime || s.departureAt || s.startTime;
          const arrivalTimeISO = s.arrivalTime || s.endTime;

          // formatted strings for display (the ones used in TicketCardForm)
          const startTime = formatTime(departureTimeISO);
          const endTime = formatTime(arrivalTimeISO);

          const duration = (() => {
            if (!departureTimeISO || !arrivalTimeISO) return "—";
            const diffMs = dayjs.utc(arrivalTimeISO).diff(dayjs.utc(departureTimeISO));
            if (diffMs <= 0) return "—";
            const totalMinutes = Math.floor(diffMs / 60000);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return `${h}h ${m}m`;
          })();

          const rawPrice =
            s.basePrice ?? s.price ?? s.fare ?? route?.basePrice ?? route?.price ?? null;
          const price =
            rawPrice == null || rawPrice === ""
              ? "—"
              : new Intl.NumberFormat("vi-VN").format(Number(rawPrice));

          const vehicleImage =
            bus?.image ||
            bus?.vehicleImage ||
            (bus?.photos && bus.photos.length ? bus.photos[0] : null) ||
            "/placeholder-bus.png";

          const key =
            s._id ?? (route && route._id ? `${route._id}_${departureTimeISO}` : `sched_${idx}`);

          const scheduleId = s._id ?? s.id ?? s.scheduleId;
          const busId = (bus && (bus._id || bus.id)) ?? s.busId ?? null;

          return (
            <React.Fragment key={key}>
              <Grid size={{xs: 12, md: 12}}>
                <Card sx={{ borderRadius: 4, overflow: "hidden", backgroundColor: "#fff" }}>
                  <div
                    onClick={() => {
                      toggleSeatPanel(s);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <TicketCardForm
                      logo={logo}
                      companyName={companyName}
                      startTime={startTime}
                      duration={duration}
                      endTime={endTime}
                      startStation={
                        route?.departureStationId?.stationName
                          ? `${route.departureStationId.stationName}, ${
                              route.departureStationId.city || ""
                            }`
                          : route?.departureStationId?.city || "N/A"
                      }
                      endStation={
                        route?.arrivalStationId?.stationName
                          ? `${route.arrivalStationId.stationName}, ${route.arrivalStationId.city || ""}`
                          : route?.arrivalStationId?.city || "N/A"
                      }
                      price={price}
                      rating={Number(company?.rating ?? 0)}
                      vehicleImage={vehicleImage}
                      features={bus?.features || bus?.amenities || []}
                      cancelable={s.cancelable ?? s.isCancelable ?? false}
                      onBook={() => (onBook ? onBook(s) : console.log("Book", s))}
                      scheduleId={scheduleId}
                      busId={busId}
                    />
                  </div>
                </Card>
              </Grid>

              {openScheduleId === scheduleId && (
                <Grid size={{xs: 12}}>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#fafafa", boxShadow: 1 }}>
                    {loadingSeatFor === scheduleId ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress size={20} />
                        <span>Đang tải sơ đồ ghế...</span>
                      </Box>
                    ) : seatError[scheduleId] ? (
                      <Box sx={{ color: "error.main" }}>{seatError[scheduleId]}</Box>
                    ) : seatMaps[scheduleId] ? (
                      // NOTE: pass BOTH the formatted display times AND the raw ISO times.
                      <SeatMap
                        seatMap={seatMaps[scheduleId]}
                        passengers={passengers}
                        scheduleId={scheduleId}
                        busId={busId}
                        departureCity={departureCity}
                        arrivalCity={arrivalCity}
                        departureTime={departureTimeISO}
                        arrivalTime={arrivalTimeISO}
                        departureTimeDisplay={startTime}
                        arrivalTimeDisplay={endTime}
                        price={price} // <-- truyền price xuống SeatMap để hiển thị/tính tổng
                      />
                    ) : (
                      <Box>Không có dữ liệu sơ đồ ghế cho chuyến này.</Box>
                    )}
                  </Box>
                </Grid>
              )}
            </React.Fragment>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RoutesResults;
