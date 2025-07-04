'use client'
import { Breadcrumb } from "@/shared/components"
import { ReceiptImportManagementFormAddEdit } from "../ui/receipt-import-management-form-add-edit"
import { Box, useTheme } from "@mui/material"

export const ReceiptImportManagementAddEditView = () => {
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
                        name: 'Nhập kho',
                        url: '/admin/receipt-management/import/add',
                    },
                ]}
                />
            </Box>
            <ReceiptImportManagementFormAddEdit/>
        </>
    )
}