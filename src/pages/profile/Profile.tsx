import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Snackbar,
} from "@mui/material";
import { useLoginInfo } from "../../hook/auth/useLoginInfo";
import { useNavigate } from "react-router-dom";
import {useUpdateUser} from "../../hook/user/useUpdateUser";

type UpdateUserDto = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  idNumber?: string;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const tokenPresent = Boolean(localStorage.getItem("token"));

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useLoginInfo({ enabled: tokenPresent });

  useEffect(() => {
    if (!tokenPresent) {
      navigate("/home");
    }
  }, [tokenPresent, navigate]);

  useEffect(() => {
    if (tokenPresent) {
      refetch();
    }
  }, [tokenPresent, refetch]);

  const userData = user?.user ?? null;

  // form state
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>(""); 
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>(""); 
  const [gender, setGender] = useState<string>(""); 
  const [saving, setSaving] = useState<boolean>(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState<string>("");

  const updateUserMutation = useUpdateUser();
  const { mutate: updateUser, isLoading: isUpdating } = updateUserMutation as any;

  useEffect(() => {
    if (userData) {
      setFullName(String(userData.lastName ?? ""));
      setEmail(String(userData.email ?? ""));
      setGender(String((userData as any).gender ?? ""));
    }
  }, [userData]);

  // handlers
  const handleEditClick = () => setEditMode(true);

  const handleCancel = () => {
    if (userData) {
      setFullName(String(userData.lastName ?? ""));
      // setPhone(String(userData.phone ?? ""));
      setEmail(String(userData.email ?? ""));
      setGender(String((userData as any).gender ?? ""));
    }
    setEditMode(false);
  };

  const handleSave = () => {
    if (!fullName || fullName.trim() === "") {
      setSnackMsg("Vui lòng nhập tên hợp lệ.");
      setSnackOpen(true);
      return;
    }

    const payload: UpdateUserDto = {
      lastName: fullName.trim(),
      phone: phone.trim() || undefined,
    };

    setSaving(true);

    updateUser(payload, {
      onSuccess: (res: any) => {
        refetch();
        setSaving(false);
        setEditMode(false);
        setSnackMsg("Cập nhật hồ sơ thành công.");
        setSnackOpen(true);
        console.log(res);
      },
      onError: (err: any) => {
        console.error("Update error:", err);
        setSaving(false);
        setSnackMsg("Cập nhật thất bại. Vui lòng thử lại.");
        setSnackOpen(true);
      },
    });
  };

  // ui render helpers
  const nameDisplay = userData?.lastName ?? "--";
  const emailDisplay = userData?.email ?? "--";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        color: "black",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 2, color: "rgba(0,0,0,0.7)" }}
      >
        Thông tin của tôi
      </Typography>

      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
          p: 4,
          maxWidth: 980,
          width: "100%",
        }}
      >
        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {!editMode ? (
            <Button
              variant="contained"
              color="success"
              sx={{ textTransform: "none", fontWeight: 600 }}
              onClick={handleEditClick}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ textTransform: "none" }}
                onClick={handleCancel}
                disabled={saving || isUpdating}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: "none", fontWeight: 600 }}
                onClick={handleSave}
                disabled={saving || isUpdating}
              >
                {saving || isUpdating ? "Đang lưu..." : "Lưu"}
              </Button>
            </>
          )}
        </Box>

        {/* Nếu đang load, hiển thị spinner */}
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 160,
            }}
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box sx={{ mt: 2 }}>
            <Alert severity="warning">
              Không thể tải thông tin người dùng. Vui lòng kiểm tra token hoặc
              đăng nhập lại.
            </Alert>
          </Box>
        ) : (
          <>
            {/* Thông tin cá nhân */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                rowGap: 3,
                columnGap: 6,
                mt: 2,
              }}
            >
              <Box>
                <Typography sx={{ color: "gray" }}>Tên của bạn</Typography>
                {!editMode ? (
                  <Typography sx={{ mt: 0.5 }}>{nameDisplay}</Typography>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    sx={{ mt: 0.5 }}
                    placeholder="Nhập tên của bạn"
                  />
                )}
              </Box>

              <Box>
                <Typography sx={{ color: "gray" }}>Ngày sinh</Typography>
                <Typography sx={{ color: "gray" }}>--</Typography>
                {/* {!editMode ? (
                  <Typography sx={{ mt: 0.5 }}>
                    {dobDisplay === "--" ? "--" : dobDisplay}
                  </Typography>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    sx={{ mt: 0.5 }}
                    InputLabelProps={{ shrink: true }}
                  />
                )} */}
              </Box>

              <Box>
                <Typography sx={{ color: "gray" }}>Giới tính</Typography>
                <RadioGroup
                  row
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Nữ"
                  />
                </RadioGroup>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Thông tin liên lạc */}
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                color: "gray",
                fontWeight: 500,
                mb: 3,
              }}
            >
              Thông tin liên lạc
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                rowGap: 2,
                columnGap: 6,
              }}
            >
              <Box>
                <Typography sx={{ color: "gray" }}>Địa chỉ mail</Typography>
                {!editMode ? (
                  <Typography sx={{ mt: 0.5 }}>{emailDisplay}</Typography>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mt: 0.5 }}
                    placeholder="email@domain.com"
                  />
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 4 }}>
                <Box>
                  <Typography sx={{ color: "gray" }}>Mã quốc gia</Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 600 }}>84</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: "gray" }}>Số điện thoại</Typography>
                  {!editMode ? (
                    <Typography sx={{ mt: 0.5, fontWeight: 600 }}>
                      {phone || "--"}
                    </Typography>
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      sx={{ mt: 0.5 }}
                      placeholder="0xxxxxxxxx"
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Snack */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message={snackMsg}
      />
    </Box>
  );
};

export default Profile;
