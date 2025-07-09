import { CustomTooltipProps, ReceiptStatusData } from '@/features/admin/type/adminType';
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieLabelRenderProps } from 'recharts';
import { useState, useMemo } from 'react';
import { ReceiptData } from '@/features/receipt/type/receiptType';

export const AdminManagementStatisticalReceiptStatus = ({ 
  receiptData 
}:  {receiptData: ReceiptData[]}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const availableMonths = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const availableYears = useMemo(() => {
    if (!receiptData || receiptData.length === 0) return [];
    const years = new Set<number>();
    receiptData.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        if (!isNaN(date.getTime())) {
          years.add(date.getFullYear());
        }
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [receiptData]);

  const filteredReceiptData = useMemo(() => {
    if (!receiptData || receiptData.length === 0) return [];
    return receiptData.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      if (isNaN(orderDate.getTime())) return false;
      const orderMonth = orderDate.getMonth() + 1;
      const orderYear = orderDate.getFullYear();
      return orderMonth === selectedMonth && orderYear === selectedYear;
    });
  }, [receiptData, selectedMonth, selectedYear]);
  console.log(filteredReceiptData);
  const orderStatusData: ReceiptStatusData[] = [
    { name: 'Đang xử lý', value: filteredReceiptData.filter(el => el.status === 'pending').length || 0,  color: '#FFA726' },
    { name: 'Đã duyệt', value: filteredReceiptData.filter(el => el.status === 'confirmed').length || 0, color: '#42A5F5' },
    { name: 'Đã hủy', value: filteredReceiptData.filter(el => el.status === 'cancelled').length || 0, color: '#EF5350' },
  ];

  const totalOrderCount = filteredReceiptData.length || 0;

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const percentage = totalOrderCount > 0 ? ((payload[0].value / totalOrderCount) * 100).toFixed(1) : '0.0';
      return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: `2px solid ${payload[0].payload.color}` }}>
          <Typography variant='body1' sx={{ fontWeight: 600, color: payload[0].payload.color }}>{payload[0].name}</Typography>
          <Typography variant='body1' sx={{ color: 'text.priamry' }}>Số lượng: {payload[0].value} đơn</Typography>
          <Typography variant='body1' sx={{ color: 'text.priamry' }}>Tỷ lệ: {percentage}%</Typography>
        </Paper>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const RADIAN = Math.PI / 180;
    const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 0.5;
    const x = (cx as number) + radius * Math.cos(-midAngle * RADIAN);
    const y =( cy as number) + radius * Math.sin(-midAngle * RADIAN);
    if ((percent as number) * 100 < 5) return null;
    return <text x={x} y={y} fill='white' textAnchor={(x as number) > (cx as number) ? 'start' : 'end'} dominantBaseline='central' fontSize={12} fontWeight='bold' style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{`${((percent as number) * 100).toFixed(1)}%`}</text>;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Thống kê trạng thái phiếu xuất/nhập
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
              labelId='year-select-label'
              value={selectedYear}
              label='Chọn năm'
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {filteredReceiptData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, flexDirection: 'column' }}>
          <Typography variant='h6' color='text.secondary'>Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}</Typography>
          <Typography variant='body1' color='text.secondary'>Vui lòng chọn tháng khác</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1, minHeight: 400 }}>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie data={orderStatusData} cx='50%' cy='50%' labelLine={false} label={renderCustomizedLabel} outerRadius={120} fill='#8884d8' dataKey='value' animationBegin={0} animationDuration={1000}>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
              Tháng {selectedMonth}/{selectedYear}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {orderStatusData.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.6)', transition: 'all 0.3s ease', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.8)', transform: 'translateX(4px)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: item.color }} />
                    <Typography variant='body1' sx={{ fontWeight: 500 }}>{item.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>{item.value} đơn</Typography>
                    <Typography variant='caption' color='text.secondary'>{totalOrderCount > 0 ? ((item.value / totalOrderCount) * 100).toFixed(1) : '0.0'}%</Typography>
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