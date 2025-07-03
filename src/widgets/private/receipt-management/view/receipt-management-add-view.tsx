'use client'
import { Box, useTheme } from "@mui/material"
import { ReceiptManagementFormAddEdit } from "../ui/receipt-management-form-add-edit"
import { Breadcrumb } from "@/shared/components"

export const ReceiptManagementAddView = () => {
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
                        name: 'Quản lý phiếu xuất & nhập',
                        url: '/admin/receipt-management',
                    },
                    {
                        name: 'Thêm phiếu xuất & nhập',
                        url: '/admin/receipt-management/add'
                    }
                ]}
                />
            </Box>
            <ReceiptManagementFormAddEdit/>
        </>
    )
}