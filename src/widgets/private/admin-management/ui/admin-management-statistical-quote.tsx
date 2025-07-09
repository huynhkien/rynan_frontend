import {
  Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useState, useMemo } from 'react';
import { CustomQuoteTooltipProps} from '@/features/admin/type/adminType';
import { QuoteData } from '@/features/quote/type/quoteType';

export const AdminManagementStatisticalQuote = ({
  quoteData
}: { quoteData: QuoteData[] }) => {
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        quoteData.forEach(quote => {
        const date = new Date(quote.createdAt as Date);
        if (!isNaN(date.getTime())) {
            years.add(date.getFullYear());
        }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [quoteData]);

    // Luôn hiển thị 12 tháng
    const availableMonths = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => i + 1); 
    }, []);

    // Nhóm dữ liệu theo ngày và đếm số lượng
    const chartData = useMemo(() => {
        if (!quoteData || quoteData.length === 0) return [];
        
        // Lọc dữ liệu theo tháng/năm được chọn
        const filteredQuotes = quoteData.filter(quote => {
            if (!quote.createdAt) return false;
            const quoteDate = new Date(quote.createdAt);
            if (isNaN(quoteDate.getTime())) return false;
            const quoteMonth = quoteDate.getMonth() + 1;
            const quoteYear = quoteDate.getFullYear();
            return quoteMonth === selectedMonth && quoteYear === selectedYear;
        });

        // Nhóm theo ngày và đếm số lượng
        const dailyCount: { [key: string]: number } = {};
        
        filteredQuotes.forEach(quote => {
            const date = new Date(quote.createdAt as Date);
            const day = date.getDate();
            const key = day.toString();
            
            dailyCount[key] = (dailyCount[key] || 0) + 1;
        });

        // Tạo dữ liệu cho tất cả các ngày trong tháng
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const result = [];
        
        for (let day = 1; day <= daysInMonth; day++) {
            result.push({
                day: day,
                count: dailyCount[day.toString()] || 0,
                label: `${day}/${selectedMonth}`,
                displayLabel: `${day}/${selectedMonth}`
            });
        }
        
        return result;
    }, [quoteData, selectedMonth, selectedYear]);

    const CustomTooltip = ({ active, payload, label }: CustomQuoteTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                    <Typography variant='body1' sx={{ fontWeight: 600, mb: 1 }}>
                        Ngày {label}
                    </Typography>
                    {payload.map((item, index) => (
                        <Box key={index}>
                            <Typography>
                                {item.name}: {item.value} phiếu báo giá
                            </Typography>
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
                    Thống kê phiếu báo giá theo ngày trong tháng
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
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

            {chartData.length === 0 || chartData.every(item => item.count === 0) ? (
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
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis
                                dataKey='displayLabel'
                                tick={{ fontSize: 12 }}
                                label={{  position: 'insideBottom', offset: -5 }}
                                interval={0}
                                angle={-45}
                                textAnchor='end'
                                height={60}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Số lượng', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type='monotone'
                                dataKey='count'
                                stroke='#2196F3'
                                strokeWidth={3}
                                dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                                name='Phiếu báo giá'
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Box>
    );
};