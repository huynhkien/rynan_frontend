'use client'
import React, { Fragment, useState } from 'react';
import {
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
import Image from 'next/image';
import { useAppDispatch} from '@/shared/hooks/useAppHook';
import { removeItemOrderProduct } from '@/features/user/store/userSlice';
import { toast } from 'react-toastify';
import { OrderProductProps } from '@/features/order/type/orderType';
import { PriceType } from '@/shared/constant/common';
import { OrderManagementFormAddEditProduct } from './order-management-form-add-edit-product';
import { deleteProductOrder } from '@/features/order/api/orderApi';

const headCells = [
  { id: 'name', label: 'Tên sản phẩm', sortable: true },
  { id: 'thumb', label: 'Ảnh', sortable: true },
  { id: 'priceType', label: 'Loại giá', sortable: true },
  { id: 'price', label: 'Giá', sortable: true },
  { id: 'quantity', label: 'Số lượng', sortable: true },
  { id: 'actions', label: 'Thao tác', sortable: false },
];

type SortOrder = 'asc' | 'desc';

export const OrderManagementFormListProduct = ({
    orderProduct, 
    id, 
    edit, 
    productsData, 
    oid, 
    renderOrder
}: OrderProductProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [isEditProduct, setIsEditProduct] = useState<string | null>(null);
    const theme = useTheme();
    const dispatch = useAppDispatch();
    
    // xóa sản phẩm theo trạng thái
    const handleDeleteProduct = (id: string | number) => {
      dispatch(removeItemOrderProduct({pid: id}));
      toast.success('Xóa sản phẩm thành công')
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
        setIsEditProduct(null);
    };
    const handleDeleteProductOrder = async (pid: string) => {
        try {
            if(confirm('Bạn có chắc xóa sản phẩm này không?')){
              const response = await deleteProductOrder(oid as string , pid);
                if(response.success) {
                    toast.success(response.message);
                    if(renderOrder){
                      renderOrder();
                    }
                }
              }
        }catch(error: unknown){
            const errorMessage = (error as Error)?.message || 'Đã xảy ra lỗi không xác định';
            toast.error(errorMessage)
        }
    }

   
    return (
        <Box sx={{ width: '100%', height: "100%" }}>
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
                    {headCells
                    .filter((headCell) => !id || headCell.id !== 'actions')
                    .map((headCell, index) => (
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
                  {!orderProduct || orderProduct?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align='center' sx={{ py: 4 }}>
                        Không có sản phẩm
                      </TableCell>
                    </TableRow>
                  ) : (
                    orderProduct
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      ?.map((item) => (
                        <TableRow key={item.pid} hover>
                          <TableCell sx={{ verticalAlign: 'middle', maxWidth: 300 }}>
                            <Typography variant='body1' noWrap>
                              {item.name}
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
                                src={item.thumb? item.thumb : '/banner/banner-4.jpg'}
                                alt={item.name as string}
                                style={{ objectFit: 'cover' }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell sx={{ verticalAlign: 'middle' }}>
                            <Typography variant='body1'>
                              {PriceType.find((el) => el._id === item.priceType)?.name   || 'Chưa Thêm'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ verticalAlign: 'middle' }}>
                            <Typography variant='body1'>
                              {((item.price?.toLocaleString()))   || 'Chưa Thêm'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ verticalAlign: 'middle' }}>
                            <Typography variant='body1'>
                              {item.quantity  || 'Chưa Thêm'}
                            </Typography>
                          </TableCell>
                          {!id && (
                            <TableCell>
                            {/* Hành động */}
                            {edit &&(
                                <IconButton 
                                    color='success'
                                    aria-label={`Sửa ${item.pid}`}
                                    size='small'
                                    onClick={() => setIsEditProduct(item.pid as string)}
                                >
                                      <Edit/>
                                </IconButton>
                            )}
                                <IconButton 
                                    color='error'
                                    aria-label={`Xóa ${item.name}`}
                                    size='small'
                                    onClick={edit ? () => handleDeleteProductOrder(item?.pid as string) :  () => handleDeleteProduct(item?.pid)}
                                >
                                    <Delete />
                                </IconButton>
                          </TableCell>
                          )}
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component='div'
              count={orderProduct?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage='Số hàng mỗi trang:'
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
              }
            />
          <Fragment>
            <Dialog
                open={isEditProduct !== null}
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
                <Typography onClick={handleCloseDialog} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10, cursor: 'pointer'}}><Cancel /></Typography>
                <OrderManagementFormAddEditProduct 
                    edit='true' 
                    oid={oid} 
                    products={productsData}  
                    pid={isEditProduct as string} 
                    render={renderOrder} 
                />
            </Dialog>
          </Fragment>
        </Box>
    );
};