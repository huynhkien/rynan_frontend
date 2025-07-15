'use client'
import React, { useState, useMemo, useEffect, Fragment } from 'react';
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
import {  Cancel, Delete, KeyboardArrowDown, KeyboardArrowUp, Send } from '@mui/icons-material';
import { toast } from 'react-toastify';
import moment from 'moment';
import { ProductRatingsData, ProductRatingsRepliesData } from '@/features/product/type/productType';
import { addReply, addReplyChild, deleteRating, deleteReply, getAllProduct } from '@/features/product/api/productApi';
import { UserData } from '@/features/user/type/userTypes';
import { getAllUser } from '@/features/user/api/userApis';
import { useAppSelector } from '@/shared/hooks/useAppHook';
import { RatingManagementFormReply } from './rating-management-form-reply';

const headCells = [
  { id: 'name', label: 'Khách bình luận', sortable: true },
  { id: 'rating', label: 'Đánh giá', sortable: true },
  { id: 'product', label: 'Sản phẩm', sortable: true },
  { id: 'message', label: 'Nội dung', sortable: true },
  { id: 'createdAt', label: 'Ngày đánh giá', sortable: false },
  { id: 'actions', label: 'Thao tác', sortable: false }

];
type SortOrder = 'asc' | 'desc';

export const RatingManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [ratings, setRatings] = useState<ProductRatingsData[] | []>([]);
    const [users, setUsers] = useState<UserData[] | []>([]);
    const [isReplier, setIsReplier] = useState<string | null>(null);
    const [productId, setProductId] = useState<string | null>(null);
    const [ratingId, setRatingId] = useState<string | null>(null);
    const [ratingChildId, setRatingChildId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
    const {current} = useAppSelector(state => state.user);
    const [replyText, setReplyText] = useState<string | ''>('');
    const theme = useTheme();
    // Hiển thị dropdown
    const toggleRow = (_id: string) => {
      setOpenRows(prev => ({
        ...prev,
        [_id]: !prev[_id]
      }));
    };
    // Hiển thị tất cả sản phẩm => lấy các bình luận của từng sản phẩm
    const fetchProducts = async () => {
        const response = await getAllProduct();
        if (response.success) {
        const productsWithProductIdInRatings = response.data?.map(product => ({
            ...product,
            ratings: product.ratings?.map(rating => ({
                ...rating,
                name: product.name_vn,
                pid: product._id
            })) || []
            }));
            const allRatings = productsWithProductIdInRatings?.flatMap(p => p.ratings);
            setRatings(allRatings as ProductRatingsData[]);
        }
    };
    // Hiển  thị thông tin khách hàng
    const fetchUsers = async () => {
        const response = await getAllUser();
        if(response.success) setUsers(response.data);
    }
    useEffect(() => {
        fetchProducts();
        fetchUsers();
    },[]);
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
    const filtered = ratings.filter(item => {
      const matchesSearch =
        item.star?.toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
        users.find(el => el._id === item.postedBy)?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.comment?.toLowerCase().includes(searchTerm.toLowerCase()); 
      const matchesAlpha =
        filterAlpha === 'all' ||
        item.star?.toString().toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
        users.find(el => el._id === item.postedBy)?.name.startsWith(filterAlpha.toLowerCase()) ||
        item.comment?.toLowerCase().startsWith(filterAlpha.toLowerCase()) ;

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
  }, [searchTerm, sortBy, sortOrder, ratings, users, filterAlpha]);
    // Tắt dialog
    const handleCloseDialog = async() => {
        if(isReplier){
          setIsReplier(null);
        }
    }
    // Phản hồi bình luận
    const handleAddReply = async () => {
        const replyData = {
            replier: isReplier,
            feedBack: replyText,
            postedBy: current?._id
        }
        const response = await addReply(productId as string, ratingId as string, replyData as ProductRatingsRepliesData);
        if(response.success){
          toast.success(response.message);
          fetchProducts();
          setReplyText('');
          setIsReplier(null);
          setProductId(null);
          setRatingId(null);
        }else{
          toast.error(response.message);
        }
        
    }
    const handleAddReplyChild = async () => {
        const replyData = {
            replier: isReplier,
            feedBack: replyText,
            postedBy: current?._id
        }
        const response = await addReplyChild(productId as string, ratingChildId as string, replyData as ProductRatingsRepliesData);
        if(response.success){
          toast.success(response.message);
          fetchProducts();
          setReplyText('');
          setIsReplier(null);
          setProductId(null);
          setRatingChildId(null);
        }else{
          toast.error(response.message);
        }
    }
    // Xóa đánh giá
    const handleDeleteRating = async({pid, rid}: {pid: string, rid: string}) => {
      const response = await deleteRating(pid, rid);
      if(confirm('Bạn chắc có xóa đánh giá này không?')){
        if(response.success){
        toast.success(response.message);
        fetchProducts();
        }else{
          toast.error(response.message)
        }
      }
    }
    // Xóa thông tin phản hồi
    const handleDeleteReply = async({pid, rid, repId}: {pid: string, rid: string, repId: string}) => {
      if(confirm('Bạn chắc có xóa phản hồi này không?')){
        const response = await deleteReply(pid, rid, repId);
        if(response.success){
          toast.success(response.message);
          fetchProducts();
        }else{
          toast.error(response.message)
        }
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
            Quản lý bình luận
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
                    label='Tìm kiếm bình luận'
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
              Hiển thị: {filteredAndSortedData.length} bình luận
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
                    {searchTerm ? 'Không tìm thấy bình luận nào' : 'Danh sách trống'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <React.Fragment key={item._id}>
                        <TableRow hover>
                            <TableCell padding='checkbox'>
                                <IconButton
                                    aria-label='expand row'
                                    size='small'
                                    onClick={() => toggleRow(item._id as string)}
                                >
                                    {openRows[item._id as string] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                </IconButton>
                            </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                            <Typography variant='body1' noWrap>
                            {users.find(el => el._id === item.postedBy)?.name}
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                            <Typography variant='body1' noWrap>
                            {item.star} sao
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                            <Typography variant='body1' noWrap>
                            {item.name} 
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                            <TextField 
                            multiline
                            value={item.comment}
                            rows={8}
                            sx={{
                                width: '15vw'
                            }}
                            />
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                            <Typography variant='body1' noWrap>
                            {moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                            </Typography>
                        </TableCell>
                        
                        
                        <TableCell>
                            {/* Hành động */}
                                <IconButton 
                                    color='success'
                                    aria-label={`Sửa ${item._id}`}
                                    size='small'
                                    onClick={() => {setIsReplier(item.postedBy as string); setProductId(item.pid as string); setRatingId(item._id as string)}}
                                >
                                    <Send/>
                                </IconButton>
                                <IconButton 
                                    onClick={() => handleDeleteRating({pid: item.pid as string, rid: item._id as string})} 
                                    color='error'
                                    aria-label={`Xóa ${item._id}`}
                                    size='small'
                                >
                                    <Delete />
                                </IconButton>
                        </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headCells.length + 1} >
                            <Collapse in={openRows[item._id as string]} timeout='auto' unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                <Typography variant='body2' gutterBottom component='div'>
                                  Phản hồi
                                </Typography>
                                <Table size='small' >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Khách phản hồi</TableCell>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Nội dung</TableCell>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Phản hồi người</TableCell>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Ngày bình luận</TableCell>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Thao tác</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {item?.replies?.map((el) => (
                                      <TableRow key={el._id}>
                                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{users.find(u => u._id === el.postedBy)?.name}</TableCell>
                                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}><TextField multiline value={el.feedBack} rows={8} sx={{ width: '15vw'}}/></TableCell>
                                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{users.find(u => u._id === el.replier)?.name}</TableCell>
                                        <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{moment(el.createdAt).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                                        <TableCell>
                                            {/* Hành động */}
                                            <IconButton 
                                                color='success'
                                                aria-label={`Sửa ${item._id}`}
                                                size='small'
                                                onClick={() => {setIsReplier(el.postedBy as string); setProductId(item.pid as string); setRatingChildId(el._id as string)}}
                                            >
                                                <Send/>
                                            </IconButton>
                                            <IconButton 
                                                onClick={() => handleDeleteReply({pid: item.pid as string, rid: item._id as string, repId: el._id as string})} 
                                                color='error'
                                                aria-label={`Xóa ${item._id}`}
                                                size='small'
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
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
        <Fragment>
            <Dialog
                open={isReplier !==null}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        width: '40%',
                        height: '55%',
                        maxWidth: '1000px',
                        position: 'relative',
                        borderRadius: 0,
                        backgroundColor: theme.palette.text.secondary
                    },
                }}
            >
                <Typography onClick={handleCloseDialog} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
                <RatingManagementFormReply replyText={replyText} setReplyText={setReplyText} handleAddReply={ratingChildId ? handleAddReplyChild : handleAddReply}/>
            </Dialog>
        </Fragment>
    </Box>
  );
};