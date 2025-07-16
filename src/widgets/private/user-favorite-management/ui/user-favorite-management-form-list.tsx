'use client'
import React, { useState, useMemo,  useEffect} from 'react';
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
  Chip,
} from '@mui/material';
import { Delete} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { Product,} from '@/features/product/type/productType';
import { getAllProduct } from '@/features/product/api/productApi';
import Image from 'next/image';
import { getAllSpecification } from '@/features/specification/api/specificationApi';
import { Specification } from '@/features/specification/type/specificationType';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppHook';
import { addFavorite } from '@/features/user/api/userApis';
import { updateFavorite } from '@/features/user/store/userSlice';
import { showModal } from '@/shared/store/appSlice';

const headCells = [
  { id: 'code', label: 'Mã sản phẩm yêu thích', sortable: true },
  { id: 'name', label: 'Tên sản phẩm yêu thích', sortable: true },
  { id: 'thumb', label: 'Ảnh', sortable: true },
  { id: 'tags', label: 'Tags', sortable: true },
  { id: 'specification', label: 'Quy cách đóng gói', sortable: true },
  { id: 'price_reference', label: 'Giá tham khảo', sortable: true },
  { id: 'actions', label: 'Thao tác', sortable: false },
];

type SortOrder = 'asc' | 'desc';

export const UserFavoriteManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [product, setProduct] = useState<Product[] | []>([]);
    const dispatch = useAppDispatch();
    const [specification, setSpecification] = useState<Specification[] | []>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const {current} = useAppSelector(state => state.user);
    const theme = useTheme();
    // hiển thị tất cả sản phẩm yêu thích
    useEffect(() => {
        if(!current) return;
        const fetchAllProduct = async () => {
        const response = await getAllProduct();
        const productFavoriteId = current?.wishlist?.map(el => el);
        if(response.success) {
          setProduct(response.data?.filter(el => productFavoriteId?.includes(el._id)) || []);
        }
      }
      fetchAllProduct();
    },[current])

    // Hiển thị quy cách đóng gói
    const fetchAllSpecification = async () => {
      const response = await getAllSpecification();
      if(response.success) setSpecification(response.data || [])
    }
    useEffect(() => {
      fetchAllSpecification();
    },[]);
    // xóa sản phẩm yêu thích
    const handleDelete = async(id: string) => {
        if(!current){
          return;
        } else{
          dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
          const response = await addFavorite(current._id, id);
          if(response.success){
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.success(response.message);
            dispatch(updateFavorite(id));
          }else{
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.error(response.message)
          }
        }
      }
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
      const filtered = product.filter(item => {
        const matchesSearch =
          item.name_vn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name_short.toLowerCase().includes(searchTerm.toLowerCase());
         
        const matchesAlpha =
          filterAlpha === 'all' ||
          item.code.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
          item.name_vn.toLowerCase().startsWith(filterAlpha.toLowerCase());
          
        
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
    }, [searchTerm, sortBy, sortOrder, product, filterAlpha]);
   
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
            Quản lý sản phẩm yêu thích
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
                    label='Tìm kiếm sản phẩm yêu thích'
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
              Hiển thị: {filteredAndSortedData.length} sản phẩm yêu thích
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
                    {searchTerm || filterAlpha !== 'all' ? 'Không tìm thấy sản phẩm yêu thích nào' : 'Danh sách trống'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item._id} hover>
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
                          {item.name_vn}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: 50,
                            height: 50,
                            borderRadius: 1,
                            overflow: 'hidden',
                            backgroundColor: 'grey.200',
                            flexShrink: 0
                          }}
                        >
                          <Image
                            fill
                            src={item.thumb? item.thumb.url : '/banner/banner-4.jpg'}
                            alt={item.name_vn}
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {item.tags.map((el, index) => (
                                  <Chip
                                    key={index}
                                    label={el.tag}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {specification.find((el) => el._id === item.specification)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.price_reference.toLocaleString()} VNĐ
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                onClick={() => handleDelete(item._id)} 
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
    </Box>
  );
};