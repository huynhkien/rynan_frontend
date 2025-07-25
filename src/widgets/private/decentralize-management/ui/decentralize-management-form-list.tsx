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
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { UserData} from '@/features/user/type/userTypes';
import { deleteUser, deleteUsers, getAllUser } from '@/features/user/api/userApis';
import Link from 'next/link';
import moment from 'moment';
import { CustomerGender } from '@/shared/constant/common';
import { useAppDispatch } from '@/shared/hooks/useAppHook';
import { showModal } from '@/shared/store/appSlice';
import { DecentralizeManagementFormExport } from './decentralize-management-form-export';

const headCells = [
  { id: 'code', label: 'ID nhân viên hàng', sortable: true },
  { id: 'name', label: 'Tên nhân viên hàng', sortable: true },
  { id: 'gender', label: 'Giới tính', sortable: true },
  { id: 'role', label: 'Vai trò', sortable: true },
  { id: 'phone', label: 'SĐT', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'address', label: 'Địa chỉ', sortable: true },
  { id: 'createdAt', label: 'Ngày tạo', sortable: false },
  { id: 'type', label: 'Loại nhân viên', sortable: false },
  { id: 'lastLoginAt', label: 'Đăng nhập cuối', sortable: false },
  { id: 'actions', label: 'Thao tác', sortable: false }

];

type SortOrder = 'asc' | 'desc';

export const DecentralizeManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [user, setUser] = useState<UserData[] | []>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const fetchAllUser = async () => {
        const response = await getAllUser();
        if(response.success) {
          setUser(response?.data.filter(el => ['2002', '2004', '2006'].includes(el.role as string)) || []);
        }
      }

    // hiển thị tất cả nhân viên
    useEffect(() => {
      fetchAllUser();
    },[]);
    // xóa nhân viên
    const handleDelete = async(id: string) => {
      try{
        if(window.confirm('Bạn có chắc muốn xóa nhân viên không?')){
          dispatch(showModal({ isShowModal: true, modalType: 'loading' }))
          const response = await deleteUser(id);
          if(response.success) {
            dispatch(showModal({ isShowModal: false, modalType: null }))
            toast.success(response.message);
            fetchAllUser();
            return;
          }
        }
      }catch(error: unknown){
        dispatch(showModal({ isShowModal: false, modalType: null }))
        toast.error(`Lỗi: ${error}`);
        fetchAllUser();
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
        if(selectedItems.length === user.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(user.map(el => el._id));
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
    const isAllSelected = selectedItems.length === user.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length <= user.length;

    const filteredAndSortedData = useMemo(() => {
    const filtered = user.filter(item => {
      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase());
        

      const matchesAlpha =
        filterAlpha === 'all' ||
        item.name?.toLowerCase().startsWith(filterAlpha.toLowerCase());

      return matchesSearch && matchesAlpha;
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

        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortBy, sortOrder, user, filterAlpha]);
   const handleDeleteUsers = async() => {
      try{
         if(window.confirm('Bạn có chắc muốn xóa nhân viên không?')){
          dispatch(showModal({ isShowModal: true, modalType: 'loading' }))
          const response = await deleteUsers(selectedItems);
          if(response.success) {
            dispatch(showModal({ isShowModal: false, modalType: null }))
            toast.success(response.message);
            setSelectedItems([]);
            fetchAllUser();
          }
        }
        }catch(error: unknown){
          dispatch(showModal({ isShowModal: false, modalType: null }))
          const errorMessage = (error as Error).message;
          toast.error(errorMessage);
        }
      }
  // Hiển thi người dùng theo selectId
  const getSelectedUsers = useMemo(() => {
    if (!selectedItems.length || !user.length) return [];
    return user.filter(item => selectedItems.includes(item._id));
  }, [selectedItems, user]);
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
            Quản lý thông tin nhân viên
          </Typography>
          </Box>
          <Box
            sx={{display: 'flex', gap: 2}}
          >
            <Box sx={{p: 1, backgroundColor: theme.palette.primary.main}}>
                <Link href='/admin/decentralize-management/add' style={{textDecoration: 'none', display: 'flex', alignItems: 'center',  color: theme.palette.text.secondary, cursor: 'pointer' }}>
                    <Add sx={{fontSize: theme.typography.fontSize}}/> Thêm thông tin nhân viên
                </Link>
            </Box>
            {isIndeterminate && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: theme.palette.text.secondary,  cursor: 'pointer' }}>
                    <Box onClick={handleDeleteUsers} sx={{p: 1, backgroundColor: theme.palette.error.main, display: 'flex', alignItems: 'center'}}><Delete sx={{fontSize: theme.typography.fontSize}}/> Xóa tất cả</Box>
                    <Box sx={{p: 1, backgroundColor: theme.palette.info.main, display: 'flex', alignItems: 'center'}}><DecentralizeManagementFormExport users={getSelectedUsers} /></Box>
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
                    label='Tìm kiếm sản phẩm'
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
                    placeholder='Nhập tên, mô tả hoặc slug...'
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
                    label='Lọc theo cữ cái'
                >
                    <MenuItem value='all' onClick={() => setFilterAlpha('all')}>Tất cả</MenuItem>
                    {alphabet.map((letter) => (
                      <MenuItem key={letter} onClick={() => setFilterAlpha(letter)}>{letter}</MenuItem>
                    ))}
                </Select>
                </FormControl>
            </Box>
          </Box>
          <Box>
            <Typography variant='body1' sx={{ mt: 1 }}>
              Hiển thị: {filteredAndSortedData.length} nhân viên
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
                        onClick={handleAllCheckbox}
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
                  <TableCell colSpan={4} align='center' sx={{ py: 4 }}>
                    {searchTerm ? 'Không tìm thấy nhân viên nào' : 'Danh sách trống'}
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
                                checked={selectedItems.includes(item._id)}
                                onChange={() => handleCheckbox(item._id)}
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
                        <Typography variant='body1' sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {CustomerGender.find(el => el._id === item.gender)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.role === '2000'
                            ? 'nhân viên hàng'
                            : item.role === '2002'
                            ? 'Nhân viên'
                            : item.role === '2004'
                            ? 'Quản lý'
                            :
                            'Quản lý'
                            }
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.phone}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.address?.detail}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.type}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {moment(item.lastLoginAt).format('YYYY-MM-DD HH:mm:ss')}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                color='success'
                                aria-label={`Sửa ${item.name}`}
                                size='small'
                            >
                                <Link href={`/admin/decentralize-management/edit/${item._id}`} style={{color: theme.palette.success.main}}>
                                  <Edit/>
                                </Link>
                            </IconButton>
                            <IconButton 
                                onClick={() => handleDelete(item._id)} 
                                color='error'
                                aria-label={`Xóa ${item.name}`}
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
    </Box>
  );
};