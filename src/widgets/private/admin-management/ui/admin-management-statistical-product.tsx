import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useMemo } from 'react';
import { Product } from '@/features/product/type/productType';
import { CustomProductTooltipProps, ProductStatusData } from '@/features/admin/type/adminType';



export const AdminManagementStatisticalProduct = ({ 
  products 
}: { products: Product[] }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const availableMonths = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const availableYears = useMemo(() => {
    if (!products || products.length === 0) return [];
    const years = new Set<number>();
    products.forEach(product => {
      if (product.createdAt) {
        const date = new Date(product.createdAt);
        if (!isNaN(date.getTime())) {
          years.add(date.getFullYear());
        }
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.filter(product => {
      if (!product.createdAt) return false;
      const productDate = new Date(product.createdAt);
      if (isNaN(productDate.getTime())) return false;
      const productMonth = productDate.getMonth() + 1;
      const productYear = productDate.getFullYear();
      return productMonth === selectedMonth && productYear === selectedYear;
    });
  }, [products, selectedMonth, selectedYear]);

  const ratingData: ProductStatusData[] = [
    { 
      name: '0 - 1 sao', 
      value: filteredProducts.filter(product => product.totalRatings > 0 && product.totalRatings <= 1).length || 0, 
      countRating: filteredProducts.filter(product => product.totalRatings > 0 && product.totalRatings <= 1).reduce((acc, product) => acc + product.ratings.length, 0) || 0,
      color: '#EF5350' 
    },
    { 
      name: '1 - 2 sao', 
      value: filteredProducts.filter(product => product.totalRatings > 1 && product.totalRatings <= 2).length || 0, 
      countRating: filteredProducts.filter(product => product.totalRatings > 1 && product.totalRatings <= 2).reduce((acc, product) => acc + product.ratings.length, 0) || 0,
      color: '#FF9800' 
    },
    { 
      name: '2 - 3 sao', 
      value: filteredProducts.filter(product => product.totalRatings > 2 && product.totalRatings <= 3).length || 0, 
      countRating: filteredProducts.filter(product => product.totalRatings > 2 && product.totalRatings <= 3).reduce((acc, product) => acc + product.ratings.length, 0) || 0,
      color: '#FFC107' 
    },
    { 
      name: '3 - 4 sao', 
      value: filteredProducts.filter(product => product.totalRatings > 3 && product.totalRatings <= 4).length || 0, 
      countRating: filteredProducts.filter(product => product.totalRatings > 3 && product.totalRatings <= 4).reduce((acc, product) => acc + product.ratings.length, 0) || 0,
      color: '#8BC34A' 
    },
    { 
      name: '4 - 5 sao', 
      value: filteredProducts.filter(product => product.totalRatings > 4 && product.totalRatings <= 5).length || 0, 
      countRating: filteredProducts.filter(product => product.totalRatings > 4 && product.totalRatings <= 5).reduce((acc, product) => acc + product.ratings.length, 0) || 0,
      color: '#4CAF50' 
    },
  ];

  const totalProductCount = filteredProducts.length || 0;
  const countRating = filteredProducts.reduce((acc, product) => acc + product.ratings.length, 0) || 0;
  const CustomTooltip = ({ active, payload, label }: CustomProductTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: `2px solid ${payload[0].payload.color}` }}>
          <Typography variant='body1' sx={{ fontWeight: 600, color: payload[0].payload.color }}>
            {label}
          </Typography>
          <Typography variant='body1' sx={{ color: 'text.primary' }}>
            Số lượng: {payload[0].payload.value} sản phẩm
          </Typography>
          <Typography variant='body1' sx={{ color: 'text.primary' }}>
            Lượt đánh giá: {payload[0].payload.countRating}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Thống kê đánh giá sản phẩm
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Lựa chọn tháng */}
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel id='month-select-label'>Chọn tháng</InputLabel>
            <Select
              labelId='month-select-label'
              value={selectedMonth}
              label='Chọn tháng'
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {availableMonths.map(month => (
                <MenuItem key={month} value={month}>{`Tháng ${month}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Lựa chọn năm */}
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel id='year-select-label'>Chọn năm</InputLabel>
            <Select
              value={availableYears.includes(selectedYear) ? selectedYear : ''}
              onChange={(e) => setSelectedYear(e.target.value as number)}
            >
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
          </Select>
          </FormControl>
        </Box>
      </Box>

      {filteredProducts.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, flexDirection: 'column' }}>
          <Typography variant='h6' color='text.secondary'>
            Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Vui lòng chọn tháng khác
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 2, minHeight: 400 }}>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={ratingData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis 
                  dataKey='name' 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#666' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey='value' 
                  fill='#8884d8'
                  radius={[4, 4, 0, 0]}
                  animationBegin={0}
                  animationDuration={1000}
                  barSize={70}
                >
                  {ratingData.map((entry, index) => (
                    <Bar key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
              Tháng {selectedMonth}/{selectedYear}
            </Typography>
            
            {/* Thống kê tổng quan */}
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
              <Typography variant='body1' sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Tổng quan
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Tổng sản phẩm: {totalProductCount} 
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Lượt đánh giá: {countRating}
              </Typography>
            </Box>

            {/* Chi tiết từng mức sao */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {ratingData.map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    p: 1.5, 
                    borderRadius: 1, 
                    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
                    transition: 'all 0.3s ease', 
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      transform: 'translateX(4px)' 
                    } 
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: item.color }} />
                    <Typography variant='body1' sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      {item.value} sản phẩm
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {item.countRating} đánh giá
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};