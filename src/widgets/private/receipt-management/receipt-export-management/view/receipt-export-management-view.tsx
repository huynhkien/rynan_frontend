'use client'
import { Breadcrumb } from "@/shared/components"
import { ReceiptExportManagementFormList } from "../ui/receipt-export-management-form-list"
import { Box, useTheme } from "@mui/material"

export const ReceiptExportManagementView = () => {
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
                        name: 'Quản lý xuất kho',
                        url: '/admin/receipt-management/export',
                    },
                ]}
                />
            </Box>
            <ReceiptExportManagementFormList/>
        </>
    )
}