export async function sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "re_6aGPJqFK_2SRb8XeAHBcmE81K8phasHhE", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "trannguyenminhkhoi8384@gmail.com", 
        to: email,
        subject: "Mã OTP xác thực",
        html: `<p>Mã OTP của bạn là: <b>${otp}</b></p>`,
      }),
    });

    const data = await response.json();
    console.log("Kết quả gửi mail:", data);

    return otp; 
  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    return null;
  }
}
