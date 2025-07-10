'use client'
import { Box, useTheme } from "@mui/material"
import { OrderManagementFormList } from "../ui/order-management-form-list"
import { Breadcrumb } from "@/shared/components"

export const OrderManagementView = () => {
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
                        name: 'Quản lý đơn hàng',
                        url: '/admin/order-management',
                    }]}
                />
            </Box>
            <OrderManagementFormList/>
        </>
    )
}