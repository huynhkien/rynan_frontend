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
  Dialog,
} from '@mui/material';
import {  Cancel,  Delete,  ExitToApp } from '@mui/icons-material';
import { ReceiptData, ReceiptMaterialData, ReceiptProductData } from '@/features/receipt/type/receiptType';
import {  getAllReceipt } from '@/features/receipt/api/receiptApi';
import moment from 'moment';
import { getAllUser } from '@/features/user/api/userApis';
import { UserData } from '@/features/user/type/userTypes';
import { ReceiptStatus } from '@/shared/constant/common';
import { SupplierData } from '@/features/supplier/type/supplierType';
import { getAllSupplier } from '@/features/supplier/api/supplierApi';
import { Specification } from '@/features/specification/type/specificationType';
import { getAllSpecification } from '@/features/specification/api/specificationApi';
import { ReceiptImportManagementFormListMaterialItem } from '../../../receipt-import-management/ui/receipt-import-management-form-list-material-item';
import { ReceiptImportManagementFormListProductItem } from '../../../receipt-import-management/ui/receipt-import-management-form-list-product-item';
import { ReceiptExportManagementFormListProductItem } from '../../../receipt-export-management/ui/receipt-export-management-form-list-product-item';
import { ReceiptExportManagementFormListMaterialItem } from '../../../receipt-export-management/ui/receipt-export-management-form-list-material-item';



type SortOrder = 'asc' | 'desc';
const headCellsProduct = [
      { id: 'code', label: 'Mã phiếu nhập', sortable: true },
      { id: 'staff', label: 'Nhân viên thực hiện', sortable: false },
      { id: 'status', label: 'Trạng thái', sortable: true },
      { id: 'users', label: 'Khách hàng', sortable: false },
      { id: 'produced_at', label: 'Sản xuất', sortable: false },
      { id: 'products', label: 'Sản phẩm', sortable: false },
      { id: 'note', label: 'Ghi chú', sortable: false },
      { id: 'total', label: 'Tổng thanh toán', sortable: false },
      { id: 'createdAt', label: 'Ngày tạo', sortable: false },
      { id: 'approvedBy', label: 'Người duyệt', sortable: false },
    ];
const headCellsMaterial = [
      { id: 'code', label: 'Mã phiếu nhập', sortable: true },
      { id: 'staff', label: 'Nhân viên thực hiện', sortable: false },
      { id: 'status', label: 'Trạng thái', sortable: true },
      { id: 'users', label: 'Khách hàng', sortable: false },
      { id: 'supplier', label: 'Nhà cung cấp', sortable: false },
      { id: 'materials', label: 'Nguyên liệu', sortable: false },
      { id: 'note', label: 'Ghi chú', sortable: false },
      { id: 'total', label: 'Tổng thanh toán', sortable: false },
      { id: 'createdAt', label: 'Ngày tạo', sortable: false },
      { id: 'approvedBy', label: 'Người duyệt', sortable: false },
    ];
const ReceiptImportManagementFormListMaterial = ({receipts, users, suppliers, specifications}: {receipts:ReceiptData[]; users: UserData[], suppliers: SupplierData[], specifications?: Specification[]} ) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isShowMaterial, setIsShowMaterial] = useState<string| null>(null);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const filteredMaterial = headCellsMaterial.filter(el => el.id !== 'users')
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
    // click chọn tất cả
    const handleAllCheckbox = () => {
        if(selectedItems.length === receipts?.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(receipts.map(el => el._id as string));
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
    const isAllSelected = selectedItems.length === receipts?.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length <= receipts.length;
    const filteredAndSortedData = useMemo(() => {
        const filtered = receipts?.filter(item => {
        const matchesSearch =
                  item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  users.find(el => el._id === item.staff)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  suppliers.find(el => el._id === item.supplier)?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  ReceiptStatus.find(el => el._id === item.status)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ; 
        const matchesAlpha =
                  filterAlpha === 'all' ||
                  item.code.toLowerCase().includes(filterAlpha.toLowerCase()) ||
                  users.find(el => el._id === item.staff)?.name.toLowerCase().includes(filterAlpha.toLowerCase()) ||
                  suppliers.find(el => el._id === item.supplier)?.name.toLowerCase().includes(filterAlpha.toLowerCase()) || 
                  ReceiptStatus.find(el => el._id === item.status)?.name.toLowerCase().includes(filterAlpha.toLowerCase()) ; 
        return matchesSearch && matchesAlpha;
        });
      // Sắp xếp
      if (sortBy && headCellsMaterial.find(cell => cell.id === sortBy)?.sortable) {
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
    }, [searchTerm, sortBy, sortOrder, receipts, filterAlpha, users, suppliers]);
    // Đóng dialog
    const handleCloseDialog = async () => {
        setIsShowMaterial(null)
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
                    label='Tìm kiếm phiếu nhập kho'
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
              Hiển thị: {filteredAndSortedData.length} phiếu nhập kho
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

                {filteredMaterial.map((headCell, index) => (
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
                          {users.find(el => el._id === item.staff)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {ReceiptStatus.find(el => el._id === item.status)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {suppliers.find(el => el._id === item.supplier)?.name}
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
                          onClick={() => setIsShowMaterial(item?._id as string)}
                      >
                        <Typography variant='body1'>
                          {item.materials?.length}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.note || 'Không có ghi chú'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.total.toLocaleString()} VNĐ
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {moment(item?.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {users.find(el => el._id === item.approvedBy)?.name}
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
        open={isShowMaterial !==null }
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
                    borderRadius: 0
                },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Typography onClick={handleCloseDialog} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
          {isShowMaterial && <ReceiptImportManagementFormListMaterialItem action='show' materialReceipt={(receipts.find(el => el._id === isShowMaterial)?.materials)} specifications={specifications as Specification[]}/>}
        </Box>
      </Dialog>  
    </Box>
  );
};
const ReceiptImportManagementFormListProduct = ({receipts, users, specifications, }: {receipts:ReceiptData[]; users: UserData[], specifications?: Specification[]}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const [isShowProduct, setIsShowProduct] = useState<string| null>(null);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const theme = useTheme();
    const filteredHeadCells = headCellsProduct.filter(el => el.id !== 'total' && el.id !== 'users');
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
        if(selectedItems.length === receipts?.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(receipts.map(el => el._id as string));
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
    const isAllSelected = selectedItems.length === receipts?.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length <= receipts.length;

    const filteredAndSortedData = useMemo(() => {
        const filtered = receipts.filter(item => {
        const matchesSearch =
                  item.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  users.find(el => el._id === item.staff)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  ReceiptStatus.find(el => el._id === item.status)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ; 
        const matchesAlpha =
                  filterAlpha === 'all' ||
                  item.code.toLowerCase().includes(filterAlpha.toLowerCase()) || 
                  users.find(el => el._id === item.staff)?.name.toLowerCase().includes(filterAlpha.toLowerCase()) ||
                  ReceiptStatus.find(el => el._id === item.status)?.name.toLowerCase().includes(filterAlpha.toLowerCase()) ; 
        return matchesSearch && matchesAlpha;
        });

    // Sắp xếp
    if (sortBy && headCellsProduct.find(cell => cell.id === sortBy)?.sortable) {
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
    }, [searchTerm, sortBy, sortOrder, receipts, filterAlpha, users]);
    // Đóng dialog
    const handleCloseDialog = async () => {
            setIsShowProduct(null);
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
                    label='Tìm kiếm phiếu nhập kho'
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
              Hiển thị: {filteredAndSortedData.length} phiếu nhập kho
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

                {filteredHeadCells.map((headCell, index) => (
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
                          {users.find(el => el._id === item.staff)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {ReceiptStatus.find(el => el._id === item.status)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.produced_at}
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
                          onClick={() => setIsShowProduct(item?._id as string)}
                      >
                        <Typography variant='body1'>
                          {item.products?.length}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item?.note || 'Không ghi chú'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {users.find(el => el._id === item.approvedBy)?.name}
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
                          borderRadius: 0
                      },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Typography onClick={handleCloseDialog} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
                {isShowProduct && <ReceiptImportManagementFormListProductItem action='show' productReceipt={(receipts.find(el => el._id === isShowProduct)?.products as ReceiptProductData[]) } specifications={specifications as Specification[]}/>}
              </Box>
            </Dialog>
    </Box>
  );
};

const ReceiptExportManagementFormListMaterial = ({receipts, users, suppliers, specifications, }: {receipts:ReceiptData[]; users: UserData[], suppliers: SupplierData[], specifications?: Specification[]}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isShowMaterial, setIsShowMaterial] = useState<string | null>(null);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const filteredHeadCells = headCellsMaterial.filter(el => el.id !== 'supplier');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
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
    // click chọn tất cả
    const handleAllCheckbox = () => {
        if(selectedItems.length === receipts?.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(receipts.map(el => el._id as string));
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
    const isAllSelected = selectedItems.length === receipts?.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length <= receipts.length;
    const filteredAndSortedData = useMemo(() => {
        const filtered = receipts?.filter(item => {
        const matchesSearch =
                  item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  users.find(el => el._id === item.staff)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  suppliers.find(el => el._id === item.supplier)?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  ReceiptStatus.find(el => el._id === item.status)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ; 
        const matchesAlpha =
                  filterAlpha === 'all' ||
                  item.code.toLowerCase().includes(filterAlpha.toLowerCase()) ||
                  users.find(el => el._id === item.staff)?.name.toLowerCase().includes(filterAlpha.toLowerCase()) ||
                  suppliers.find(el => el._id === item.supplier)?.name.toLowerCase().includes(filterAlpha.toLowerCase()) || 
                  ReceiptStatus.find(el => el._id === item.status)?.name.toLowerCase().includes(filterAlpha.toLowerCase()) ; 
        return matchesSearch && matchesAlpha;
        });

      // Sắp xếp
      if (sortBy && headCellsMaterial.find(cell => cell.id === sortBy)?.sortable) {
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
    }, [searchTerm, sortBy, sortOrder, receipts, filterAlpha, users, suppliers]);
    // Tắt dialog
    const handleCloseDialog = async () => {
        setIsShowMaterial(null);
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
            Quản lý xuất kho
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
                    label='Tìm kiếm phiếu nhập kho'
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
              Hiển thị: {filteredAndSortedData.length} phiếu nhập kho
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

                {filteredHeadCells.map((headCell, index) => (
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
                          {users.find(el => el._id === item.staff)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {ReceiptStatus.find(el => el._id === item.status)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {users.find(el => el._id === item.exportedTo)?.name}
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
                          onClick={() =>setIsShowMaterial(item?._id as string)}
                      >
                        <Typography variant='body1'>
                          {item.materials?.length}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.note || 'Không có ghi chú'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.total.toLocaleString()} VNĐ
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {moment(item?.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {users.find(el => el._id === item.approvedBy)?.name}
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
      <Dialog
              open={isShowMaterial !==null }
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
                          borderRadius: 0
                      },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Typography onClick={handleCloseDialog} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
                {isShowMaterial && <ReceiptExportManagementFormListMaterialItem action='show' materialReceipt={(receipts.find(el => el._id === isShowMaterial)?.materials as ReceiptMaterialData[]) } specifications={specifications as Specification[]}/>}
              </Box>
            </Dialog> 
    </Box>
  );
};
const ReceiptExportManagementFormListProduct = ({receipts, users,specifications, }: {receipts:ReceiptData[]; users: UserData[], specifications?: Specification[]}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const [isShowProduct, setIsShowProduct] = useState<string| null>(null);
    const theme = useTheme();
    const filteredHeadCells = headCellsProduct.filter(el => el.id !== 'produced_at');
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
        if(selectedItems.length === receipts?.length){
            setSelectedItems([]);
        }else{
            setSelectedItems(receipts.map(el => el._id as string));
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
    const isAllSelected = selectedItems.length === receipts?.length;
    const isIndeterminate = selectedItems.length > 0 && selectedItems.length <= receipts.length;
    const filteredAndSortedData = useMemo(() => {
        const filtered = receipts.filter(item => {
        const matchesSearch =
                  item.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  users.find(el => el._id === item.staff)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  ReceiptStatus.find(el => el._id === item.status)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ; 
        const matchesAlpha =
                  filterAlpha === 'all' ||
                  item.code.toLowerCase().includes(filterAlpha.toLowerCase()) || 
                  users.find(el => el._id === item.staff)?.name.toLowerCase().includes(filterAlpha.toLowerCase()) ||
                  ReceiptStatus.find(el => el._id === item.status)?.name.toLowerCase().includes(filterAlpha.toLowerCase()) ; 
        return matchesSearch && matchesAlpha;
        });
    // Sắp xếp
    if (sortBy && headCellsProduct.find(cell => cell.id === sortBy)?.sortable) {
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
    }, [searchTerm, sortBy, sortOrder, receipts, filterAlpha, users]);
    // Đóng dialog
    const handleCloseDialog = async () => {
        setIsShowProduct(null)
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
            Quản lý xuất kho
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
                    label='Tìm kiếm phiếu nhập kho'
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
              Hiển thị: {filteredAndSortedData.length} phiếu nhập kho
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

                {filteredHeadCells.map((headCell, index) => (
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
                          {users.find(el => el._id === item.staff)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {ReceiptStatus.find(el => el._id === item.status)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {users.find(el => el._id === item.exportedTo)?.name}
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
                          onClick={() => setIsShowProduct(item._id as string)}
                      >
                        <Typography variant='body1'>
                          {item.products?.length}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item?.note || 'Không ghi chú'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.total.toLocaleString()} VNĐ
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {users.find(el => el._id === item.approvedBy)?.name}
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
          count={filteredAndSortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Số hàng mỗi trang:'
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }/>
      </Paper>
      {/* Dialog hiển thị sản phẩm */}
                  <Dialog
                    open={isShowProduct !==null }
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
                                borderRadius: 0
                            },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Typography onClick={handleCloseDialog} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
                      {isShowProduct && <ReceiptExportManagementFormListProductItem action='show' productReceipt={(receipts.find(el => el._id === isShowProduct)?.products as ReceiptProductData[]) } specifications={specifications as Specification[]}/>}
                    </Box>
                  </Dialog>
    </Box>
  );
};
export const ReceiptApproveCancelManagementFormList = () => {
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [receiptsExport, setReceiptsExport] = useState<ReceiptData[] | [] >([]);
    const [receiptsImport, setReceiptsImport] = useState<ReceiptData[] | [] >([]);
    const [users, setUsers] = useState<UserData[] | [] >([]);
    const [suppliers, setSuplliers] = useState<SupplierData[] | []>([]);
    const [specifications, setSpecifications] = useState<Specification[]>();
    
    // Hiển thị thông tin quy cách
    const fetchAllReceipts = async () => {
        const response = await getAllReceipt();
        if(response.success) {
          setReceiptsExport(response.data?.filter(el => el.typeReceipt === 'export') || []);
          setReceiptsImport(response.data?.filter(el => el.typeReceipt === 'import') || []);
        }
      }
    // Hiển thị thông tin người dùng
    const fetchUsers = async() => {
      const response = await getAllUser();
      if(response.success) setUsers(response.data || []);
    }
    // Hiển thị thông tin quy cách
    const fetchSpecifications = async() => {
      const response = await getAllSpecification();
      if(response.success) setSpecifications(response.data);
    }
    // Hiển thị thông tin nhà cung cấp 
    const fetchSuppliers = async() => {
      const response = await  getAllSupplier();
      if(response.success) setSuplliers(response.data || []);
    }
    // hiển thị tất cả phiếu nhập kho
    useEffect(() => {
      fetchAllReceipts();
      fetchUsers();
      fetchSuppliers();
      fetchSpecifications();
    },[]);
    // Hiển thị thông tin phiếu theo sản phẩm
    const receiptsImportProduct = useMemo(() => {
      return receiptsImport?.filter((receipt) => 
        receipt.products && receipt.products.length > 0 && receipt.status === 'cancelled'
      ) || [];
    }, [receiptsImport]);
    const receiptsImportMaterial = useMemo(() => {
      return receiptsImport?.filter((receipt) => 
        receipt.materials && receipt.materials.length > 0 && receipt.status === 'cancelled'
      ) || [];
    }, [receiptsImport]);
    const receiptsExportProduct = useMemo(() => {
      return receiptsExport?.filter((receipt) => 
        receipt.products && receipt.products.length > 0 && receipt.status === 'cancelled'
      ) || [];
    }, [receiptsExport]);
    const receiptsExportMaterial = useMemo(() => {
      return receiptsExport?.filter((receipt) => 
        receipt.materials && receipt.materials.length > 0 && receipt.status === 'cancelled'
      ) || [];
    }, [receiptsExport]);

    // Tab handler
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const getInfoTab = () => {
        switch (tabIndex) {
            case 0:
                return (
                    <ReceiptImportManagementFormListMaterial suppliers={suppliers} receipts={receiptsImportMaterial} users={users} specifications={specifications} />
                );
            case 1:
                return (
                    <ReceiptImportManagementFormListProduct receipts={receiptsImportProduct} users={users} specifications={specifications} />
                );
            case 2:
                return (
                    <ReceiptExportManagementFormListMaterial suppliers={suppliers} receipts={receiptsExportMaterial} users={users} specifications={specifications as Specification[]}  />
                );
            case 3:
                return (
                    <ReceiptExportManagementFormListProduct receipts={receiptsExportProduct} users={users} specifications={specifications} />
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
                    sx={{ width: { xs: '100%', md: '100%' }, py: 2,  }}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab sx={{color: theme.palette.text.primary}} label='Nhập kho nguyên liệu' />
                    <Tab sx={{color: theme.palette.text.primary}} label='Nhập kho sản phẩm' />
                    <Tab sx={{color: theme.palette.text.primary}} label='Xuất kho nguyên liệu' />
                    <Tab sx={{color: theme.palette.text.primary}} label='Xuất kho sản phẩm' />
                    
                </Tabs>
            </Paper>
            <Box>{getInfoTab()}</Box>
        </Box>
    );
};