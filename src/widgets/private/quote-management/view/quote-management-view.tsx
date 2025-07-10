'use client'
import { Breadcrumb } from "@/shared/components"
import { QuoteManagementFormList } from "../ui/quote-management-form-list"
import { Box, useTheme } from "@mui/material"

export const QuoteManagementView = () => {
    const theme = useTheme()
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
                ]}
                />
            </Box>
            <QuoteManagementFormList/>
        </>
    )
}