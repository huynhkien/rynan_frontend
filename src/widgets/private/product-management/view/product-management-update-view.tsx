'use client'
import { Box, useTheme } from "@mui/material"
import { Breadcrumb } from "@/shared/components"
import { ProductManagementFormEdit } from "../ui/product-management-form-edit";

export const ProductManagementEditView = () => {
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
                        name: 'Cập nhật sản phẩm',
                        url: '/admin/product-management/'
                    }
                ]}
                />
            </Box>
            <Box>
                <ProductManagementFormEdit/>
            </Box>
        </>
    )
}