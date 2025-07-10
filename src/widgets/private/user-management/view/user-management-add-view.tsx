'use client'
import { Box, useTheme } from "@mui/material";
import { Breadcrumb } from "@/shared/components";
import { UserManagementFormAddEdit } from "../ui/user-management-form-add-edit";

export const UserManagementAddView = () => {
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
                        name: 'Thêm thông tin khách',
                        url: '/admin/user-management/add'
                    }
                ]}
                />
            </Box>
            <Box>
                <UserManagementFormAddEdit/>
            </Box>
            
        </>
    )
}