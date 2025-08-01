'use client'
import React, { useState, useMemo,  useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; 
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  useTheme,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableSortLabel,
  Typography,
  Box,
  Dialog,
  Collapse,
} from '@mui/material';
import {  Cancel, KeyboardArrowDown, KeyboardArrowUp, LibraryAddCheck } from '@mui/icons-material';
import {  OrderStatus,  PaymentMethods, PaymentStatuses } from '@/shared/constant/common';
import { OrderData } from '@/features/order/type/orderType';
import {  getAllOrder, getOrderById } from '@/features/order/api/orderApi';
import moment from 'moment';
import { OrderProductItem} from '@/features/user/type/userTypes';
import { OrderManagementFormListProduct } from '../../order-management/ui/order-management-form-list-product';
import { useAppSelector } from '@/shared/hooks/useAppHook';
import { UserOrderManagementFormEdit } from './user-order-management-form-edit';

const headCells = [
  { id: 'code', label: 'Mã đơn hàng', sortable: true },
  { id: 'createdAt', label: 'Ngày tạo', sortable: true },
  { id: 'status', label: 'Trạng thái', sortable: true },
  { id: 'products', label: 'Sản phẩm', sortable: true },
  { id: 'paymentStatus', label: 'Trạng thái thanh toán', sortable: true },
  { id: 'paymentMethod', label: 'Hình thức thanh toán', sortable: true },
  { id: 'expectedDeliveryDate', label: 'Hạn thanh toán', sortable: true }, 
  { id: 'total', label: 'Tổng tiền', sortable: true }, 
  { id: 'actions', label: 'Thao tác', sortable: false },

];

type SortOrder = 'asc' | 'desc';

export const UserOrderManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {current} = useAppSelector(state => state.user);
    const [orders, setOrders] = useState<OrderData[] | []>([]);
    const [order, setOrder] = useState<OrderData>();
    const [isShowProduct, setIsShowProduct] = useState<string| null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const Icon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png', 
      iconSize: [32, 32], 
      iconAnchor: [16, 32], 
      popupAnchor: [0, -32], 
    });
    const theme = useTheme();
    // Hiển thị dropdown
    const toggleRow = (_id: string) => {
      setOpenRows(prev => ({
        ...prev,
        [_id]: !prev[_id]
      }));
    };
    // hiển thị tất cả đơn hàng
    const fetchAllOrder = useCallback(async () => {
    if(!current) return;
    const response = await getAllOrder();
    if(response.success) {
        setOrders(response.data?.filter(el => el.orderBy === current?._id) || []);
    }
  }, [current]);
  useEffect(() => {
      fetchAllOrder();
  }, [fetchAllOrder]); 
    // Hiển thị chi tiết đơn hàng
    useEffect(() => {
        if(!isShowProduct) return;
        const fetchOrder = async () => {
            const response = await getOrderById(isShowProduct as string);
            if(response.data) setOrder(response.data)
        }
        fetchOrder()
    },[isShowProduct]);
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
    
    const filteredAndSortedData = useMemo(() => {
      const filtered = orders.filter(item => {
        const matchesSearch =
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          OrderStatus.find((el) => el._id === item.status)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          PaymentStatuses.find((el) => el._id === item.paymentStatus)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          PaymentMethods.find((el) => el._id === item.paymentMethod)?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAlpha =
          filterAlpha === 'all' ||
          item.code.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
          OrderStatus.find((el) => el._id === item.status)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          PaymentStatuses.find((el) => el._id === item.paymentStatus)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          PaymentMethods.find((el) => el._id === item.paymentMethod)?.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && matchesAlpha ;
      });

      // Sắp xếp theo field (nếu có)
      if (sortBy && headCells.find(cell => cell.id === sortBy)?.sortable) {
        filtered.sort((a, b) => {
          const aValue = a[sortBy as keyof typeof a];
          const bValue = b[sortBy as keyof typeof b];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            const comparison = aValue.localeCompare(bValue, 'vi');
            return sortOrder === 'asc' ? comparison : -comparison;
          }
          
          // Xử lý trường hợp number
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          }

          return 0;
        });
      }

      return filtered;
    }, [searchTerm, sortBy, sortOrder, orders, filterAlpha]);
    // Đóng dialog
    const handleCloseDialog = async () => {
        if(orderId){
          setOrderId(null);
        }else {
            setIsShowProduct(null);
        }
    }
return (
    <Box sx={{ width: '100%' }}>
      {/* Toolbar với tìm kiếm và filter */}
      <Paper sx={{ mb: 2, p: 2, borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 2
            }}>
          <Box>
            <Typography variant='h6' sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
            Quản lý đơn hàng
          </Typography>
          </Box>
        </Box>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                
            }}
        >
          <Box sx={{display: 'flex', gap: 2}}>
            <Box >
                <TextField
                    fullWidth
                    label='Tìm kiếm thông tin đơn hàng'
                    variant='outlined'
                    size='small'
                     sx={{
                        color: '#000',
                        '& .MuiOutlinedInput-input': { color: '#000' }, 
                        '& .MuiInputLabel-root': { color: '#000' },     
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#000',
                        },
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Nhập tên, mô tả...'
                />
            </Box>
            <Box>
                <FormControl fullWidth size='small' sx={{ 
                '& .MuiInputLabel-root': { color: '#000' }, 
                '& .MuiSelect-select': { color: '#000' }, 
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
                width: '200px'
                }}>
                <InputLabel>Lọc theo chữ cái</InputLabel>
                <Select
                    value={filterAlpha}
                    label='Lọc theo chữ cái'
                    onChange={(e) => setFilterAlpha(e.target.value)}
                >
                    <MenuItem value='all'>Tất cả</MenuItem>
                    {alphabet.map((letter) => (
                      <MenuItem key={letter} value={letter}>{letter}</MenuItem>
                    ))}
                </Select>
                </FormControl>
            </Box>
          </Box>
          <Box>
            <Typography variant='body1' sx={{ mt: 1 }}>
              Hiển thị: {filteredAndSortedData.length} đơn hàng
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
        <TableContainer sx={{ 
          '&::-webkit-scrollbar': {
            display: 'none'
          },
        
        }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >

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
                          '&:hover': {
                            color: theme.palette.text.primary + ' !important'
                          }
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
                  <TableCell colSpan={10} align='center' sx={{ py: 4 }}>
                    {searchTerm || filterAlpha !== 'all' ? 'Không tìm thấy đơn hàng nào' : 'Danh sách trống'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <React.Fragment key={item._id}>
                      <TableRow  hover>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300, display: 'flex' }}>
                          <IconButton
                              aria-label='expand row'
                              size='small'
                              onClick={() => toggleRow(item._id as string)}
                            >
                              {openRows[item._id as string] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          </IconButton>
                          <Typography variant='body1' noWrap>
                            {item.code}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 250 }}>
                          <Typography variant='body1'>
                            {moment(item.createdAt).format('DD/MM/YY HH:mm:ss')}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 250 }}>
                          <Typography variant='body1'>
                            {OrderStatus.find((el) => el._id === item.status)?.name}
                          </Typography>
                        </TableCell>
                        <TableCell 
                            sx={{ 
                              verticalAlign: 'middle', 
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover
                              }
                            }} 
                            onClick={() => setIsShowProduct(item._id as string)}
                          >
                            <Typography variant='body1'>
                              {item.products?.length || 0} sản phẩm
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 250 }}>
                          <Typography variant='body1'>
                            {PaymentStatuses.find((el) => el._id === item.paymentStatus)?.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 250 }}>
                          <Typography variant='body1'>
                            {PaymentMethods.find((el) => el._id === item.paymentMethod)?.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 250 }}>
                          <Typography variant='body1'>
                            {moment(item.paymentDueDate).format('DD/MM/YYYY')}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 250 }}>
                          <Typography variant='body1'>
                            {item.total === 0 ? 'Chủ cửa hàng đã hoàn trả tiền vào tài khoản' : `${item.total.toLocaleString} VNĐ`} 
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {/* Hành động */}
                          <IconButton 
                              color='success'
                              aria-label={`Sửa ${item.name_vn}`}
                              size='small'
                              onClick={() => setOrderId(item._id as string)}
                          >
                                <LibraryAddCheck/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headCells.length + 1} >
                            <Collapse in={openRows[item._id as string]} timeout='auto' unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                <Typography variant='body2' gutterBottom component='div'>
                                  Ví trí đơn hàng
                                </Typography>
                                {
                                  item.location?.lat ?
                                  <Box sx={{ mt: 2 }}>
                                  <MapContainer center={[item?.location?.lat, item?.location?.lng]} zoom={13} style={{ height: '500px', width: '100%' }}>
                                      <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                      />
                                      <Marker position={[item?.location?.lat, item?.location?.lng]} icon={Icon}>
                                        <Popup>Vị trí của đơn hàng</Popup>
                                      </Marker>
                                  </MapContainer>
                                </Box>
                                :
                                'Chưa có thông tin về vị trí đơn hàng'
                                }
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
      {/* Dialog hiển thị sản phẩm */}
      <Dialog
        open={isShowProduct !==null || orderId !==null}
        onClose={handleCloseDialog}
        aria-labelledby="product-dialog-title"
        aria-describedby="product-dialog-description"
        maxWidth="lg"
        fullWidth
        PaperProps={{
                style: {
                    width: '50%',
                    height: '50%',
                    maxWidth: '1000px',
                    position: 'relative',
                    borderRadius: 0,
                    backgroundColor: theme.palette.text.secondary
                },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Typography onClick={handleCloseDialog} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
          {isShowProduct && <OrderManagementFormListProduct orderProduct={order?.products as OrderProductItem[]} action='show'/>}
          {orderId && <UserOrderManagementFormEdit orderId={orderId} render={fetchAllOrder}/>}
        </Box>
      </Dialog>
    </Box>
  );
};