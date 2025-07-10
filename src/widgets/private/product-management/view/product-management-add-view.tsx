'use client'
import { Box, useTheme } from "@mui/material"
import { ProductManagementFormAdd } from "../ui/product-management-form-add"
import { Breadcrumb } from "@/shared/components"

export const ProductManagementAddView = () => {
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
                        name: 'Quản lý sản phẩm',
                        url: '/admin/product-management',
                    },
                    {
                        name: 'Thêm sản phẩm',
                        url: '/admin/product-management/add'
                    }
                ]}
                />
            </Box>
            <Box>
                <ProductManagementFormAdd/>
            </Box>
        </>
    )
}