'use client'
import { Breadcrumb } from "@/shared/components"
import { Box, useTheme } from "@mui/material"
import { CategoryManagementFormList } from "../ui/category-management-form-list";

export const CategoryManagementView = () => {
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
                        name: 'Quản lý danh mục',
                        url: '/admin/category-management',
                    }]}
                />
            </Box>
            <Box>
                <CategoryManagementFormList/>
            </Box>
        </>
    )
}