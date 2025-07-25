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
import { Add, Cancel, Delete, Edit} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { MaterialData } from '@/features/material/type/materialType';
import { deleteMaterial, deleteMaterials, getAllMaterial } from '@/features/material/api/materialApi';
import { MaterialManagementFormAddEdit } from './material-management-form-add-edit';
import { Specification } from '@/features/specification/type/specificationType';
import { getAllSpecification } from '@/features/specification/api/specificationApi';

const headCells = [
  { id: 'name', label: 'Tên nguyên liệu', sortable: true },
  { id: 'code', label: 'Mã code', sortable: false },
  { id: 'note', label: 'Ghi chú', sortable: true },
  { id: 'specification', label: 'Quy cách', sortable: false },
  { id: 'actions', label: 'Thao tác', sortable: false }
];

type SortOrder = 'asc' | 'desc';

export const MaterialManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [material, setMaterial] = useState<MaterialData[] | []>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isAddMaterial, setIsAddMaterial] = useState<boolean>(false);
    const [specification, setSpecification] = useState<Specification[] | []>([]);
    const [isUpdateMaterial, setIsUpdateMaterial] = useState<string | null>(null);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const theme = useTheme();
    // Hiển thị thông tin quy cách
    const fetchSpecification = async() => {
        const response = await getAllSpecification();
        if(response.success) setSpecification(response.data as Specification[])
    }
    useEffect(() => {
        fetchSpecification();
    },[]);
    const fetchAllMaterial = async () => {
        const response = await getAllMaterial();
        if(response.success) {
          setMaterial(response.data as MaterialData[]);
        }
      }

    // hiển thị tất cả nguyên liệu
    useEffect(() => {
      fetchAllMaterial();
    },[]);
    // xóa nguyên liệu
    const handleDelete = async(id: string) => {
      try{
        if(window.confirm('Bạn có chắc muốn xóa nguyên liệu không?')){
        const response = await deleteMaterial(id);
        if(response.success) {
          toast.success(response.message);
          fetchAllMaterial();
          return;
            }
        }
      }catch(error: unknown){
        toast.error(`Lỗi: ${error}`);
        fetchAllMaterial();
      }
    };
    // Xóa nhiều 
    const handleDeleteMaterials = async() => {
      try{
         if(window.confirm('Bạn có chắc muốn xóa nguyên liệu không?')){
        const response = await deleteMaterials(selectedItems);
        if(response.success) {
          toast.success(response.message);
          fetchAllMaterial();
          return;
        }
      }
      }catch(error: unknown){
        const errorMessage = (error as Error).message;
        toast.error(errorMessage);
        fetchAllMaterial();
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
        if(selectedItems.length === material?.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(material.map(el => el._id as string));
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
    const isAllSelected = selectedItems.length === material?.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length <= material.length;

    const filteredAndSortedData = useMemo(() => {
        const filtered = material.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.note.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAlpha =
                  filterAlpha === 'all' ||
                  item.code.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
                  item.name.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
                  item.note.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
                  specification.find(el => el._id === item.specification)?.name.toLowerCase().startsWith(filterAlpha.toLowerCase());
        return matchesSearch && matchesAlpha;
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
    }, [searchTerm, sortBy, sortOrder, material, filterAlpha, specification]);
    // xử lý thêm sản phẩm 
    const handleShowAddUpdate = () => {
        if(isAddMaterial){
            setIsAddMaterial(prev => !prev)
        }else{
            setIsUpdateMaterial(null)
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
            Quản lý nguyên liệu
          </Typography>
          </Box>
          <Box
            sx={{display: 'flex', gap: 2}}
          >
            <Box onClick={() => setIsAddMaterial(true)} sx={{ display: 'flex', alignItems: 'center', backgroundColor: theme.palette.primary.main, color: theme.palette.text.secondary, p: 1, cursor: 'pointer' }}>
                <Add sx={{fontSize: theme.typography.fontSize}}/> Thêm nguyên liệu
            </Box>
            {isIndeterminate && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: theme.palette.text.secondary,  cursor: 'pointer' }}>
                    <Box onClick={handleDeleteMaterials} sx={{p: 1, backgroundColor: theme.palette.error.main, display: 'flex', alignItems: 'center'}}><Delete sx={{fontSize: theme.typography.fontSize}}/> Xóa tất cả</Box>
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
                    label='Tìm kiếm nguyên liệu'
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
                    placeholder='Nhập tên, mô tả,...'
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
              Hiển thị: {filteredAndSortedData.length} nguyên liệu
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
                                checked={selectedItems.includes(item?._id as string)}
                                onChange={() => handleCheckbox(item?._id as string)}
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
                          {item.code}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.note}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {specification.find((el) => el._id === item.specification)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                onClick={() => setIsUpdateMaterial(item._id as string)} 
                                color='success'
                                aria-label={`Sửa ${item.name}`}
                                size='small'
                            >
                                <Edit/>
                            </IconButton>
                            <IconButton 
                                onClick={() => handleDelete(item._id as string)} 
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
                open={isAddMaterial || isUpdateMaterial !== null}
                onClose={handleShowAddUpdate}
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
                <Typography onClick={handleShowAddUpdate} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
                <MaterialManagementFormAddEdit isUpdateMaterial={isUpdateMaterial} render={fetchAllMaterial} specification={specification}/>
            </Dialog>
        </Fragment>
    </Box>
  );
};