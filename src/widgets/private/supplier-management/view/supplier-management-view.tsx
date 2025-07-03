'use client'
import { Box, useTheme } from "@mui/material"
import { Breadcrumb } from "@/shared/components"
import { SupplierManagementFormList } from "../ui/supplier-management-form-list";

export const SupplierManagementView = () => {
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
                        name: 'Quản lý danh sách nhà cung cấp',
                        url: '/admin/receipt-management',
                    },
                ]}
                />
            </Box>
            <SupplierManagementFormList/>
        </>
    )
}