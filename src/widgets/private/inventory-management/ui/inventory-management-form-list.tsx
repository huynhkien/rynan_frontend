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
  Tabs,
  Tab,
  IconButton,
  Collapse,
} from '@mui/material';
import { Delete, Error, ExitToApp, KeyboardArrowDown, KeyboardArrowUp, Warning } from '@mui/icons-material';
import moment from 'moment';
import { getAllUser } from '@/features/user/api/userApis';
import { UserData } from '@/features/user/type/userTypes';
import { Specification } from '@/features/specification/type/specificationType';
import { getAllSpecification } from '@/features/specification/api/specificationApi';
import { InventoryData } from '@/features/inventory/type/inventoryType';
import { getAllInventory } from '@/features/inventory/api/inventoryApi';
import { Product } from '@/features/product/type/productType';
import { getAllProduct } from '@/features/product/api/productApi';
import { MaterialData } from '@/features/material/type/materialType';
import { getAllMaterial } from '@/features/material/api/materialApi';



type SortOrder = 'asc' | 'desc';
const headCellsProduct = [
      { id: 'name', label: 'Tên sản phẩm', sortable: true },
      { id: 'code', label: 'Mã code', sortable: true },
      { id: 'quantity', label: 'Số lượng', sortable: true },
      { id: 'approvedBy', label: 'Nhân viên quản lý', sortable: true },
      { id: 'specification', label: 'Quy cách', sortable: true },
      { id: 'location.shelf', label: 'Vị trí', sortable: true },
      { id: 'location.positionCode', label: 'Mã ví trí', sortable: true },
      { id: 'createdAt', label: 'Ngày cập nhật', sortable: true },
    ];
const headCellsMaterial = [
      { id: 'name', label: 'Tên nguyên liệu', sortable: true },
      { id: 'code', label: 'Mã code', sortable: true },
      { id: 'quantity', label: 'Số lượng', sortable: true },
      { id: 'approvedBy', label: 'Nhân viên quản lý', sortable: true },
      { id: 'specification', label: 'Quy cách', sortable: true },
      { id: 'location.shelf', label: 'Vị trí', sortable: true },
      { id: 'location.positionCode', label: 'Mã ví trí', sortable: true },
      { id: 'createdAt', label: 'Ngày cập nhật', sortable: true },
    ];
const InventoryManagementFormListMaterial = ({inventory, users, specifications, materials} :  {inventory: InventoryData[], users: UserData[], specifications: Specification[], materials: MaterialData[]}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const theme = useTheme();
    // Hiển thị dropdown
    const toggleRow = (_id: string) => {
      setOpenRows(prev => ({
        ...prev,
        [_id]: !prev[_id]
      }));
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
        if(selectedItems.length === inventory?.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(inventory.map(el => el._id as string));
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
    const isAllSelected = selectedItems.length === inventory?.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length <= inventory.length;

    const filteredAndSortedData = useMemo(() => {
      const filtered = inventory?.filter(item => {
          // Lấy thông tin nguyên liệu từ materials array
          const material = materials.find(el => el._id === item.materialId);
          const user = users.find(el => el._id === item.approvedBy);
          const specification = specifications.find(el => el._id === material?.specification);
          
          // Tìm kiếm theo nhiều trường
          const matchesSearch = !searchTerm || 
              (material?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (material?.code?.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (item.location?.shelf?.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (item.location?.positionCode?.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (specification?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (item.currentStock?.toString().includes(searchTerm));
          
          // Lọc theo chữ cái
          const matchesAlpha = filterAlpha === 'all' ||
              (material?.name?.toLowerCase().startsWith(filterAlpha.toLowerCase())) ||
              (material?.code?.toLowerCase().startsWith(filterAlpha.toLowerCase())) ||
              (user?.name?.toLowerCase().startsWith(filterAlpha.toLowerCase())) ||
              (item.location?.shelf?.toLowerCase().startsWith(filterAlpha.toLowerCase())) ||
              (item.location?.positionCode?.toLowerCase().startsWith(filterAlpha.toLowerCase()));
          
          return matchesSearch && matchesAlpha;
      });

      // Sắp xếp
      if (sortBy && headCellsMaterial.find(cell => cell.id === sortBy)?.sortable) {
          filtered.sort((a, b) => {
              let aValue, bValue;
              // Lấy giá trị để sắp xếp dựa trên trường được chọn
              switch (sortBy) {
                  case 'name':
                      aValue = materials.find(el => el._id === a.materialId)?.name || '';
                      bValue = materials.find(el => el._id === b.materialId)?.name || '';
                      break;
                  case 'code':
                      aValue = materials.find(el => el._id === a.materialId)?.code || '';
                      bValue = materials.find(el => el._id === b.materialId)?.code || '';
                      break;
                  case 'quantity':
                      aValue = a.currentStock || 0;
                      bValue = b.currentStock || 0;
                      break;
                  case 'approvedBy':
                      aValue = users.find(el => el._id === a.approvedBy)?.name || '';
                      bValue = users.find(el => el._id === b.approvedBy)?.name || '';
                      break;
                  case 'specification':
                      const specA = specifications.find(el => el._id === materials.find(el => el._id === a.materialId)?.specification);
                      const specB = specifications.find(el => el._id === materials.find(el => el._id === b.materialId)?.specification);
                      aValue = specA?.name || '';
                      bValue = specB?.name || '';
                      break;
                  case 'location.shelf':
                      aValue = a.location?.shelf || '';
                      bValue = b.location?.shelf || '';
                      break;
                  case 'location.positionCode':
                      aValue = a.location?.positionCode || '';
                      bValue = b.location?.positionCode || '';
                      break;
                  case 'createdAt':
                      aValue = new Date(a.createdAt || 0).getTime();
                      bValue = new Date(b.createdAt || 0).getTime();
                      break;
                  default:
                      aValue = '';
                      bValue = '';
              }
              
              // So sánh giá trị
              if (typeof aValue === 'string' && typeof bValue === 'string') {
                  const comparison = aValue.localeCompare(bValue, 'vi');
                  return sortOrder === 'asc' ? comparison : -comparison;
              } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                  return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
              }
              
              return 0;
          });
      }

      return filtered;
  }, [searchTerm, sortBy, sortOrder, inventory, filterAlpha, materials, users, specifications]);
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
            Quản lý tồn kho nguyên liệu
          </Typography>
          </Box>
          <Box
            sx={{display: 'flex', gap: 2}}
          >
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
                    label='Tìm kiếm nguyên liệu tồn kho'
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
              Hiển thị: {filteredAndSortedData.length} nguyên liệu tồn kho
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
                        onClick={handleAllCheckbox}
                    />
                </TableCell>

                {headCellsMaterial.map((headCell, index) => (
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
                    {searchTerm ? 'Không tìm thấy nguyên liệu nào' : 'Danh sách trống'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                  <React.Fragment key={item._id}>
                    <TableRow  hover>
                        <TableCell padding='checkbox'>
                           <IconButton
                                aria-label='expand row'
                                size='small'
                                onClick={() => toggleRow(item._id as string)}
                              >
                                {openRows[item._id as string] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                            <Checkbox
                                color='primary'
                                checked={selectedItems.includes(item?._id as string)}
                                onChange={() => handleCheckbox(item?._id as string)}
                                inputProps={{
                                'aria-label': 'select all desserts',
                                }}
                            />
                        </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1' noWrap>
                          {materials.find(el => el._id === item.materialId)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle'}}>
                        <Typography variant='body1' >
                         {materials.find(el => el._id === item.materialId)?.code}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', display: 'flex', justifyContent: 'center'}}>
                          <Typography variant='body1' >
                              {item.currentStock}
                              </Typography>
                          {(Number(item.currentStock)) <= 50 && (
                              <Error sx={{ color: 'error.main', fontSize: theme.typography.fontSize }} titleAccess="Tồn kho thấp!" />
                          )}
                          {(Number(item.currentStock)) <= 100 && Number(item.currentStock) >=50 && (
                              <Warning sx={{ color: 'warning.main', fontSize: theme.typography.fontSize }} titleAccess="Tồn kho thấp!" />
                          )}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {users.find(el => el._id === item.approvedBy)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {specifications.find(el => el._id === materials.find(el => el._id === item.materialId)?.specification)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.location?.shelf}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.location?.positionCode}
                        </Typography>
                      </TableCell>
                       <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {moment(item.createdAt).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headCellsMaterial.length + 1} >
                        <Collapse in={openRows[item._id as string]} timeout='auto' unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant='body2' gutterBottom component='div'>
                              Lịch sử nhập và xuất kho
                            </Typography>
                            <Table size='small' >
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Nhân viên thực hiện</TableCell>
                                  <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Thời gian</TableCell>
                                  <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Hành động</TableCell>
                                  <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Số lượng thay đổi</TableCell>
                                  <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Số lượng trước đó</TableCell>
                                  <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Số lượng mới cập nhật</TableCell>
                                  <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Ghi chú</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {item?.approvalHistory?.map((el) => (
                                  <TableRow key={el._id}>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{users.find(u => u._id === el.approvedBy)?.name}</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{moment(el.approvedAt).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{el.action === 'created' ? 'Thêm mới' : el.action ==='updated' ? 'Cập nhật mới' : 'Xuất kho'}</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{el.quantityChange}</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{el.previousStock}</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{el.newStock}</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{el.notes}</TableCell>
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
    </Box>
  );
};
const InventoryManagementFormListProduct = ({inventory, users, specifications, products} :  {inventory: InventoryData[], users: UserData[], specifications: Specification[], products: Product[]}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
    const theme = useTheme();
    // Hiển thị dropdown
    const toggleRow = (_id: string) => {
      setOpenRows(prev => ({
        ...prev,
        [_id]: !prev[_id]
      }));
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
        if(selectedItems.length === inventory?.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(inventory.map(el => el._id as string));
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
    const isAllSelected = selectedItems.length === inventory?.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length <= inventory.length;

    // Thay thế logic filteredAndSortedData trong InventoryManagementFormListProduct
    const filteredAndSortedData = useMemo(() => {
        const filtered = inventory.filter(item => {
            // Lấy thông tin sản phẩm từ products array
            const product = products.find(el => el._id === item.productId);
            const user = users.find(el => el._id === item.approvedBy);
            const specification = specifications.find(el => el._id === product?.specification);
            
            // Tìm kiếm theo nhiều trường
            const matchesSearch = !searchTerm || 
                (product?.name_vn?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product?.code?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.location?.shelf?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.location?.positionCode?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (specification?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
            
            // Lọc theo chữ cái
            const matchesAlpha = filterAlpha === 'all' ||
                (product?.name_vn?.toLowerCase().startsWith(filterAlpha.toLowerCase())) ||
                (product?.code?.toLowerCase().startsWith(filterAlpha.toLowerCase())) ||
                (user?.name?.toLowerCase().startsWith(filterAlpha.toLowerCase())) ||
                (item.location?.shelf?.toLowerCase().startsWith(filterAlpha.toLowerCase())) ||
                (item.location?.positionCode?.toLowerCase().startsWith(filterAlpha.toLowerCase()));
            
            return matchesSearch && matchesAlpha;
        });

        // Sắp xếp
        if (sortBy && headCellsProduct.find(cell => cell.id === sortBy)?.sortable) {
            filtered.sort((a, b) => {
                let aValue, bValue;
                
                // Lấy giá trị để sắp xếp dựa trên trường được chọn
                switch (sortBy) {
                    case 'name':
                        aValue = products.find(el => el._id === a.productId)?.name_vn || '';
                        bValue = products.find(el => el._id === b.productId)?.name_vn || '';
                        break;
                    case 'code':
                        aValue = products.find(el => el._id === a.productId)?.code || '';
                        bValue = products.find(el => el._id === b.productId)?.code || '';
                        break;
                    case 'quantity':
                        aValue = a.currentStock || 0;
                        bValue = b.currentStock || 0;
                        break;
                    case 'approvedBy':
                        aValue = users.find(el => el._id === a.approvedBy)?.name || '';
                        bValue = users.find(el => el._id === b.approvedBy)?.name || '';
                        break;
                    case 'specification':
                        const specA = specifications.find(el => el._id === products.find(el => el._id === a.productId)?.specification);
                        const specB = specifications.find(el => el._id === products.find(el => el._id === b.productId)?.specification);
                        aValue = specA?.name || '';
                        bValue = specB?.name || '';
                        break;
                    case 'location.shelf':
                        aValue = a.location?.shelf || '';
                        bValue = b.location?.shelf || '';
                        break;
                    case 'location.positionCode':
                        aValue = a.location?.positionCode || '';
                        bValue = b.location?.positionCode || '';
                        break;
                    case 'createdAt':
                        aValue = new Date(a.createdAt || 0).getTime();
                        bValue = new Date(b.createdAt || 0).getTime();
                        break;
                    default:
                        aValue = '';
                        bValue = '';
                }
                
                // So sánh giá trị
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    const comparison = aValue.localeCompare(bValue, 'vi');
                    return sortOrder === 'asc' ? comparison : -comparison;
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
                }
                
                return 0;
            });
        }

        return filtered;
    }, [searchTerm, sortBy, sortOrder, inventory, filterAlpha, products, users, specifications]);
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
            Quản lý nhập kho
          </Typography>
          </Box>
          <Box
            sx={{display: 'flex', gap: 2}}
          >
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
                    label='Tìm kiếm sản phẩm tồn kho'
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
              Hiển thị: {filteredAndSortedData.length} sản phẩm tồn kho
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
                        onClick={handleAllCheckbox}
                    />
                </TableCell>

                {headCellsProduct.map((headCell, index) => (
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
                              <Checkbox
                                  color='primary'
                                  checked={selectedItems.includes(item?._id as string)}
                                  onChange={() => handleCheckbox(item?._id as string)}
                                  inputProps={{
                                  'aria-label': 'select all desserts',
                                  }}
                              />
                          </TableCell>
                                              <TableCell sx={{ verticalAlign: 'middle' }}>
                          <Typography variant='body1'>
                            {products.find(el => el._id === item.productId)?.name_vn}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle'}}>
                          <Typography variant='body1' >
                          {products.find(el => el._id === item.productId)?.code}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', display: 'flex', justifyContent: 'center'}}>
                            <Typography variant='body1' >
                                {item.currentStock}
                                </Typography>
                            {(Number(item.currentStock)) <= 50 && (
                                <Error sx={{ color: 'error.main', fontSize: theme.typography.fontSize }} titleAccess="Tồn kho thấp!" />
                            )}
                            {(Number(item.currentStock)) <= 100 && Number(item.currentStock) >=50 && (
                                <Warning sx={{ color: 'warning.main', fontSize: theme.typography.fontSize }} titleAccess="Tồn kho thấp!" />
                            )}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle' }}>
                          <Typography variant='body1'>
                            {users.find(el => el._id === item.approvedBy)?.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle' }}>
                          <Typography variant='body1'>
                            {specifications.find(el => el._id === products.find(el => el._id === item.productId)?.specification)?.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle' }}>
                          <Typography variant='body1'>
                            {item.location?.shelf}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle' }}>
                          <Typography variant='body1'>
                            {item.location?.positionCode}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle' }}>
                          <Typography variant='body1'>
                            {moment(item.createdAt).format('DD/MM/YYYY')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={headCellsMaterial.length + 1} >
                          <Collapse in={openRows[item._id as string]} timeout='auto' unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Typography variant='body2' gutterBottom component='div'>
                                Lịch sử nhập và xuất kho
                              </Typography>
                              <Table size='small' >
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Nhân viên thực hiện</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Thời gian</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Hành động</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Số lượng thay đổi</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Số lượng trước đó</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Số lượng mới cập nhật</TableCell>
                                    <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>Ghi chú</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item?.approvalHistory?.map((el) => (
                                    <TableRow key={el._id}>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{users.find(u => u._id === el.approvedBy)?.name}</TableCell>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{moment(el.approvedAt).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{el.action === 'created' ? 'Thêm mới' : el.action ==='updated' ? 'Cập nhật mới' : 'Xuất kho'}</TableCell>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{el.quantityChange}</TableCell>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{el.previousStock}</TableCell>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{el.newStock}</TableCell>
                                      <TableCell sx={{fontSize: theme.typography.body1.fontSize}}>{el.notes}</TableCell>
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
    </Box>
  );
};

export const InventoryManagementFormList = () => {
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [users, setUsers] = useState<UserData[] | [] >([]);
    const [specifications, setSpecifications] = useState<Specification[] | []>([]);
    const [materials, setMaterials] = useState<MaterialData[] | []>([]);
    const [products, setProducts] = useState<Product[] | []>([]);
    const [inventory, setInventory] = useState<InventoryData[] | []>([]);
    // Hiển thị thông tin quy cách
    const fetchAllSpecifications = async () => {
        const response = await getAllSpecification();
        if(response.success) {
          setSpecifications(response.data as Specification[]);
        }
      }
    // Hiển thị thông tin người dùng
    const fetchUsers = async() => {
      const response = await getAllUser();
      if(response.success) setUsers(response.data || []);
    }
    // Hiển thị thông tin tồn kho
    const fetchInventory = async() => {
        const response = await getAllInventory();
        if(response.success) setInventory(response.data || []);
    }
    // Hiển thị thông tin sản phẩm
    const fetchProducts = async() => {
        const response = await getAllProduct();
        if(response.success) setProducts(response.data || []);
    }
    // hiển thị nguyên liêu
    const fetchMaterials = async() => {
        const response = await getAllMaterial();
        if(response.success) setMaterials(response.data || []);
    }
    useEffect(() => {
      fetchUsers();
      fetchInventory();
      fetchAllSpecifications();
      fetchProducts();
      fetchMaterials();
    },[]);
    // Hiển thị thông tin phiếu theo sản phẩm
    const inventoryProduct = useMemo(() => {
      return inventory?.filter((item) => 
        item.type === 'product'
      ) || [];
    }, [inventory]);

    // Hiển thị thông tin phiếu theo nguyên liệu
    const inventoryMaterial = useMemo(() => {
      return inventory?.filter((item) => 
        item.type === 'material'
      ) || [];
    }, [inventory]);
    // Tab handler
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const getInfoTab = () => {
        switch (tabIndex) {
            case 0:
                return (
                    <InventoryManagementFormListMaterial inventory={inventoryMaterial} users={users} specifications={specifications} materials={materials}/>
                );
            case 1:
                return (
                    <InventoryManagementFormListProduct inventory={inventoryProduct} users={users} specifications={specifications} products={products}/>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ mb: 2,  }}>
            <Paper sx={{ mt: 2, borderRadius: 0, backgroundColor: theme.palette.background.default, display: 'flex' , justifyContent: 'space-between' }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    sx={{ width: { xs: '100%', md: '40%' }, py: 2,  }}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab sx={{color: theme.palette.text.primary}} label='Tồn kho nguyên liệu' />
                    <Tab sx={{color: theme.palette.text.primary}} label='Tồn kho sản phẩm' />
                    
                </Tabs>
            </Paper>
            <Box>{getInfoTab()}</Box>
        </Box>
    );
};