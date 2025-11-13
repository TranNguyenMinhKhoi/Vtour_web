import { Box, Typography } from "@mui/material";

const Us = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <Typography variant="h2" color="black">
        Vì sao? Vì-bus
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          color: "black",
          gap: 5,
        }}
      >
        <Typography variant="h3">Vì sao bạn nên chọn Vbus?</Typography>
        <Typography variant="h5">1. Uy tín và minh bạch thông tin</Typography>
        Vbus hợp tác trực tiếp với các nhà xe uy tín, có giấy phép kinh doanh
        hợp pháp, đảm bảo mọi thông tin về lịch trình, giá vé và chính sách hoàn
        – đổi vé đều được công khai, rõ ràng và cập nhật liên tục. Người dùng có
        thể kiểm tra, so sánh và lựa chọn chuyến xe phù hợp mà không lo gặp phải
        tình trạng sai lệch hoặc thiếu minh bạch về giá. 
        <Typography variant="h5">2. An toàn trong thanh toán và bảo mật dữ liệu</Typography>
        Hệ thống của Vbus được tích hợp các giao thức
        bảo mật hiện đại (SSL, mã hóa dữ liệu thanh toán), giúp bảo vệ tuyệt đối
        thông tin cá nhân và tài khoản người dùng. Mọi giao dịch đều được xử lý
        qua nền tảng thanh toán trung gian an toàn, đảm bảo tính hợp pháp và
        giảm thiểu rủi ro khi đặt vé trực tuyến. 
        <Typography variant="h5">3. Trải nghiệm người dùng thân thiện</Typography>
        Vbus được thiết kế với giao diện trực quan, dễ sử dụng cho mọi đối
        tượng người dùng. Chỉ với vài thao tác đơn giản, khách hàng có thể: Tìm
        kiếm chuyến xe phù hợp theo điểm đi – điểm đến, Lựa chọn chỗ ngồi trực
        quan, Thanh toán nhanh chóng và nhận vé điện tử ngay lập tức. Tính năng
        lưu trữ lịch sử đặt vé cũng giúp người dùng dễ dàng tra cứu, quản lý
        hoặc đặt lại chuyến cũ. 
        <Typography variant="h5">4. Hỗ trợ khách hàng tận tâm</Typography>
        Vbus xây dựng đội ngũ chăm sóc khách hàng chuyên nghiệp, sẵn sàng hỗ trợ 24/7 trong các
        trường hợp như thay đổi chuyến, hoàn vé hoặc sự cố giao dịch. Mọi phản
        hồi của khách hàng đều được tiếp nhận và xử lý nhanh chóng, góp phần
        nâng cao trải nghiệm và độ tin cậy của hệ thống. 
        
        <Typography variant="h5">5. Định hướng phát triển</Typography>
        Định hướng phát triển bền vững và chất lượng Không chỉ dừng lại ở việc cung cấp dịch vụ
        đặt vé trực tuyến, Vbus hướng đến mục tiêu xây dựng hệ sinh thái du lịch
        – vận chuyển thông minh, kết nối người dùng với các nhà xe, trạm dừng và
        dịch vụ liên quan một cách đồng bộ. Với tầm nhìn dài hạn, Vbus đặt chất
        lượng dịch vụ và niềm tin khách hàng làm nền tảng phát triển, khẳng định
        vị thế là một trong những nền tảng đặt vé xe trực tuyến đáng tin cậy
        nhất hiện nay.
      </Box>
    </Box>
  );
};

export default Us;
