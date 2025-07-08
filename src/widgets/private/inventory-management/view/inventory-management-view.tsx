'use client'
import { Box, useTheme } from "@mui/material"
import { InventoryManagementFormList } from "../ui/inventory-management-form-list"
import { Breadcrumb } from "@/shared/components"

export const InventoryManagementView = () => {
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
                        name: 'Quản lý danh sách tồn kho',
                        url: '/admin/quote-management',
                    },
                ]}
                />
            </Box>
            <InventoryManagementFormList/>
        </>
    )
}