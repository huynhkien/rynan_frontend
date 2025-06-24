'use client'
import { Breadcrumb } from "@/shared/components"
import { Box, useTheme } from "@mui/material"
import { ProductManagementFormList } from "../ui/product-management-form-list";

export const ProductManagementView = () => {
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
                        name: 'Quản lý sản phẩm',
                        url: '/admin/product-management',
                    },
                ]}
                />
            </Box>
            <Box>
                <ProductManagementFormList/>
            </Box>
        </>
    )
}