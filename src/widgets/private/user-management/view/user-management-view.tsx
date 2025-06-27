'use client'
import { Box, useTheme } from "@mui/material"
import { UserManagementFormList } from "../ui/user-management-form-list"
import { Breadcrumb } from "@/shared/components";

export const UserManagementView = () => {
    const theme =useTheme();
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
                        name: 'Quản lý khách hàng',
                        url: '/admin/user-management',
                    },
                ]}
                />
                </Box>
                <Box>
                    <UserManagementFormList/>
                </Box>
        </>
    )
}