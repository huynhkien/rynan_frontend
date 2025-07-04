'use client'
import { Box, useTheme } from "@mui/material"
import { ReceiptExportManagementFormAddEdit } from "../ui/receipt-export-management-form-add-edit"
import { Breadcrumb } from "@/shared/components"

export const ReceiptExportManagementAddEditView = () => {
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
            <ReceiptExportManagementFormAddEdit/>
        </>
    )
}