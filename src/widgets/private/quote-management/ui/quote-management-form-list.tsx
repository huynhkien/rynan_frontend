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
import { Add,   Cancel,   Delete, Edit,  } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { QuoteData} from '@/features/quote/type/quoteType';
import { deleteQuote, deleteQuotes, getAllQuote, getQuoteById } from '@/features/quote/api/quoteApi';
import { UserData } from '@/features/user/type/userTypes';
import { getAllUser } from '@/features/user/api/userApis';
import Image from 'next/image';
import { Product } from '@/features/product/type/productType';
import { getAllProduct } from '@/features/product/api/productApi';
import { ExportToPDF } from '@/shared/components/ui/private/ExportToPdf';

const headCells = [
  { id: 'client', label: 'Thông tin khách hàng', sortable: true },
  { id: 'products', label: 'Số lượng sản phẩm', sortable: true },
  { id: 'quotation', label: 'Mã phiếu', sortable: true },
  { id: 'actions', label: 'Thao tác', sortable: false },

];
const headProductCells = [
  { id: 'code', label: 'Mã sản phẩm', sortable: true },
  { id: 'name', label: 'Tên sản phẩm', sortable: true },
  { id: 'thumb', label: 'Ảnh', sortable: true },
  { id: 'offering_price', label: 'Giá chào bán', sortable: false },
  { id: 'dealer_price', label: 'Giá đại lý', sortable: false },
  { id: 'store_price', label: 'Giá cửa hàng', sortable: false },
  { id: 'reference_price', label: 'Giá lẻ tham khảo', sortable: false },

];
type SortOrder = 'asc' | 'desc';
const QuoteProductList = ({product}: {product: Product[]}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const theme = useTheme();
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
    return (
            <Box sx={{ width: '100%' }}>
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
                        {headProductCells.map((headCell, index) => (
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
                      {!product || product?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} align='center' sx={{ py: 4 }}>
                            Không có sản phẩm
                          </TableCell>
                        </TableRow>
                      ) : (
                        product
                          ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          ?.map((item) => (
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
                                <Typography variant='body1'>
                                  {(item.prices.find(el => el.priceType === 'offeringPrice')?.price.toLocaleString())  || 'Chưa Thêm'}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ verticalAlign: 'middle' }}>
                                <Typography variant='body1'>
                                  {(item.prices.find(el => el.priceType === 'dealerPrice')?.price.toLocaleString()) || 'Chưa Thêm'}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ verticalAlign: 'middle' }}>
                                <Typography variant='body1'>
                                  {(item.prices.find((el) => el.priceType === 'storePrice')?.price.toLocaleString()) || 'Chưa Thêm'}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ verticalAlign: 'middle' }}>
                                <Typography variant='body1'>
                                  {(item.prices.find((el) => el.priceType === 'referencePrice')?.price.toLocaleString()) || 'Chưa Thêm'}
                                </Typography>
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
                  count={product?.length || 0}
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
    )
}
export const QuoteManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [quotes, setQuotes] = useState<QuoteData[] | []>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [isIdUser, setIsIdUser] = useState<string | null>(null);
    const [isIdQuote, setIsIdQuote] = useState<string>();
    const [isShowProduct, setIsShowProduct] = useState<string | null>(null);
    const [users, setUsers] = useState<UserData[]>()
    const [products, setProducts] = useState<Product[]>();
    const [filteredProducts, setFilteredProducts] = useState<Product[] | []>([]);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const theme = useTheme();
    
    // hiển thị tất cả sản phẩm
    const fetchAllQuote = async () => {
        const response = await getAllQuote();
        if(response.success) {
          setQuotes(response.data || []);
        }
    }
    // Hiển thị thông tin người dùng
    const fetchUsers = async () => {
        const response = await getAllUser();
        if(response.success) setUsers(response.data);
    }
    // Hiển thị thông tin sản phẩm
    const fetchProducts = async () => {
        const response = await getAllProduct();
        if(response.success) setProducts(response.data);
    }
    useEffect(() => {
      fetchAllQuote();
      fetchUsers();
      fetchProducts();
    }, []);

    // Tìm kiếm sản phẩm
    useEffect(() => {
        const fetchProduct = async () => {
            if (!isIdQuote || !products?.length) return;
            const response = await getQuoteById(isIdQuote as string);
            if (response.success && response.data?.products) {
                const quoteProductIds = response.data.products.map((el) => el.pid);
                const filteredProduct = products.filter((item) =>
                quoteProductIds.includes(item._id)
                );
                setFilteredProducts(filteredProduct || []);
            } else {
                setFilteredProducts([]);
            }
        };
        
        fetchProduct();
    }, [isIdQuote, products]);

    
    // xóa báo giá
    const handleDelete = async(id: string) => {
      try{
        if (window.confirm('Bạn có chắc muốn xóa báo giá không?')) {
          const response = await deleteQuote(id);
          if(response.success) {
            toast.success(response.message);
            fetchAllQuote();
            return;
          }else{
            toast.error(response.message);
            fetchAllQuote();
          }
        }
      }catch(error: unknown){
        toast.error(`Lỗi: ${error}`);
      }
    };
    const handleDeleteQuotes = async() => {
      try{
        if (window.confirm('Bạn có chắc muốn xóa báo giá không?')) {
          const response = await deleteQuotes(selectedItems);
          if(response.success) {
            toast.success(response.message);
            fetchAllQuote();
            return;
          }else{
            toast.error(response.message);
            fetchAllQuote();
          }
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
    
    // click chọn tất cả
    const handleAllCheckbox = () => {
        if(selectedItems.length === quotes.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(quotes.map(el => el?._id as string));
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
    const isAllSelected = selectedItems.length === quotes.length && quotes.length > 0;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length < quotes.length;

    const filteredAndSortedData = useMemo(() => {
      const filtered = quotes.filter(item => {
        // Fix lỗi logic tìm kiếm - thiếu || và thêm dấu chấm phẩy
        const matchesSearch =
          users?.find((el) => el._id === item.client)?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAlpha =
          filterAlpha === 'all' ||
          users?.find((el) => el._id === item.client)?.name.toLowerCase().includes(filterAlpha.toLowerCase());
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
          
          // Xử lý trường hợp number
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          }

          return 0;
        });
      }

      return filtered;
    }, [searchTerm, sortBy, sortOrder, quotes, filterAlpha, users]);
    // Xử lý sự kiện đóng dialog
    console.log(isShowProduct);
    const handleCloseDialog = async () => {
        if(isIdUser){
            setIsIdUser(null);
        }else{
            setIsShowProduct(null);
        }
    }

   
return (
    <Box sx={{ width: '100%' }}>
      {/* Toolbar với tìm kiếm và filter */}
      <Paper sx={{ mb: 2, p: 2, borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Box>
            <Typography variant='h6' sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
              Quản lý phiếu báo giá
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ p: 1, backgroundColor: theme.palette.primary.main }}>
              <Link href='/admin/quote-management/add' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: theme.palette.text.secondary, cursor: 'pointer' }}>
                <Add sx={{ fontSize: theme.typography.fontSize }} /> Thêm báo giá
              </Link>
            </Box>
            {(isIndeterminate || isAllSelected) && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: theme.palette.text.secondary, cursor: 'pointer' }}>
                <Box onClick={handleDeleteQuotes} sx={{ p: 1, backgroundColor: theme.palette.error.main, display: 'flex', alignItems: 'center' }}>
                  <Delete sx={{ fontSize: theme.typography.fontSize }} /> Xóa tất cả
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box>
              <TextField
                fullWidth
                label='Tìm kiếm báo giá'
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
                placeholder='Nhập tên khách hàng hoặc mã báo giá...'
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
              Hiển thị: {filteredAndSortedData.length} phiếu báo giá
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
                      'aria-label': 'select all quotes',
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
                  <TableCell colSpan={5} align='center' sx={{ py: 4 }}>
                    {searchTerm || filterAlpha !== 'all' ? 'Không tìm thấy báo giá nào' : 'Danh sách trống'}
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
                            'aria-label': 'select quote',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {users?.find((el) => el._id === item.client)?.name || 'Không xác định'} 
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
                        onClick={() => {setIsShowProduct(item._id as string); setIsIdQuote(item?._id)}}
                      >
                        <Typography variant='body1'>
                          {item.products?.length || 0} sản phẩm
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.quotation} 
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <IconButton 
                          color='success'
                          aria-label={`Sửa ${item._id}`}
                          size='small'
                        >
                          <Link href={`/admin/quote-management/edit/${item._id}`} style={{ color: theme.palette.success.main }}>
                            <Edit />
                          </Link>
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(item._id as string)} 
                          color='error'
                          aria-label={`Xóa ${item._id}`}
                          size='small'
                        >
                          <Delete />
                        </IconButton>
                        <IconButton>
                          <ExportToPDF qid={item._id as string}/>
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
        open={isShowProduct !==null}
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
          <QuoteProductList product={filteredProducts} />
        </Box>
      </Dialog>
    </Box>
  );
};