'use client'
import { Breadcrumb } from "@/shared/components"
import { Box, useTheme } from "@mui/material"
import { ReceiptExportManagementFormAddEditProduct } from "../ui/receipt-export-management-form-add-edit-product";

export const ReceiptExportManagementAddEditProductView = () => {
    const theme = useTheme();
    return (
        <>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    width: '100%'
                }}
            >
                <Breadcrumb
                    type='Admin'
                    breadcrumb={[{
                        name: 'Quản lý xuất kho kho',
                        url: '/admin/receipt-management/export',
                    },
                    {
                        name: 'Xuất kho sản phẩm',
                        url: '/admin/receipt-management/export/add/product',
                    },
                ]}
                />
            </Box>
            <ReceiptExportManagementFormAddEditProduct/>
        </>
    )
}