'use client'
import { Breadcrumb } from "@/shared/components"
import { ReceiptImportManagementFormList } from "../ui/receipt-import-management-form-list"
import { Box, useTheme } from "@mui/material"

export const ReceiptImportManagementView = () => {
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
                ]}
                />
            </Box>
            <ReceiptImportManagementFormList/>
        </>
    )
}