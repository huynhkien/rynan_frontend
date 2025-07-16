'use client'
import React, { Fragment, useState } from 'react';
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
  TableSortLabel,
  Typography,
  Box,
  Dialog,
} from '@mui/material';
import { Cancel, Delete, Edit} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/shared/hooks/useAppHook';
import {  ReceiptImportManagementFormListProductItemProps } from '@/features/receipt/type/receiptType';
import moment from 'moment';
import { removeItemProductReceipt } from '@/features/user/store/userSlice';
import { ReceiptImportManagementFormAddEditProductItem } from './receipt-import-management-form-add-edit-product-item';
import { deleteProductReceipt } from '@/features/receipt/api/receiptApi';
import { showModal } from '@/shared/store/appSlice';

const headCells = [
  { id: 'name', label: 'Tên sản phẩm', sortable: true },
  { id: 'specification', label: 'Quy cách', sortable: true },
  { id: 'quantity', label: 'Số lượng', sortable: true },
  { id: 'batchNumber', label: 'Số lô', sortable: true },
  { id: 'manufacturingDate', label: 'Ngày sản xuất', sortable: true },
  { id: 'expiryDate', label: 'Hạn sử dụng', sortable: true },
  { id: 'actions', label: 'Thao tác', sortable: false },

];

type SortOrder = 'asc' | 'desc';

export const ReceiptImportManagementFormListProductItem = ({productReceipt, materialId, render, specifications, action} : ReceiptImportManagementFormListProductItemProps) => {
    const [page, setPage] = useState(0);
    const dispatch = useAppDispatch();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [isEditProductState, setIsEditProductState] = useState<string | null>(null);
    const filteredHeadCells = action ? headCells.filter(cell => cell.id !== 'actions') : headCells;
    const theme = useTheme();
    // xóa sản phẩm theo trạng thái
    const handleDelete = async(id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm không?')) {
          
          dispatch(removeItemProductReceipt({
            pid: id
          }));
          toast.success('Xóa sản phẩm thành công')
      };
    }
    // xóa nguyên liệu trong dữ liệu
    const handleDeletePid = async(id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa nguyên liệu không?')) {
          dispatch(showModal({ isShowModal: true, modalType: 'loading' }));
          const response = await deleteProductReceipt(materialId as string, id)
          if(response.success){
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.success(response.message);
            if(render){
              render();
            }
          }else{
            dispatch(showModal({ isShowModal: false, modalType: null }));
            toast.error(response.message)
          }
      };
    }
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
    // Đóng dialog
    const handleCloseDialog = () => {
        setIsEditProductState(null);
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
                {filteredHeadCells.map((headCell, index) => (
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
              {!productReceipt || productReceipt?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align='center' sx={{ py: 4 }}>
                    Không có sản phẩm
                  </TableCell>
                </TableRow>
              ) : (
                productReceipt
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                        <Typography variant='body1'
                          sx={{
                            maxWidth: '100px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                          }}
                        >
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
                          {specifications?.find((el) => el._id === item.specification)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {item.batchNumber}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {moment(item.manufacturingDate).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Typography variant='body1'>
                          {moment(item.expiryDate).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      {!action &&
                        <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                color='success'
                                aria-label={`Sửa ${item.name_vn}`}
                                size='small'
                                onClick={() => setIsEditProductState(item.pid as string)}
                            >
                                  <Edit/>
                            </IconButton>
                            <IconButton 
                                color='error'
                                aria-label={`Xóa ${item.name_vn}`}
                                size='small'
                                onClick={materialId ? () => handleDeletePid(item.pid as string) : () => handleDelete(item.pid as string)}
                            >
                                <Delete />
                            </IconButton>
                      </TableCell>
                      }
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          count={productReceipt?.length || 0}
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
            open={isEditProductState !== null}
            onClose={handleCloseDialog}
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
            <Typography onClick={handleCloseDialog} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
            <ReceiptImportManagementFormAddEditProductItem materialId={materialId} isEditProductState={isEditProductState as string} productReceipt={productReceipt} specifications={specifications} render={render} />
        </Dialog>
      </Fragment>
    </Box>
  );
};