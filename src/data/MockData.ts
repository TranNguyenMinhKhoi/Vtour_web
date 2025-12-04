// MockData.ts
//Type
export type Venue = {
  id: number | string;
  name: string;
  img: string;
  view: number;
};

export type Sales = {
  id: number | string;
  name: string;
  img: string;
  percent: string;
};

export type Abroad = {
  id: number | string;
  name: string;
  img: string;
  view: number;
};

export type News = {
  id: number | string;
  name: string;
  img: string;
  view: number;
};

export type BusCompanies = {
  id: string;
  name: string;
  code?: string;
  description?: string;
  url: string;
  img: string;
};

export type Users = {
  id: string;
  username: string;
  name: string;
  role: string;
};

//Data
//Venue
export const topVenues: Venue[] = [
  {
    id: "p1",
    name: "Hồ Hoàn Kiếm",
    view: 123456,
    img: "https://picsum.photos/seed/p1/400/300",
  },
  {
    id: "p2",
    name: "Phố cổ Hội An",
    view: 456546,
    img: "https://picsum.photos/seed/p2/400/300",
  },
  {
    id: "p3",
    name: "Vịnh Hạ Long",
    view: 6879678,
    img: "https://picsum.photos/seed/p3/400/300",
  },
  {
    id: "p4",
    name: "Thanh Hóa",
    view: 0,
    img: "https://picsum.photos/seed/p4/400/300",
  },
  {
    id: "p5",
    name: "Đà Lạt",
    view: 4564235,
    img: "https://picsum.photos/seed/p5/400/300",
  },
  {
    id: "p6",
    name: "Phú Quốc",
    view: 9999,
    img: "https://picsum.photos/seed/p6/400/300",
  },
];

//Sale
export const topSales: Sales[] = [
  {
    id: 1,
    name: "Siêu sale 9.9",
    img: "/logocochu_real.png",
    percent: "90%",
  },
  {
    id: 2,
    name: "Sale banh chành",
    img: "/logocochu_real.png",
    percent: "50%",
  },
  {
    id: 3,
    name: "Sắp sửa sale",
    img: "/logocochu_real.png",
    percent: "?0%",
  },
  {
    id: 4,
    name: "Sale Siêu Sập",
    img: "/logocochu_real.png",
    percent: "36%",
  },
  {
    id: 5,
    name: "SALE",
    img: "/logocochu_real.png",
    percent: ">50%",
  },
];

//Abroad
export const topAbroad: Abroad[] = [
  {
    id: 1,
    name: "Campuchia",
    img: "/logocochu_real.png",
    view: 12345,
  },
  {
    id: 2,
    name: "Cambodia",
    img: "/logocochu_real.png",
    view: 98765,
  },
  {
    id: 3,
    name: "Phnong Penh",
    img: "/logocochu_real.png",
    view: 54321,
  },
  {
    id: 4,
    name: "Indonesia",
    img: "/logocochu_real.png",
    view: 12345,
  },
  {
    id: 5,
    name: "Ukraine",
    img: "/logocochu_real.png",
    view: 98765,
  },
  {
    id: 6,
    name: "ISrael",
    img: "/logocochu_real.png",
    view: 54321,
  },
];

//News
export const topNews: News[] = [
  {
    id: 1,
    name: "Quá vô nhân đạo, bất lương!!!",
    // img: "/news/quavodao.png",
    img: "/logocochu_real.png",
    view: 12345,
  },
  {
    id: 2,
    name: "Không làm được thì đứng sang một bên!!! Để người khác làm",
    // img: "/news/kolamduoc.png",
    img: "/logocochu_real.png",
    view: 98765,
  },
  {
    id: 3,
    name: "Nếu như mất điện, một số đồng chí phải mất chức",
    // img: "/news/neudematdien.jpg",
    img: "/logocochu_real.png",
    view: 54321,
  },
  {
    id: 4,
    name: "Cực sốc!!!",
    img: "/logocochu_real.png",
    view: 12345,
  },
  {
    id: 5,
    name: "EVN liên tục báo lỗ!!! Chuyên gia nói gì?",
    img: "/logocochu_real.png",
    view: 98765,
  },
];

//Locations
export const mockLocations = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Nha Trang",
  "Cần Thơ",
  "Huế",
];

//Stations
export const buscompanies: BusCompanies[] = [
  {
    id: "thanh-buoi",
    name: "Thành Bưởi",
    img: "https://thuexedulichnhatrang.vn/Media/Articles/170419113032/Gallery/xe_thanh_buoi.jpg?width=800&height=600&quality=80&mode=crop",
    url: "https://thanhbuoi.com.vn/",
  },
  {
    id: "phuong-trang",
    name: "Phương Trang",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsM9tWv0skH1wZ9S6ZcI4lPRAF1I-N2E5bRA&s",
    url: "https://www.facebook.com/xephuongtrang/?locale=vi_VN",
  },
  {
    id: "hoang-long",
    name: "Hoàng Long",
    img: "https://hoanglongasia.com/Images/og-img-update.png",
    url: "https://xekhachhoanglong.com/",

  },
  {
    id: "mai-linh",
    name: "Mai Linh",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSHjCJcdcxiIfQHVGqteQOuSnoGb3F7yNOHg&s",
    url: "https://1055.mailinh.vn/",

  },
];

//User
export const accounts: Users[] = [
  {
    id: "1",
    name: "Minh Khôi",
    username: "minhkhoi2404",
    role: "user",
  },
  {
    id: "2",
    name: "Thanh Sơn",
    username: "thanhson1109",
    role: "admin",
  },
];
