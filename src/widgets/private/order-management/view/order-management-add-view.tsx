'use client'
import { Box, useTheme } from "@mui/material"
import { Breadcrumb } from "@/shared/components"
import { OrderManagementFormAddEdit } from "../ui/order-management-form-add-edit";

export const OrderManagementAddView = () => {
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
                    },
                    {
                        name: 'Thêm đơn hàng mới',
                        url: '/admin/order-management/add'
                    }
                ]}
                />
            </Box>
            <OrderManagementFormAddEdit/>
        </>
    )
}