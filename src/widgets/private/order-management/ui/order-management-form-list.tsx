'use client'
import React, { useState, useMemo,  useEffect } from 'react';
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
  Checkbox,
  Dialog,
} from '@mui/material';
import { Add,   Cancel,   Delete, Edit, ExitToApp } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {  OrderStatus, PaymentMethods, PaymentStatuses } from '@/shared/constant/common';
import { OrderData } from '@/features/order/type/orderType';
import { deleteOrder, getAllOrder, getOrderById } from '@/features/order/api/orderApi';
import moment from 'moment';
import { OrderProductItem, UserData } from '@/features/user/type/userTypes';
import { getAllUser, getUserById } from '@/features/user/api/userApis';
import { OrderManagementFormListProduct } from './order-management-form-list-product';
import { OrderManagementFormListUser } from './order-management-form-list-user';

const headCells = [
  { id: 'code', label: 'Mã đơn hàng', sortable: true },
  { id: 'createdAt', label: 'Ngày tạo', sortable: true },
  { id: 'status', label: 'Trạng thái', sortable: true },
  { id: 'products', label: 'Sản phẩm', sortable: true },
  { id: 'orderBy', label: 'Khách hàng', sortable: true },
  { id: 'paymentStatus', label: 'Trạng thái thanh toán', sortable: true },
  { id: 'paymentMethod', label: 'Hình thức thanh toán', sortable: true },
  { id: 'expectedDeliveryDate', label: 'Hạn thanh toán', sortable: true },
  { id: 'actions', label: 'Thao tác', sortable: false },

];

type SortOrder = 'asc' | 'desc';

export const OrderManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orders, setOrders] = useState<OrderData[] | []>([]);
    const [order, setOrder] = useState<OrderData>();
    const [users, setUsers] = useState<UserData[] | []>([]);
    const [user, setUser] = useState<UserData>();
    const [isShowProduct, setIsShowProduct] = useState<string| null>(null);
    const [quoteId, setQuoteId] = useState<string | null>(null);
    const [isShowUser, setIsShowUser] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const theme = useTheme();
    
    // hiển thị tất cả đơn hàng
    const fetchAllOrder = async () => {
        const response = await getAllOrder();
        if(response.success) {
          setOrders(response.data || []);
        }
    }
    const fetchUsers = async () => {
        const response = await getAllUser();
        if(response.success) setUsers(response.data);
    }
    useEffect(() => {
      fetchAllOrder();
      fetchUsers();
    },[]);
    useEffect(() => {
        const fetchUser = async () => {
            if(!isShowUser) return;
            const response = await getUserById(isShowUser as string);
            if(response.success) setUser(response.data);
        }
        fetchUser();
    }, [isShowUser])
    // Hiển thị chi tiết đơn hàng
    useEffect(() => {
        if(!isShowProduct) return;
        const fetchOrder = async () => {
            const response = await getOrderById(isShowProduct as string);
            if(response.data) setOrder(response.data)
        }
        fetchOrder()
    },[isShowProduct]);
    
    // xóa đơn hàng
    const handleDelete = async(id: string) => {
      try{
        if (window.confirm('Bạn có chắc muốn xóa đơn hàng không?')) {
          const response = await deleteOrder(id);
          if(response.success) {
            toast.success(response.message);
            fetchAllOrder();
            return;
          }else{
            toast.error(response.message);
            fetchAllOrder();
          }
        }
      }catch(error: unknown){
        toast.error(`Lỗi: ${error}`);
        fetchAllOrder();
      }
    };

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
    
    // click chọn tất cả
    const handleAllCheckbox = () => {
        if(selectedItems.length === orders.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(orders.map(el => (el._id as string)));
        }
    }
    
    // click chọn từng item
    const handleCheckbox = (id: string) => {
        setSelectedItems(prev => {
            if(prev.includes(id)){
                return prev.filter(item => item !== id)
            }else{
                return [...prev, id];
            }
        });
    }
    
    // Kiểm tra trạng thái checkbox "Chọn tất cả"
    const isAllSelected = selectedItems.length === orders.length && orders.length > 0;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length < orders.length;

    const filteredAndSortedData = useMemo(() => {
      const filtered = orders.filter(item => {
        const matchesSearch =
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          OrderStatus.find((el) => el._id === item.status)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          users.find((el) => el._id === item.orderBy)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          PaymentStatuses.find((el) => el._id === item.paymentStatus)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          PaymentMethods.find((el) => el._id === item.paymentMethod)?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAlpha =
          filterAlpha === 'all' ||
          item.code.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
          OrderStatus.find((el) => el._id === item.status)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          users.find((el) => el._id === item.orderBy)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    }, [searchTerm, sortBy, sortOrder, orders, filterAlpha, users]);
    // Đóng dialog
    const handleCloseDialog = async () => {
        if(isShowUser){
            setIsShowUser(null);
        }else{
            setIsShowProduct(null);
        }
    }
return (
    <Box sx={{ width: '100%' }}>
      {/* Toolbar với tìm kiếm và filter */}
      <Paper sx={{ mb: 2, p: 2, borderRadius: 0, backgroundColor: theme.palette.background.default }}>
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
          <Box
            sx={{display: 'flex', gap: 2}}
          >
            <Box sx={{p: 1, backgroundColor: theme.palette.primary.main}}>
                <Link href='/admin/order-management/add' style={{textDecoration: 'none', display: 'flex', alignItems: 'center',  color: theme.palette.text.secondary, cursor: 'pointer' }}>
                    <Add sx={{fontSize: theme.typography.fontSize}}/> Thêm đơn hàng mới
                </Link>
            </Box>
            {isIndeterminate && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: theme.palette.text.secondary,  cursor: 'pointer' }}>
                    <Box sx={{p: 1, backgroundColor: theme.palette.error.main, display: 'flex', alignItems: 'center'}}><Delete sx={{fontSize: theme.typography.fontSize}}/> Xóa tất cả</Box>
                    <Box sx={{p: 1, backgroundColor: theme.palette.info.main, display: 'flex', alignItems: 'center'}}><ExitToApp sx={{fontSize: theme.typography.fontSize}}/> Xuất dữ liệu</Box>
                </Box>
            )}
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

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 0, backgroundColor: theme.palette.background.default }}>
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
                <TableCell padding='checkbox'>
                    <Checkbox
                        sx={{
                            '&.Mui-checked': {
                            color: 'text.secondary',
                            }
                        }}
                        inputProps={{
                        'aria-label': 'select all desserts',
                        }}
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
                    <TableRow key={item._id} hover>
                        <TableCell padding='checkbox'>
                            <Checkbox
                                color='primary'
                                checked={selectedItems.includes(item._id as string)}
                                onChange={() => handleCheckbox(item._id as string)}
                                inputProps={{
                                'aria-label': 'select all desserts',
                                }}
                            />
                        </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
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
                      <TableCell 
                        sx={{ 
                            verticalAlign: 'middle', 
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover
                            }
                          }} 
                          onClick={() => setIsShowUser(item.orderBy as string)}
                      >
                        <Typography variant='body1'>
                          {users.find((el) => el._id === item.orderBy)?.name}
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
                      <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                color='success'
                                aria-label={`Sửa ${item.name_vn}`}
                                size='small'
                                onClick={() => setQuoteId(item._id as string)}
                            >
                                <Link href={`/admin/order-management/edit/${item._id}`} style={{color: theme.palette.success.main}}>
                                  <Edit/>
                                </Link>
                            </IconButton>
                            <IconButton 
                                onClick={() => handleDelete(item._id as string)} 
                                color='error'
                                aria-label={`Xóa ${item.name_vn}`}
                                size='small'
                            >
                                <Delete />
                            </IconButton>
                      </TableCell>
                    </TableRow>
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
        open={isShowProduct !==null || isShowUser !==null}
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
                    borderRadius: 0
                },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Typography onClick={handleCloseDialog} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
          {isShowProduct && <OrderManagementFormListProduct orderProduct={order?.products as OrderProductItem[]} id={quoteId as string}/>}
          {isShowUser && <OrderManagementFormListUser user={user as UserData}/>}
        </Box>
      </Dialog>
    </Box>
  );
};