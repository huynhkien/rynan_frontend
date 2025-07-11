'use client'
import { Box, useTheme } from "@mui/material";
import { Breadcrumb } from "@/shared/components";
import { DecentralizeManagementFormAddEdit } from "../ui/decentralize-management-form-add-edit";

export const DecentralizeManagementAddView = () => {
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
                        name: 'Quản lý phân quyền',
                        url: '/admin/decentralize-management',
                    },
                    {
                        name: 'Thêm quyền',
                        url: '/admin/user-management/add'
                    }
                ]}
                />
            </Box>
            <Box>
                <DecentralizeManagementFormAddEdit/>
            </Box>
            
        </>
    )
}