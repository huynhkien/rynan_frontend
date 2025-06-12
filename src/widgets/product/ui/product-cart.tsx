'use client'
import { Card, CardMedia, CardContent, Typography, Box, IconButton } from "@mui/material";
import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';




const ProductCard= () => {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <Card
      sx={{ width: '250px', height: '400px', borderRadius: "5px", boxShadow: 1 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image="/banner/banner-4.jpg"
          alt="anh"
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            backgroundColor: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            fontWeight: "bold",
            boxShadow: 1,
          }}
        >
          100.000 VNĐ
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 5,
            left: 8,
            display: hovering ? "flex" : "none",
            flexDirection: "column",
            gap: 1,
            opacity: hovering ? 1 : 0,
            transform: hovering ? "scale(1)" : "scale(0.9)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <IconButton component='a' href="/" sx={{ backgroundColor: "white", boxShadow: 1 }}>
            <FavoriteIcon sx={{ color: "red" }} />
          </IconButton>
          <IconButton component='a' href="/" sx={{ backgroundColor: "white", boxShadow: 1 }}>
            <VisibilityIcon sx={{ color: "blue" }} />
          </IconButton>
        </Box>
      </Box>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          VETAMATE 200
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;