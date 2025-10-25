import { Box, Link, Typography } from "@mui/material";
import Slides from "../../component/Slides";
import { topNews } from "../../data/MockData";
import { useEffect, useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  url: string;
  image: string;
  publish_date: string;
  source_country: string;
};

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://api.worldnewsapi.com/search-news?text=xe%20khach&source-country=vn&language=vi&api-key=${
            import.meta.env.VITE_WORLDNEWS_API_KEY
          }`
        );
        const data = await res.json();
        setNews(data.news || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Đang tải tin tức...</p>;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h3" color="black">
          Những tin tức hot nhất trong ngày!!!
        </Typography>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {news.map((item) => (
            <li key={item.id} style={{ marginBottom: "1.5rem", color: "black" }}>
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                color="inherit"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {item.image && (
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      sx={{
                        width: 300,
                        height: 200,
                        borderRadius: 2,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <Typography variant="h4" fontWeight={600}>
                    {item.title}
                  </Typography>
                </Box>
              </Link>

              {/* <Typography variant="body2" color="text.secondary" mt={0.5}>
                Ngày đăng: {new Date(item.publish_date).toLocaleString("vi-VN")}
              </Typography> */}
            </li>
          ))}
        </ul>
      </Box>
      <Box
        sx={{
          textAlign: "left",
          mt: 5,
        }}
      >
        <Slides title="Top tin tức " data={topNews} />
      </Box>
    </Box>
  );
};

export default News;
