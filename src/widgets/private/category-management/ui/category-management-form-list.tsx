'use client'
import React, { useState, useMemo, Fragment, useEffect } from 'react';
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
  Dialog
} from '@mui/material';
import { Add, Cancel, Delete, Edit, ExitToApp } from '@mui/icons-material';
import Image from 'next/image';
import { CategoryManagementFormAddEdit } from './category-management-form-add-edit';
import { deleteCategory, getAllCategory } from '@/features/category/api/categoryApi';
import { Category } from '@/features/category/type/categoryType';
import { toast } from 'react-toastify';

const headCells = [
  { id: 'name', label: 'Tên sản phẩm', sortable: true },
  { id: 'description', label: 'Mô tả', sortable: false },
  { id: 'slug', label: 'Slug', sortable: true },
  { id: 'image', label: 'Hình ảnh', sortable: false },
  { id: 'actions', label: 'Thao tác', sortable: false }
];

type SortOrder = 'asc' | 'desc';

export const CategoryManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [category, setCategory] = useState<Category[] | []>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [filterCategory, setFilterCategory] = useState('all');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isAddCategory, setIsAddCategory] = useState<boolean>(false);
    const [isUpdateCategory, setIsUpdateCategory] = useState<string | null>(null);
    const theme = useTheme();
    const fetchAllCategory = async () => {
        const response = await getAllCategory();
        if(response.success) {
          setCategory(response.data || []);
        }
      }

    // hiển thị tất cả danh mục
    useEffect(() => {
      
      fetchAllCategory();
    },[]);
    // xóa danh mục
    const handleDelete = async(id: string) => {
      try{
        window.confirm('Bạn có chắc muốn xóa danh mục không?');
        const response = await deleteCategory(id);
        if(response.success) {
          toast.success(response.message);
          fetchAllCategory();
          return;
        }else{
          toast.error(response.message);
          fetchAllCategory();
        }
      }catch(error: unknown){
        toast.error(`Lỗi: ${error}`);
        fetchAllCategory();
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
        if(selectedItems.length === category.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(category.map(el => el._id));
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
    const isAllSelected = selectedItems.length === category.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length <= category.length;

    const filteredAndSortedData = useMemo(() => {
        const filtered = category.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || 
                                (filterCategory === 'hoa' && item.name.toLowerCase().includes('hoa')) ||
                                (filterCategory === 'cay' && item.name.toLowerCase().includes('cây')) ||
                                (filterCategory === 'rau' && item.name.toLowerCase().includes('rau'));
        
        return matchesSearch && matchesCategory;
        });

    // Sắp xếp
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
    }, [searchTerm, sortBy, sortOrder, filterCategory, category]);
    // xử lý thêm sản phẩm 
    const handleShowAddUpdate = () => {
        if(isAddCategory){
            setIsAddCategory(prev => !prev)
        }else{
            setIsUpdateCategory(null)
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
            Quản lý danh mục sản phẩm
          </Typography>
          </Box>
          <Box
            sx={{display: 'flex', gap: 2}}
          >
            <Box onClick={() => setIsAddCategory(true)} sx={{ display: 'flex', alignItems: 'center', backgroundColor: theme.palette.primary.main, color: theme.palette.text.secondary, p: 1, cursor: 'pointer' }}>
                <Add sx={{fontSize: theme.typography.fontSize}}/> Thêm danh mục
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
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000' }
                }}>
                <InputLabel>Lọc theo loại</InputLabel>
                <Select
                    value={filterCategory}
                    label='Lọc theo loại'
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <MenuItem value='all'>Tất cả</MenuItem>
                    <MenuItem value='hoa'>Hoa</MenuItem>
                    <MenuItem value='cay'>Cây</MenuItem>
                    <MenuItem value='rau'>Rau</MenuItem>
                </Select>
                </FormControl>
            </Box>
          </Box>
          <Box>
            <Typography variant='body1' sx={{ mt: 1 }}>
              Hiển thị: {filteredAndSortedData.length} danh mục
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
                      fontWeight: 'bold'
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
                    {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Danh sách trống'}
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
                          {item.name}
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
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.slug}
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
                              src={item.thumb.url}
                              alt={item.name}
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </Box>
                      </TableCell>
                      <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                onClick={() => setIsUpdateCategory(item._id)} 
                                color='success'
                                aria-label={`Sửa ${item.name}`}
                                size='small'
                            >
                                <Edit/>
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
        <Fragment>
            <Dialog
                open={isAddCategory || isUpdateCategory !== null}
                onClose={handleShowAddUpdate}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        width: '40%',
                        height: '55%',
                        maxWidth: '1000px',
                        position: 'relative',
                        borderRadius: 0
                    },
                }}
            >
                <Typography onClick={handleShowAddUpdate} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
                <CategoryManagementFormAddEdit isUpdateCategory={isUpdateCategory} render={fetchAllCategory}/>
            </Dialog>
        </Fragment>
    </Box>
  );
};