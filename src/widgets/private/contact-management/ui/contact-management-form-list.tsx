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
} from '@mui/material';
import {  Cancel, Delete, Mail } from '@mui/icons-material';
import { toast } from 'react-toastify';
import moment from 'moment';
import { ContactData } from '@/features/contact/type/contactType';
import { deleteContact, getAllContact } from '@/features/contact/api/contactApi';
import { ContactManagementFormSendMail } from './contact-management-form-send-mail';

const headCells = [
  { id: 'name', label: 'Người liên hệ', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'address', label: 'Địa chỉ', sortable: true },
  { id: 'phone', label: 'Số điện thoại', sortable: true },
  { id: 'message', label: 'Tin nhắn', sortable: true },
  { id: 'createdAt', label: 'Ngày liên hệ', sortable: false },
  { id: 'pending', label: 'Trạng thái', sortable: false },
  { id: 'actions', label: 'Thao tác', sortable: false }

];

type SortOrder = 'asc' | 'desc';

export const ContactManagementFormList = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [contacts, setContacts] = useState<ContactData[] | []>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [filterAlpha, setFilterAlpha] = useState<string>('all');
    const [isSendMail, setIsSendMail] = useState<string | null>(null);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const theme = useTheme();
    const fetchAllContact = async () => {
        const response = await getAllContact();
        if(response.success) {
          setContacts(response.data || []);
        }
      }
    // hiển thị tất cả thông tin liên hệ
    useEffect(() => {
      fetchAllContact();
    },[]);
    // xóa thông tin liên hệ
    const handleDelete = async(id: string) => {
      try{
        window.confirm('Bạn có chắc muốn xóa thông tin liên hệ này đúng không?');
        const response = await deleteContact(id);
        if(response.success) {
          toast.success(response.message);
          fetchAllContact();
          return;
        }else{
          toast.error(response.message);
          fetchAllContact();
        }
      }catch(error: unknown){
        toast.error(`Lỗi: ${error}`);
        fetchAllContact();
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
    const filtered = contacts.filter(item => {
      const matchesSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.address?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ; 
        
      const matchesAlpha =
        filterAlpha === 'all' ||
        item.name?.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
        item.address?.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
        item.email?.toLowerCase().startsWith(filterAlpha.toLowerCase()) ||
        item.phone?.toLowerCase().startsWith(filterAlpha.toLowerCase()) ;

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
  }, [searchTerm, sortBy, sortOrder, contacts, filterAlpha]);
    // Tắt dialog
    const handleCloseDialog = async() => {
        setIsSendMail(null);
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
            Quản lý thông tin liên hệ
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
                    label='Tìm kiếm thông tin liên hệ'
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
              Hiển thị: {filteredAndSortedData.length} thông tin liên hệ
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
                    {searchTerm ? 'Không tìm thấy thông tin liên hệ nào' : 'Danh sách trống'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1' noWrap>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1' noWrap>
                          {item.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1' noWrap>
                          {item.address}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1' noWrap>
                          {item.phone}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <TextField 
                         multiline
                         value={item.message}
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
                       <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1' noWrap>
                          {item.status === 'pending' ? 'Chưa phản hồi' : 'Đã phản hồi'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                color='success'
                                aria-label={`Sửa ${item.name}`}
                                size='small'
                                onClick={() => setIsSendMail(item.email)}
                            >
                                  <Mail/>
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
                open={isSendMail !==null}
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
                <ContactManagementFormSendMail email={isSendMail as string} render={fetchAllContact}/>
            </Dialog>
        </Fragment>
    </Box>
  );
};