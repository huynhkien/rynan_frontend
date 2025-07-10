'use client'
import { Box, useTheme } from "@mui/material"
import { QuoteManagementFormAddEdit } from "../ui/quote-management-form-add-edit"
import { Breadcrumb } from "@/shared/components"

export const QuoteManagementAddView = () => {
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
                        name: 'Quản lý danh sách báo giá',
                        url: '/admin/quote-management',
                    },
                    {
                        name: 'Thêm danh sách báo giá',
                        url: '/admin/quote-management/add'
                    }
                ]}
                />
            </Box>
            <Box>
                <QuoteManagementFormAddEdit/>
            </Box>
        </>
    )
}