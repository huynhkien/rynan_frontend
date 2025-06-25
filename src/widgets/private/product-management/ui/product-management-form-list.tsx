'use client'
import React, { useState, useMemo,  useEffect, Fragment } from 'react';
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
  Chip,
  Dialog,
} from '@mui/material';
import { Add,  AttachMoney,  Cancel,  Delete, Edit, ExitToApp } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { PriceProduct, Product,} from '@/features/product/type/productType';
import { deleteProduct, getAllProduct } from '@/features/product/api/productApi';
import Link from 'next/link';
import Image from 'next/image';
import { getAllSpecification } from '@/features/specification/api/specificationApi';
import { Specification } from '@/features/specification/type/specificationType';
import { isActive } from '@/shared/constant/common';
import { PriceManagementFormAdd } from '../../price-management/ui/price-management-form-add';
import { PriceManagementFormList } from '../../price-management/ui/price-management-form-list';

const headCells = [
  { id: 'code', label: 'Mã sản phẩm', sortable: true },
  { id: 'name', label: 'Tên sản phẩm', sortable: true },
  { id: 'thumb', label: 'Ảnh', sortable: true },
  { id: 'name_short', label: 'Tên ngắn', sortable: true },
  { id: 'tags', label: 'Tags', sortable: true },
  { id: 'specification', label: 'Quy cách đóng gói', sortable: true },
  { id: 'price_reference', label: 'Giá tham khảo', sortable: true },
  { id: 'isActive', label: 'Trạng thái', sortable: true },
  { id: 'actions', label: 'Thao tác', sortable: false },

];

type SortOrder = 'asc' | 'desc';

export const ProductManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [product, setProduct] = useState<Product[] | []>([]);
    const [specification, setSpecification] = useState<Specification[] | []>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [isShowPriceProduct, setIsShowPriceProduct] = useState<string | null>(null);
    const [isDataPriceProduct, setIsDataPriceProduct] = useState<PriceProduct[] | []>([]);
    const [isAddPriceProduct, setIsAddPriceProduct] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const [filterActive, setFilterActive] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const theme = useTheme();
    
    // hiển thị tất cả sản phẩm
    const fetchAllProduct = async () => {
        const response = await getAllProduct();
        if(response.success) {
          setProduct(response.data || []);
        }
      }
    // Hiển thị quy cách đóng gói
    const fetchAllSpecification = async () => {
      const response = await getAllSpecification();
      if(response.success) setSpecification(response.data || [])
    }
    useEffect(() => {
      fetchAllProduct();
      fetchAllSpecification();
    },[]);
    
    // xóa sản phẩm
    const handleDelete = async(id: string) => {
      try{
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm không?')) {
          const response = await deleteProduct(id);
          if(response.success) {
            toast.success(response.message);
            fetchAllProduct();
            return;
          }else{
            toast.error(response.message);
            fetchAllProduct();
          }
        }
      }catch(error: unknown){
        toast.error(`Lỗi: ${error}`);
        fetchAllProduct();
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
        if(selectedItems.length === product.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(product.map(el => el._id));
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
    const isAllSelected = selectedItems.length === product.length && product.length > 0;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length < product.length;

    const filteredAndSortedData = useMemo(() => {
      const filtered = product.filter(item => {
        // Fix lỗi logic tìm kiếm - thiếu || và thêm dấu chấm phẩy
        const matchesSearch =
          item.name_vn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name_short.toLowerCase().includes(searchTerm.toLowerCase());
         
        const matchesAlpha =
          filterAlpha === 'all' ||
          item.code.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
          item.name_vn.toLowerCase().startsWith(filterAlpha.toLowerCase());
          
        // Fix lỗi lọc theo trạng thái - so sánh chính xác
        const matchesActive =
          filterActive === 'all' ||
          item.isActive === filterActive;

        return matchesSearch && matchesAlpha && matchesActive;
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
    }, [searchTerm, sortBy, sortOrder, product, filterAlpha, filterActive]);

   // xử lý thêm giá sản phẩm 
    const handleShowAddUpdate = () => {
        if(isAddPriceProduct){
            setIsAddPriceProduct(prev => !prev)
        }else{
            setIsShowPriceProduct(null)
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
            Quản lý sản phẩm
          </Typography>
          </Box>
          <Box
            sx={{display: 'flex', gap: 2}}
          >
            <Box sx={{p: 1, backgroundColor: theme.palette.primary.main}}>
                <Link href='/admin/product-management/add' style={{textDecoration: 'none', display: 'flex', alignItems: 'center',  color: theme.palette.text.secondary, cursor: 'pointer' }}>
                    <Add sx={{fontSize: theme.typography.fontSize}}/> Thêm sản phẩm
                </Link>
            </Box>
            <Box onClick={() => setIsAddPriceProduct(true)} sx={{ display: 'flex', alignItems: 'center', backgroundColor: theme.palette.primary.main, color: theme.palette.text.secondary, p: 1, cursor: 'pointer' }}>
                <Add sx={{fontSize: theme.typography.fontSize}}/> Thêm giá sản phẩm
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
            <Box>
                <FormControl fullWidth size='small' sx={{ 
                '& .MuiInputLabel-root': { color: '#000' }, 
                '& .MuiSelect-select': { color: '#000' }, 
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
                width: '200px'
                }}>
                <InputLabel>Lọc theo trạng thái</InputLabel>
                <Select
                    value={filterActive}
                    label='Lọc theo trạng thái'
                    onChange={(e) => setFilterActive(e.target.value)}
                >
                    <MenuItem value='all'>Tất cả</MenuItem>
                    {isActive.map((item) => (
                      <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                    ))}
                </Select>
                </FormControl>
            </Box>
          </Box>
          <Box>
            <Typography variant='body1' sx={{ mt: 1 }}>
              Hiển thị: {filteredAndSortedData.length} sản phẩm
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
                    {searchTerm || filterAlpha !== 'all' || filterActive !== 'all' ? 'Không tìm thấy sản phẩm nào' : 'Danh sách trống'}
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
                        <Typography variant='body1'>
                          {item.name_short}
                        </Typography>
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
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {isActive.find(status => status._id === item.isActive)?.name || item.isActive}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                color='success'
                                aria-label={`Sửa ${item.name_vn}`}
                                size='small'
                            >
                                <Link href={`/admin/product-management/edit/${item._id}`} style={{color: theme.palette.success.main}}>
                                  <Edit/>
                                </Link>
                            </IconButton>
                            <IconButton 
                                onClick={() => handleDelete(item._id)} 
                                color='error'
                                aria-label={`Xóa ${item.name_vn}`}
                                size='small'
                            >
                                <Delete />
                            </IconButton>
                            <IconButton 
                                onClick={() => {
                                  setIsShowPriceProduct(item._id);
                                  setIsDataPriceProduct(item.prices || []);
                                }}
                                color='warning'
                                size='small'
                            >
                              <AttachMoney/>
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
      <Fragment>
        <Dialog
            open={isAddPriceProduct ||  isShowPriceProduct !== null}
            onClose={handleShowAddUpdate}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                style: {
                    width: '50%',
                    height: '60%',
                    maxWidth: '1000px',
                    position: 'relative',
                    borderRadius: 0
                },
            }}
        >
            <Typography onClick={handleShowAddUpdate} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
            {isShowPriceProduct && <PriceManagementFormList id={isShowPriceProduct} prices={isDataPriceProduct} render={fetchAllProduct}/>}
            {isAddPriceProduct && <PriceManagementFormAdd/>}
        </Dialog>
      </Fragment>
    </Box>
  );
};