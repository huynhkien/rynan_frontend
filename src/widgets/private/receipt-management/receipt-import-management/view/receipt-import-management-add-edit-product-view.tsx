'use client'
import { Breadcrumb } from "@/shared/components"
import { Box, useTheme } from "@mui/material"
import { ReceiptImportManagementFormAddEditProduct } from "../ui/receipt-import-management-form-add-edit-product";

export const ReceiptImportManagementAddEditProductView = () => {
    const theme = useTheme();
    return (
        <>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.default,
                    width: '100%'
                }}
            >
                <Breadcrumb
                    type='Admin'
                    breadcrumb={[{
                        name: 'Quản lý nhập kho',
                        url: '/admin/receipt-management/import',
                    },
                    {
                        name: 'Nhập kho sản phẩm',
                        url: '/admin/receipt-management/import/add/product',
                    },
                ]}
                />
            </Box>
            <ReceiptImportManagementFormAddEditProduct/>
        </>
    )
}