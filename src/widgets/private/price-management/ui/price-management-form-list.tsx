'use client'
import React, { useState, useMemo, useEffect} from 'react';
import moment from 'moment';

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
} from '@mui/material';
import { Delete, Edit, } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { deletePriceProduct, getProductById, updatePriceProduct } from '@/features/product/api/productApi';
import {  ProductPrice, ProductPriceData } from '@/features/product/type/productType';
import { PriceType } from '@/shared/constant/common';
import { FieldErrors, useForm, UseFormRegister } from 'react-hook-form';
import { ControlledSelect } from '@/shared/components/ui/private/ControlledSelect';
import ProductInputPrice from '@/features/product/components/ProductInputPrice';
import { Button } from '@/shared/components';

const headCells = [
  { id: 'typePrice', label: 'Loại giá', sortable: true },
  { id: 'price', label: 'Giá', sortable: true },
  { id: 'startDate', label: 'Ngày bắt đầu', sortable: true },
  { id: 'endDate', label: 'Ngày kết thúc', sortable: true },
  { id: 'note', label: 'Ghi chú', sortable: true },
  { id: 'actions', label: 'Thao tác', sortable: false }

];

type SortOrder = 'asc' | 'desc';

export const PriceManagementFormList = ({id, prices, render}: ProductPriceData) => {
    const { register,   formState: { errors },  control, reset, handleSubmit} = useForm<ProductPrice>();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const [isUpdatePriceProduct, setIsUpdatePriceProduct] = useState<string | null>(null);
    const theme = useTheme();
    
    // Hiển thị sản phẩm với giá
    // xóa giá sản phẩm
    const handleDelete = async(id: string, rid: string) => {
      try{
        window.confirm('Bạn có chắc muốn xóa giá sản phẩm không?');
        const response = await deletePriceProduct({id, rid});
        if(response.success) {
          toast.success(response.message);
          render();
        }else{
          toast.error(response.message);
          render();
        }
      }catch(error: unknown){
        toast.error(`Lỗi: ${error}`);
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

    const filteredAndSortedData = useMemo(() => {
    const filtered = prices.filter(item => {
      const matchesSearch =
        item.priceType.toLowerCase().includes(searchTerm.toLowerCase());
        

      const matchesAlpha =
        filterAlpha === 'all' ||
        item.priceType.toLowerCase().startsWith(filterAlpha.toLowerCase());

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
  }, [searchTerm, sortBy, sortOrder, prices, filterAlpha]);
      // Cập nhật thông tin giá sản phẩm
    useEffect(() => {
      const fetchProduct = async() => {
          if(!id) return;
          try {
              const response = await getProductById(id);
              const priceData = response.data.prices.find((el) => el._id === isUpdatePriceProduct);
              console.log(response.data);
              if(response.success && response.data) {
                  reset({
                      priceType: priceData?.priceType || '',
                      price: priceData?.price || 0,
                      startDate: priceData?.startDate ? moment(priceData.startDate).format('YYYY-MM-DD') : '',
                      endDate: priceData?.endDate ? moment(priceData.endDate).format('YYYY-MM-DD') : '',
                      note: priceData?.note || '',
                  });
                  
              }
          } catch (error) {
              console.error('Error fetching category:', error);
          }
      };
      
      fetchProduct();
  }, [id, reset, isUpdatePriceProduct]);
  const handleUpdatePriceProduct = async (data: ProductPrice) => {
          if (!isUpdatePriceProduct) {
            toast.error("Không tìm thấy ID giá cần cập nhật");
            return;
          }
          try {
              const priceData = {
                  priceType: data.priceType || '',
                  price: data.price || 0,
                  startDate: data.startDate || '',
                  endDate: data.endDate  || '',
                  note: data.note || ''
              };
              const response = await updatePriceProduct({
                  prices: priceData ,
                  id: id,
                  rid: isUpdatePriceProduct,
              });
              toast.success(response.message);
              render();
          } catch (error) {
              toast.error(`Lỗi: ${error}`);
          }
      };

return (
    <Box sx={{ width: '100%' }}>
      {/* Toolbar với tìm kiếm và filter */}
      <Paper sx={{ borderRadius: 0, backgroundColor: theme.palette.background.default }}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: theme.palette.primary.light,
                p:2
            }}>
          <Box>
            <Typography variant='body2' sx={{ flexGrow: 1, color: theme.palette.text.secondary, textAlign: 'center' }}>
            Quản lý giá sản phẩm
          </Typography>
          </Box>
        </Box>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                m:1,
                p:1
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
              Hiển thị: {filteredAndSortedData.length} giá sản phẩm
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
                  backgroundColor: theme.palette.background.default,
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
                {headCells.map((headCell, index) => (
                  <TableCell 
                    key={index}
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 'bold',
                      fontSize: theme.typography.body1.fontSize,
                    }}
                  >
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={sortBy === headCell.id}
                        direction={sortBy === headCell.id ? sortOrder : 'asc'}
                        onClick={() => handleSort(headCell.id)}
                        sx={{ 
                          
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
                    {searchTerm ? 'Không tìm thấy giá sản phẩm nào' : 'Danh sách trống'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.priceType} hover>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1' noWrap>
                              {PriceType.find((el) => el._id === item.priceType)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1' noWrap>
                          {item.price.toLocaleString()} VNĐ
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1' noWrap>
                          {moment(item.startDate).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1' noWrap>
                          {moment(item.endDate).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1' noWrap>
                          {item.note}
                        </Typography>
                      </TableCell>
                      
                      
                      <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                color='success'
                                onClick={() =>
                                setIsUpdatePriceProduct(prev => (prev === item._id ? null : item._id))
                                }
                                aria-label={`Sửa ${item._id}`}
                                size='small'
                            >
                                <Edit/>
                            </IconButton>
                            <IconButton 
                                onClick={() => handleDelete(id ,item._id)} 
                                color='error'
                                aria-label={`Xóa ${item._id}`}
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
          rowsPerPageOptions={[5, 10]}
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
     {
        isUpdatePriceProduct && (
             <Box sx={{p:1, backgroundColor: theme.palette.background.default}}>
                <Box sx={{
                    backgroundColor: theme.palette.primary.light,
                    py: 2,
                    textAlign: 'center',
                    color: theme.palette.text.secondary,
                    fontWeight: theme.typography.fontWeightBold
                }}>
                    <Typography variant='body2'>
                        Cập nhật giá tiền sản phẩm
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit(handleUpdatePriceProduct)}
                    style={{
                        padding: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        backgroundColor: theme.palette.background.default
                    }}
            >
                  <Box
                      sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 1
                      }}
                  >
                      <ControlledSelect
                          label='Chọn loại giá'
                          important
                          sx={{
                              width: '50%'
                          }}
                          name='priceType'
                          control={control}
                          options={PriceType}
                          rules={{
                          required: 'Vui lòng chọn loại giá',
                          validate: (value) => {
                              if (value === 'electronics') return 'Không được chọn điện tử';
                              return true;
                          }
                          }}
                      />
                      <ProductInputPrice
                          label='Giá tiền'
                          type='number'
                          important
                          placeholder='Thêm giá tiền'
                          register={register as UseFormRegister<ProductPrice>}
                          errors={errors as FieldErrors<ProductPrice>}
                          id='price'
                          sx={{
                              width: '100%'
                          }}
                      />
                  </Box>
                  <Box
                      sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 1
                      }}
                  >
                      <ProductInputPrice
                          label='Ngày bắt đầu'
                          type='date'
                          important
                          register={register as UseFormRegister<ProductPrice>}
                          errors={errors as FieldErrors<ProductPrice>}
                          id='startDate'
                          sx={{
                              width: '50%'
                          }}
                      />
                      <ProductInputPrice
                          label='Ngày kết thúc'
                          type='date'
                          important
                          register={register as UseFormRegister<ProductPrice>}
                          errors={errors as FieldErrors<ProductPrice>}
                          id='endDate'
                          sx={{
                              width: '50%'
                          }}
                      />
                      <ProductInputPrice
                          label='Ghi chú(nếu có)'
                          important
                          placeholder='Thêm ghi chú'
                          register={register as UseFormRegister<ProductPrice>}
                          errors={errors as FieldErrors<ProductPrice>}
                          id='note'
                      />
                  </Box>    
                  <Box sx={{ mt: 1, width: '100%' }}>
                      <Button 
                          name='Cập nhật giá tiền'
                         
                      />
                  </Box>
                </form>
            </Box>
        )
     }
    </Box>
  );
};