// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useRegister } from "../../hook/auth/useRegister";
// import FormField from "../../component/FormField";
// import OTPRegister from "../OTPregister/OTPRegister";

// interface RegisterProps {
//   dialogMode?: boolean;
//   onClose?: () => void;
// }

// const Register: React.FC<RegisterProps> = () => {
//   const navigate = useNavigate();
//   const { mutate: register, isPending } = useRegister();

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [phone, setPhone] = useState("");

//   // dialog để hiển thị message từ backend (yêu cầu xác thực OTP hoặc lỗi)
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [dialogMsg, setDialogMsg] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);

//   // NEW: hiển thị bước OTP trực tiếp trong dialog
//   const [showOtpStep, setShowOtpStep] = useState(false);

//   const handleSubmit = (e?: React.FormEvent) => {
//     e?.preventDefault();

//     // simple validation
//     if (!email || !password || !username || !phone) {
//       setDialogMsg("Vui lòng điền đầy đủ các trường bắt buộc.");
//       setIsSuccess(false);
//       setShowOtpStep(false);
//       setDialogOpen(true);
//       return;
//     }

//     const payload = {
//       username,
//       email,
//       password,
//       fullName: fullName || undefined,
//       phone,
//     };

//     register(payload, {
//       onSuccess: (res: any) => {
//         // thay vì hiện thong báo rồi navigate, chuyển thẳng sang bước OTP trong dialog
//         setShowOtpStep(true);
//         setDialogOpen(true);
//         // vẫn giữ email đã nhập để autofill OTP form
//         setIsSuccess(true);
//         // không set dialogMsg thành thông báo "đã gửi" để bỏ qua bước đó
//         console.log(res);
//       },
//       onError: (err: any) => {
//         const message =
//           err?.response?.data?.message ??
//           err?.message ??
//           "Đăng ký thất bại. Vui lòng thử lại.";
//         setDialogMsg(message);
//         setIsSuccess(false);
//         setShowOtpStep(false);
//         setDialogOpen(true);
//       },
//     });
//   };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{
//         p: 4,
//         bgcolor: "white",
//         borderRadius: 4,
//         boxShadow: 0,
//         textAlign: "center",
//       }}
//     >
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         Đăng ký
//       </Typography>

//       <FormField
//         placeholder="Tên đăng nhập"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         type="text"
//       />
//       <FormField
//         placeholder="Email"
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <FormField
//         placeholder="Mật khẩu"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <FormField
//         placeholder="Họ và tên"
//         type="text"
//         value={fullName}
//         onChange={(e) => setFullName(e.target.value)}
//       />
//       <FormField
//         placeholder="Số điện thoại"
//         type="text"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//       />
//       <Button
//         type="submit"
//         fullWidth
//         sx={{
//           mt: 2,
//           bgcolor: "blueviolet",
//           color: "white",
//           fontSize: "20px",
//         }}
//         disabled={isPending}
//       >
//         {isPending ? <CircularProgress size={24} /> : "Đăng ký"}
//       </Button>
//       {/* Dialog: khi showOtpStep === true -> render trực tiếp OTPRegister ở đây */}
//       <Dialog
//         open={dialogOpen}
//         onClose={() => {
//           setDialogOpen(false);
//           setShowOtpStep(false);
//         }}
//         maxWidth="sm"
//         fullWidth
//       >
//         {showOtpStep ? (
//           <>
//             <DialogTitle>Xác thực OTP</DialogTitle>
//             <DialogContent dividers>
//               {/* truyền email hiện tại để autofill trong OTP form */}
//               <OTPRegister initialEmail={email} />
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 onClick={() => {
//                   setDialogOpen(false);
//                   setShowOtpStep(false);
//                 }}
//                 variant="outlined"
//               >
//                 Đóng
//               </Button>
//             </DialogActions>
//           </>
//         ) : (
//           <>
//             <DialogTitle>Thông báo</DialogTitle>
//             <DialogContent>
//               <Typography>{dialogMsg}</Typography>
//             </DialogContent>
//             <DialogActions>
//               {isSuccess ? (
//                 <Button
//                   variant="contained"
//                   sx={{
//                     bgcolor: "blueviolet",
//                     color: "white",
//                   }}
//                   onClick={() => {
//                     // nếu có luồng success cũ (ít khi xảy ra vì success giờ dẫn vào OTP step),
//                     // chuyển đến trang OTPRegister (giữ fallback cũ)
//                     setDialogOpen(false);
//                     navigate("/OTPRegister", { state: { email } });
//                   }}
//                 >
//                   Xác nhận
//                 </Button>
//               ) : (
//                 <Button variant="outlined" onClick={() => setDialogOpen(false)}>
//                   Đóng
//                 </Button>
//               )}
//             </DialogActions>
//           </>
//         )}
//       </Dialog>
//     </Box>
//   );
// };

// export default Register;
