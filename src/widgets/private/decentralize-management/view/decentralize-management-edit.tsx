'use client'
import { Box, useTheme } from "@mui/material";
import { Breadcrumb } from "@/shared/components";
import { DecentralizeManagementFormAddEdit } from "../ui/decentralize-management-form-add-edit";

export const DecentralizeManagementEditView = () => {
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
                        name: 'Cập nhật quyền',
                        url: '/admin/decentralize-management/'
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