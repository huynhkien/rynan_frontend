import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useMemo } from 'react';
import { CustomInventoryTooltipProps } from '@/features/admin/type/adminType';
import { InventoryData } from '@/features/inventory/type/inventoryType';
import { Product } from '@/features/product/type/productType';
import { MaterialData } from '@/features/material/type/materialType';



export const AdminManagementStatisticalInventory = ({ 
  inventory, products, materials
}: { inventory: InventoryData[], products: Product[], materials: MaterialData[] }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectQuantity, setSelectQuantity] = useState<'high' | 'short'>('high');
  const availableMonths = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const availableYears = useMemo(() => {
    if (!inventory || inventory.length === 0) return [];
    const years = new Set<number>();
    inventory.forEach(product => {
      if (product.createdAt) {
        const date = new Date(product.createdAt);
        if (!isNaN(date.getTime())) {
          years.add(date.getFullYear());
        }
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    if (!inventory || inventory.length === 0) return [];
    return inventory.filter(product => {
      if (!product.createdAt) return false;
      const productDate = new Date(product.createdAt);
      if (isNaN(productDate.getTime())) return false;
      const productMonth = productDate.getMonth() + 1;
      const productYear = productDate.getFullYear();
      return productMonth === selectedMonth && productYear === selectedYear;
    });
  }, [inventory, selectedMonth, selectedYear]);

  const inventoryData = selectQuantity === 'high'
  ? inventory.filter(el => Number(el.currentStock) > 100).map(el => ({
      name: el.type === 'product'
        ? products.find(item => item._id === el.productId)?.name_vn
        : materials.find(item => item._id === el.materialId)?.name,
      value: el.currentStock,
      color: '#4CAF50'
    }))
  : inventory.filter(el => Number(el.currentStock) <= 100).map(el => ({
      name: el.type === 'product'
        ? products.find(item => item._id === el.productId)?.name_vn
        : materials.find(item => item._id === el.materialId)?.name,
      value: el.currentStock,
      color: '#FF9800'
    }));


  const CustomTooltip = ({ active, payload, label }: CustomInventoryTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: `2px solid ${payload[0].payload.color}` }}>
          <Typography variant='body1' sx={{ fontWeight: 600, color:payload[0].payload.color }}>
            {label}
          </Typography>
          <Typography variant='body1' sx={{ color: 'text.primary' }}>
            Số lượng: {payload[0].payload.value} sản phẩm
          </Typography>
          {payload[0].payload.value < 50 &&
          <Typography>
            Cảnh báo. Vui lòng nhập kho!!!
          </Typography>
        }
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Thống kê tồn kho sản phẩm
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Lựa chọn số lượng sản phẩm */}
            <FormControl size='small' sx={{ minWidth: 120 }}>
                <InputLabel id='month-select-label'>Số lượng</InputLabel>
                <Select
                    labelId='month-select-label'
                    onChange={(e) => setSelectQuantity(e.target.value as 'high' | 'short')}
                    value={selectQuantity}
                    label='Lựa chọn số lượng sản phẩm'
                >
                    <MenuItem value='high'>Cao nhất</MenuItem>
                    <MenuItem value='short'>Thấp nhất</MenuItem>
                </Select>
            </FormControl>
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

      {filteredInventory.length === 0 ? (
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
                data={inventoryData}
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
                  barSize={40}
                >
                  {inventoryData.map((entry, index) => (
                    <Bar key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}
    </Box>
  );
};