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
import { toast } from 'react-toastify';
import { Specification } from '@/features/specification/type/specificationType';
import { deleteSpecification, getAllSpecification } from '@/features/specification/api/specificationApi';
import { SpecificationManagementFormAddEdit } from './specification-management-form-add-edit';

const headCells = [
  { id: 'code', label: 'Mã quy cách', sortable: true },
  { id: 'name', label: 'Tên quy cách', sortable: true },
  { id: 'unit', label: 'Đơn vị tính', sortable: true },
  { id: 'conversionQuantity', label: 'Số lượng quy đổi', sortable: true },
  { id: 'packagingWeight', label: 'Khối lượng đóng gói', sortable: true },
  { id: 'height', label: 'Chiều cao(cm)', sortable: true },
  { id: 'length', label: 'Chiều dài(cm)', sortable: true },
  { id: 'width', label: 'Chiều rộng(cm)', sortable: true },
  { id: 'description', label: 'Mô tả', sortable: false },
  { id: 'actions', label: 'Thao tác', sortable: false }

];

type SortOrder = 'asc' | 'desc';

export const SpecificationManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [specification, setSpecification] = useState<Specification[] | []>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isAddSpecification, setIsAddSpecification] = useState<boolean>(false);
    const [isUpdateSpecification, setIsUpdateSpecification] = useState<string | null>(null);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const theme = useTheme();
    const fetchAllSpecification = async () => {
        const response = await getAllSpecification();
        if(response.success) {
          setSpecification(response.data || []);
        }
      }

    // hiển thị tất cả quy cách
    useEffect(() => {
      fetchAllSpecification();
    },[]);
    // xóa quy cách
    const handleDelete = async(id: string) => {
      try{
        window.confirm('Bạn có chắc muốn xóa quy cách không?');
        const response = await deleteSpecification(id);
        if(response.success) {
          toast.success(response.message);
          fetchAllSpecification();
          return;
        }else{
          toast.error(response.message);
          fetchAllSpecification();
        }
      }catch(error: unknown){
        toast.error(`Lỗi: ${error}`);
        fetchAllSpecification();
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
        if(selectedItems.length === specification.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(specification.map(el => el._id));
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
    const isAllSelected = selectedItems.length === specification.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length <= specification.length;

    const filteredAndSortedData = useMemo(() => {
    const filtered = specification.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.conversionQuantity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.packagingWeight.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.height.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.width.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.length.toLowerCase().includes(searchTerm.toLowerCase()) ;

      const matchesAlpha =
        filterAlpha === 'all' ||
        item.code.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
        item.name.toLowerCase().startsWith(filterAlpha.toLowerCase());

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
  }, [searchTerm, sortBy, sortOrder, specification, filterAlpha]);

    // xử lý thêm sản phẩm 
    const handleShowAddUpdate = () => {
        if(isAddSpecification){
            setIsAddSpecification(prev => !prev)
        }else{
            setIsUpdateSpecification(null)
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
            Quản lý quy cách sản phẩm
          </Typography>
          </Box>
          <Box
            sx={{display: 'flex', gap: 2}}
          >
            <Box onClick={() => setIsAddSpecification(true)} sx={{ display: 'flex', alignItems: 'center', backgroundColor: theme.palette.primary.main, color: theme.palette.text.secondary, p: 1, cursor: 'pointer' }}>
                <Add sx={{fontSize: theme.typography.fontSize}}/> Thêm quy cách
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
              Hiển thị: {filteredAndSortedData.length} quy cách
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
                    {searchTerm ? 'Không tìm thấy quy cách nào' : 'Danh sách trống'}
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
                          {item.unit}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.conversionQuantity}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.packagingWeight}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.height}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.length}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.width}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.description}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                onClick={() => setIsUpdateSpecification(item._id)} 
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
                open={isAddSpecification || isUpdateSpecification !== null}
                onClose={handleShowAddUpdate}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        width: '40%',
                        height: '60%',
                        maxWidth: '1000px',
                        position: 'relative',
                        borderRadius: 0,
                        backgroundColor: theme.palette.text.secondary
                    },
                }}
            >
                <Typography onClick={handleShowAddUpdate} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
                <SpecificationManagementFormAddEdit isUpdateSpecification={isUpdateSpecification} render={fetchAllSpecification}/>
            </Dialog>
        </Fragment>
    </Box>
  );
};