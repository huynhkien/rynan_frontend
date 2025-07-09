import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useMemo } from 'react';
import { CustomRevenueTooltipProps } from '@/features/admin/type/adminType';
import { Product } from '@/features/product/type/productType';
import { OrderData } from '@/features/order/type/orderType';
import { UserData } from '@/features/user/type/userTypes';



export const AdminManagementStatisticalRevenue = ({ 
  orders, products, users
}: { orders: OrderData[], products: Product[], users: UserData[]  }) => {
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectQuantity, setSelectQuantity] = useState<'high' | 'short'>('high');
    const availableMonths = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

    const availableYears = useMemo(() => {
        if (!orders || orders.length === 0) return [];
        const years = new Set<number>();
        orders.forEach(order => {
        if (order.createdAt) {
            const date = new Date(order.createdAt);
            if (!isNaN(date.getTime())) {
            years.add(date.getFullYear());
            }
        }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [orders]);

    const filteredOrder = useMemo(() => {
        if (!orders || orders.length === 0) return [];
        return orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        if (isNaN(orderDate.getTime())) return false;
        const orderMonth = orderDate.getMonth() + 1;
        const orderYear = orderDate.getFullYear();
        return orderMonth === selectedMonth && orderYear === selectedYear;
        });
    }, [orders, selectedMonth, selectedYear]);

    const staffMap = new Map<string, {total: number, quantity: number, productIds: Set<string>}>();

    orders.forEach(order => {
        const staffId = order.staff as string;
        // thong tin nhan vien
        const current = staffMap.get(staffId) || 0;
        // so luong san pham
        const totalQuantity = order.products.reduce((sum, el) => sum + el.quantity, 0) || 0;
        // id san pham
        const currentIds = new Set(order.products.map(el => el.pid));
        if (current) {
            current.total += order.total || 0;
            current.quantity += totalQuantity;
            currentIds.forEach(pid => current.productIds.add(pid as string)); 
        } else {
            staffMap.set(staffId, {
            total: order.total || 0,
            quantity: totalQuantity,
            productIds: currentIds as Set<string>
            });
        }
    });

    // Chuyển Map về mảng và sắp xếp
    const orderData = Array.from(staffMap.entries())
    .map(([staffId, data]) => ({
        name: users.find(el => el._id === staffId)?.name,
        value: data.total,
        color: selectQuantity === 'high' ? '#4CAF50' : '#FF9800',
        quantity: data.quantity,
        products: Array.from(data.productIds).map(pid => ({ pid })),

    }))
    .sort((a, b) => selectQuantity === 'high' ? b.value - a.value : a.value - b.value);
    const CustomTooltip = ({ active, payload, label }: CustomRevenueTooltipProps) => {
        if (active && payload && payload.length) {
        return (
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: `2px solid ${payload[0].payload.color}` }}>
            <Typography variant='body1' sx={{ fontWeight: 600, color:payload[0].payload.color }}>
                {label}
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.primary' }}>
                Doanh thu: {payload[0].payload.value.toLocaleString()} VNĐ
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.primary' }}>
                Sản phẩm bán ra: {payload[0].payload.quantity} 
            </Typography>
            {payload[0].payload.products.length > 0 && <Typography>Tên sản phẩm:</Typography>}
            {payload[0].payload.products.map((el, index) => (
                <Typography key={index}>{products.find(item => item._id === el.pid)?.name_vn}</Typography>
            ))}
            </Paper>
        );
        }
        return null;
    };

return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Thống kê doanh thu của từng nhân viên
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Lựa chọn Doanh thu sản phẩm */}
            <FormControl size='small' sx={{ minWidth: 120 }}>
                <InputLabel id='month-select-label'>Doanh thu</InputLabel>
                <Select
                    labelId='month-select-label'
                    onChange={(e) => setSelectQuantity(e.target.value as 'high' | 'short')}
                    value={selectQuantity}
                    label='Lựa chọn doanh thu'
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

      {filteredOrder.length === 0 ? (
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
                data={orderData}
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
                  {orderData.map((entry, index) => (
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