import {
  Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useState, useMemo } from 'react';
import { ReceiptData } from '@/features/receipt/type/receiptType';
import { CustomReceiptTooltipProps, MonthlyReceiptData } from '@/features/admin/type/adminType';

export const AdminManagementStatisticalReceipt = ({
  receiptData
}: { receiptData: ReceiptData[] }) => {
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [chartType, setChartType] = useState<'count' | 'amount' | 'quantity'>('count');
    const [chartStatus, setChartStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        receiptData.forEach(receipt => {
        const date = new Date(receipt.createdAt as Date);
        if (!isNaN(date.getTime())) {
            years.add(date.getFullYear());
        }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [receiptData]);

    // Luôn hiển thị 12 tháng
    const availableMonths = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => i + 1); 
    }, []);
    const dailyData = useMemo(() => {
        const filteredData = receiptData.filter(receipt => {
        const date = new Date(receipt.createdAt as Date);
        return (
            !isNaN(date.getTime()) &&
            date.getFullYear() === selectedYear &&
            date.getMonth() + 1 === selectedMonth
        );
        });

        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const dailyStats: { [key: string]: MonthlyReceiptData } = {};

        for (let i = 1; i <= daysInMonth; i++) {
        const key = `${i.toString().padStart(2, '0')}/${selectedMonth.toString().padStart(2, '0')}`;
        dailyStats[key] = {
            month: key,
            importPendingCount: 0,
            importPendingTotal: 0,
            importPendingQuantity: 0,
            exportPendingCount: 0,
            exportPendingTotal: 0,
            exportPendingQuantity: 0,
            importConfirmedCount: 0,
            importConfirmedTotal: 0,
            importConfirmedQuantity: 0,
            exportConfirmedCount: 0,
            exportConfirmedTotal: 0,
            exportConfirmedQuantity: 0,
            importCancelledCount: 0,
            importCancelledTotal: 0,
            importCancelledQuantity: 0,
            exportCancelledCount: 0,
            exportCancelledTotal: 0,
            exportCancelledQuantity: 0,
        };
        }

        filteredData.forEach(receipt => {
        const date = new Date(receipt.createdAt as Date);
        const dayKey = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const quantityMaterial = receipt.materials && receipt.materials.length > 0 ? receipt.materials.reduce((sum, item) => sum + item.quantity, 0) : 0;
        const quantityProduct = receipt.products && receipt.products.length > 0 ? receipt.products.reduce((sum, item) => sum + item.quantity, 0) : 0;
        if (dailyStats[dayKey]) {
            if (receipt.typeReceipt === 'import') {
                if(receipt.status === 'pending'){
                    dailyStats[dayKey].importPendingCount++;
                    dailyStats[dayKey].importPendingTotal += receipt.total || 0;
                    dailyStats[dayKey].importPendingQuantity += quantityMaterial || quantityProduct;
                }else if (receipt.status === 'confirmed'){
                    dailyStats[dayKey].importConfirmedCount++;
                    dailyStats[dayKey].importConfirmedTotal += receipt.total || 0;
                    dailyStats[dayKey].importConfirmedQuantity += quantityMaterial || quantityProduct;
                }else{
                    dailyStats[dayKey].importCancelledCount++;
                    dailyStats[dayKey].importCancelledTotal += receipt.total || 0;
                    dailyStats[dayKey].importCancelledQuantity += quantityMaterial || quantityProduct;
                }
            } else if (receipt.typeReceipt === 'export') {
                if(receipt.status === 'pending'){
                    dailyStats[dayKey].exportPendingCount++;
                    dailyStats[dayKey].exportPendingTotal += receipt.total || 0;
                    dailyStats[dayKey].exportPendingQuantity += quantityMaterial || quantityProduct;
                }else if (receipt.status === 'confirmed'){
                    dailyStats[dayKey].exportConfirmedCount++;
                    dailyStats[dayKey].exportConfirmedTotal += receipt.total || 0;
                    dailyStats[dayKey].exportConfirmedQuantity += quantityMaterial || quantityProduct;
                }else{
                    dailyStats[dayKey].exportCancelledCount++;
                    dailyStats[dayKey].exportCancelledTotal += receipt.total || 0;
                    dailyStats[dayKey].exportCancelledQuantity += quantityMaterial || quantityProduct;
                }
            }
        }
        });

        return Object.values(dailyStats);
    }, [receiptData, selectedYear, selectedMonth]);
    const getDataKey = (type: 'import' | 'export') => {
        if (chartType === 'count' && chartStatus === 'pending') return type === 'import' ? 'importPendingCount' : 'exportPendingCount';
        if (chartType === 'amount' && chartStatus === 'pending') return type === 'import' ? 'importPendingTotal' : 'exportPendingTotal';
        if (chartType === 'quantity' && chartStatus === 'pending') return type === 'import' ? 'importPendingQuantity' : 'exportPendingQuantity';
        if (chartType === 'count' && chartStatus === 'confirmed') return type === 'import' ? 'importConfirmedCount' : 'exportConfirmedCount';
        if (chartType === 'amount' && chartStatus === 'confirmed') return type === 'import' ? 'importConfirmedTotal' : 'exportConfirmedTotal';
        if (chartType === 'quantity' && chartStatus === 'confirmed') return type === 'import' ? 'importConfirmedQuantity' : 'exportConfirmedQuantity';
        if (chartType === 'count' && chartStatus === 'cancelled') return type === 'import' ? 'importCancelledCount' : 'exportCancelledCount';
        if (chartType === 'amount' && chartStatus === 'cancelled') return type === 'import' ? 'importCancelledTotal' : 'exportCancelledTotal';
        if (chartType === 'quantity' && chartStatus === 'cancelled') return type === 'import' ? 'importCancelledQuantity' : 'exportCancelledQuantity';
    }
    const CustomTooltip = ({ active, payload, label }: CustomReceiptTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant='body1' sx={{ fontWeight: 600, mb: 1 }}>
            Ngày {label}
          </Typography>
          {payload.map((item, index) => (
            <Box key={index}>
              {item.name as string}: {
                chartType === 'count'
                  ? `${item.value} phiếu`
                  : chartType === 'amount'
                  ? `${(item.value as number).toLocaleString()} VNĐ`
                  : `${item.value} sản phẩm`
              }
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };
return (
    <Box sx={{ p: 3 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant='h5' component='h2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Thống kê phiếu nhập/xuất theo ngày trong tháng
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel id='chart-type-label'>Loại biểu đồ</InputLabel>
            <Select
              labelId='chart-type-label'
              value={chartType}
              label='Loại biểu đồ'
              onChange={(e) => setChartType(e.target.value as 'count' | 'amount' | 'quantity')}
            >
              <MenuItem value='count'>Số lượng phiếu</MenuItem>
              <MenuItem value='amount'>Giá trị tiền</MenuItem>
              <MenuItem value='quantity'>Số lượng</MenuItem>
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel id='chart-type-label'>Loại biểu đồ</InputLabel>
            <Select
              labelId='chart-type-label'
              value={chartStatus}
              label='Loại biểu đồ'
              onChange={(e) => setChartStatus(e.target.value as 'pending' | 'confirmed' | 'cancelled')}
            >
              <MenuItem value='pending'>Chờ xử lý</MenuItem>
              <MenuItem value='confirmed'>Đã duyệt</MenuItem>
              <MenuItem value='cancelled'>Đã hủy</MenuItem>
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel id='month-select-label'>Chọn tháng</InputLabel>
            <Select
              labelId='month-select-label'
              value={selectedMonth}
              label='Chọn tháng'
              onChange={(e) => setSelectedMonth(e.target.value as number)}
            >
              {availableMonths.map((month) => (
                <MenuItem key={month} value={month}>Tháng {month}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel id='year-select-label'>Chọn năm</InputLabel>
            <Select
              labelId='year-select-label'
              value={selectedYear}
              label='Chọn năm'
              onChange={(e) => {
                setSelectedYear(e.target.value as number);
              }}
              disabled={availableYears.length === 0}
            >
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>

        </Box>
      </Box>

      {dailyData.length === 0 ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
          flexDirection: 'column'
        }}>
          <Typography variant='h6' color='text.secondary'>
            Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Vui lòng chọn tháng khác
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 500, pt: 2 }}>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={dailyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='month'
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor='end'
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  chartType === 'amount' ? `${(value / 1_000_000).toFixed(0)}M` : value
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type='monotone'
                dataKey={getDataKey('import')}
                stroke='#2196F3'
                strokeWidth={3}
                dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name='Phiếu nhập'
              />
              <Line
                type='monotone'
                dataKey={getDataKey('export')}
                stroke='#FF9800'
                strokeWidth={3}
                dot={{ fill: '#FF9800', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name='Phiếu xuất'
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};
