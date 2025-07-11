'use client'
import { Box, useTheme } from "@mui/material"
import { DecentralizeManagementFormList } from "../ui/decentralize-management-form-list"
import { Breadcrumb } from "@/shared/components";

export const DecentralizeManagementView = () => {
    const theme =useTheme();
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
                        name: 'Quản lý phân quyền ',
                        url: '/admin/decentralize-management',
                    },
                ]}
                />
                </Box>
                <Box>
                    <DecentralizeManagementFormList/>
                </Box>
        </>
    )
}