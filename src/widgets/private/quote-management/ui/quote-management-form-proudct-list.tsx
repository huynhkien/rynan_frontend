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
import { Cancel,  Edit} from '@mui/icons-material';
import Image from 'next/image';
import { QuoteFormProductList } from '@/features/quote/type/quoteType';
import { QuoteManagementFormProductEdit } from './quote-management-form-product-edit';

const headCells = [
  { id: 'code', label: 'Mã sản phẩm', sortable: true },
  { id: 'name', label: 'Tên sản phẩm', sortable: true },
  { id: 'thumb', label: 'Ảnh', sortable: true },
  { id: 'offering_price', label: 'Giá chào bán', sortable: true },
  { id: 'dealer_price', label: 'Giá đại lý', sortable: true },
  { id: 'store_price', label: 'Giá cửa hàng', sortable: true },
  { id: 'reference_price', label: 'Giá lẻ tham khảo', sortable: true },
  { id: 'actions', label: 'Thao tác', sortable: false },

];

type SortOrder = 'asc' | 'desc';

export const QuoteManagementFormProductList = ({product, render, id}: QuoteFormProductList) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [isEditProduct, setIsEditProduct] = useState<string | null>(null);
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
    // Đóng dialog
    const handleCloseDialog = () => {
        setIsEditProduct(null);
    };

   
return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 0, backgroundColor: theme.palette.background.paper }}>
        <TableContainer sx={{ 
          '&::-webkit-scrollbar': {
            display: 'none'
          },
        
        }}>
          {id && (
            <Box>
              <Typography variant='body2' sx={{p:2, textAlign: 'center',fontWeight: 'bold', color: theme.palette.primary.main}}>Danh sách sản phẩm hiện có</Typography>
          </Box>
          )}
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: theme.typography.fontWeightBold,
                }}
              >
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
                      
                      <TableCell>
                        {/* Hành động */}
                            <IconButton 
                                color='success'
                                aria-label={`Sửa ${item.name_vn}`}
                                size='small'
                                onClick={() => setIsEditProduct(item._id)}
                            >
                                  <Edit/>
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
                    borderRadius: 0,
                    backgroundColor: theme.palette.text.secondary
                },
            }}
        >
            <Typography onClick={handleCloseDialog} color='text.secondary' component='span' sx={{position: 'absolute', right: 10, top: 10}}><Cancel /></Typography>
            <QuoteManagementFormProductEdit productId={isEditProduct } ren={render}/>
        </Dialog>
      </Fragment>
    </Box>
  );
};