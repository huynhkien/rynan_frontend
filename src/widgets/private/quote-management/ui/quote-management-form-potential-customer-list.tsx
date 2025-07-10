'use client'
import React, { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableSortLabel,
  Typography,
  Box,
  Checkbox,
  IconButton,
  Collapse,
} from '@mui/material';
import { Delete, ExitToApp, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { UserData } from '@/features/user/type/userTypes';
import { getAllUser } from '@/features/user/api/userApis';
import moment from 'moment';
import { CustomerGender } from '@/shared/constant/common';
import { OrderData } from '@/features/order/type/orderType';
import { getAllOrder } from '@/features/order/api/orderApi';
import { UserOrderInfoProps, UserProductInfoProps } from '@/features/quote/type/quoteType';

const headCells = [
  { id: 'name', label: 'Tên khách hàng', sortable: true },
  { id: 'gender', label: 'Giới tính', sortable: true },
  { id: 'phone', label: 'SĐT', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'address', label: 'Địa chỉ', sortable: true },
  { id: 'orderProductQuantity', label: 'Đã mua', sortable: true },
  { id: 'orderTotal', label: 'Tổng đơn hàng', sortable: true },
  { id: 'lastOrder', label: 'Mua gần nhất', sortable: true },
  { id: 'createdAt', label: 'Ngày tạo', sortable: false },
  { id: 'lastLoginAt', label: 'Đăng nhập cuối', sortable: false },
];

type SortOrder = 'asc' | 'desc';

export const QuoteManagementFormPotentialCustomerList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [user, setUser] = useState<UserData[] | []>([]);
  const [order, setOrder] = useState<OrderData[] | []>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterAlpha, setFilterAlpha] = useState<string>('all');
  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const theme = useTheme();

  const fetchAllUser = async () => {
    const response = await getAllUser();
    if (response.success) setUser(response?.data || []);
  }

  const fetchOrders = async () => {
    const response = await getAllOrder();
    if (response.success) setOrder(response.data || []);
  }

  useEffect(() => {
    fetchAllUser();
    fetchOrders();
  }, []);

  // Hiển thị dropdown
  const toggleRow = (id: string) => {
    setOpenRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Tìm kiếm thông tin khách hàng đã mua hàng
  const potentialCustomer = useMemo(() => {
    const userOrderInfo: UserOrderInfoProps[] = [];
    for (let i = 0; i < user.length; i++) {
      const userData = user[i];
      const userOrder = order.filter(el => el.orderBy === userData._id);
      if (userOrder.length > 0) {
        const orderProductQuantity = userOrder.reduce((total, data) => {
          return total + data.products.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);

        const userProductInfo: UserProductInfoProps[] = [];
        userOrder.forEach(data => {
          data.products.forEach(product => {
            if (!userProductInfo.find(el => el.pid === product.pid)) {
              userProductInfo.push({
                pid: product.pid as string,
                name: product.name,
                totalQuantity: userOrder.reduce((sum, item) => {
                  const productInOrder = item.products?.find(p => p.pid === product.pid);
                  return sum + (productInOrder?.quantity || 0);
                }, 0)
              })
            }
          });
        });

        const orderTotal = userOrder.reduce((sum, item) => sum + item.total, 0);
        const lastOrder = userOrder.reduce((latest, orderData) => {
          const orderDate = new Date(orderData.createdAt as Date);
          return orderDate > latest ? orderDate : latest;
        }, new Date(userOrder[0].createdAt as Date));

        userOrderInfo.push({
          id: userData._id,
          name: userData.name,
          email: userData.email as string || '',
          phone: userData.phone || '',
          gender: userData.gender || '',
          address: userData?.address?.detail || '',
          orderProductQuantity: orderProductQuantity,
          userProductInfo: userProductInfo,
          orderTotal: orderTotal,
          lastOrder: lastOrder,
          createdAt: userData.createdAt || '',
        });
      }
    }
    return userOrderInfo;
  }, [user, order]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handleAllCheckbox = () => {
    if (selectedItems.length === potentialCustomer.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(potentialCustomer.map(el => el.id));
    }
  }

  const handleCheckbox = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id)
      } else {
        return [...prev, id];
      }
    });
  }

  const isAllSelected = selectedItems.length === potentialCustomer.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < potentialCustomer.length;

  const filteredAndSortedData = useMemo(() => {
    const filtered = potentialCustomer.filter(item => {
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAlpha = filterAlpha === 'all' || item.name?.toLowerCase().startsWith(filterAlpha.toLowerCase());
      return matchesSearch && matchesAlpha;
    });

    if (sortBy && headCells.find(cell => cell.id === sortBy)?.sortable) {
      filtered.sort((a, b) => {
        const aValue = a[sortBy as keyof typeof a];
        const bValue = b[sortBy as keyof typeof b];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue, 'vi');
          return sortOrder === 'asc' ? comparison : -comparison;
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortBy, sortOrder, potentialCustomer, filterAlpha]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Toolbar */}
      <Paper sx={{ mb: 2, p: 2, borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Box>
            <Typography variant='h6' sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
              Thông tin khách hàng tiềm năng
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isIndeterminate && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: theme.palette.text.secondary, cursor: 'pointer' }}>
                <Box sx={{ p: 1, backgroundColor: theme.palette.error.main, display: 'flex', alignItems: 'center' }}>
                  <Delete sx={{ fontSize: theme.typography.fontSize }} /> Xóa tất cả
                </Box>
                <Box sx={{ p: 1, backgroundColor: theme.palette.info.main, display: 'flex', alignItems: 'center' }}>
                  <ExitToApp sx={{ fontSize: theme.typography.fontSize }} /> Xuất dữ liệu
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label='Tìm kiếm khách hàng'
              variant='outlined'
              size='small'
              sx={{
                color: '#000',
                '& .MuiOutlinedInput-input': { color: '#000' },
                '& .MuiInputLabel-root': { color: '#000' },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Nhập tên khách hàng...'
            />
            <FormControl fullWidth size='small' sx={{
              '& .MuiInputLabel-root': { color: '#000' },
              '& .MuiSelect-select': { color: '#000' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
              width: '200px'
            }}>
              <InputLabel>Lọc theo chữ cái</InputLabel>
              <Select label='Lọc theo chữ cái' value={filterAlpha} onChange={(e) => setFilterAlpha(e.target.value)}>
                <MenuItem value='all'>Tất cả</MenuItem>
                {alphabet.map((letter) => (
                  <MenuItem key={letter} value={letter}>{letter}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography variant='body1' sx={{ mt: 1 }}>
              Hiển thị: {filteredAndSortedData.length} khách hàng
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
        <TableContainer sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main, fontWeight: theme.typography.fontWeightBold }}>
                <TableCell padding='checkbox'>
                  <Checkbox
                    sx={{ '&.Mui-checked': { color: 'text.secondary' } }}
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleAllCheckbox}
                  />
                </TableCell>
                {headCells.map((headCell, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 'bold',
                      fontSize: theme.typography.body1.fontSize
                    }}
                  >
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={sortBy === headCell.id}
                        direction={sortBy === headCell.id ? sortOrder : 'asc'}
                        onClick={() => handleSort(headCell.id)}
                        sx={{
                          color: theme.palette.text.secondary + ' !important',
                          '&:hover': { color: theme.palette.text.primary + ' !important' }
                        }}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align='center' sx={{ py: 4 }}>
                    {searchTerm ? 'Không tìm thấy khách hàng nào' : 'Danh sách trống'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <React.Fragment key={item.id}>
                      <TableRow hover>
                        <TableCell padding='checkbox'>
                          <IconButton
                            aria-label='expand row'
                            size='small'
                            onClick={() => toggleRow(item.id)}
                          >
                            {openRows[item.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          </IconButton>
                          <Checkbox
                            color='primary'
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleCheckbox(item.id)}
                          />
                        </TableCell>
                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{item.name}</TableCell>
                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{CustomerGender.find(el => el._id === item.gender)?.name}</TableCell>
                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{item.phone}</TableCell>
                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{item.email}</TableCell>
                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{item.address}</TableCell>
                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{item.orderProductQuantity}</TableCell>
                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{item.orderTotal?.toLocaleString('vi-VN')} VND</TableCell>
                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{moment(item.lastOrder).format('DD/MM/YYYY')}</TableCell>
                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{moment(item.createdAt).format('DD/MM/YYYY')}</TableCell>
                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headCells.length + 1}>
                          <Collapse in={openRows[item.id]} timeout='auto' unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Typography variant='body2' gutterBottom component='div'>
                                Thông tin sản phẩm đã mua
                              </Typography>
                              <Table size='small' >
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Tên sản phẩm</TableCell>
                                    <TableCell align='right' sx={{fontSize: theme.typography.body1.fontSize}}>Số lượng đã mua</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item.userProductInfo?.map((product) => (
                                    <TableRow key={product.pid}>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{product.name}</TableCell>
                                      <TableCell align='right' sx={{fontSize: theme.typography.body1.fontSize}}>{product.totalQuantity}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          count={filteredAndSortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Số hàng mỗi trang:'
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
};