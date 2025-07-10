'use client'
import { Box, useTheme } from "@mui/material"
import { MaterialManagementFormList } from "../ui/material-management-form-list"
import { Breadcrumb } from "@/shared/components"

export const MaterialManagementView = () => {
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
                        name: 'Quản lý danh sách nguyên liệu',
                        url: '/admin/material-management',
                    },
                ]}
                />
            </Box>
            <MaterialManagementFormList/>
        </>
    )
}