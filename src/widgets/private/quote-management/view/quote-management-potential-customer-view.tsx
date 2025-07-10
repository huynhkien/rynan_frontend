'use client'
import { Box, useTheme } from "@mui/material"
import { QuoteManagementFormPotentialCustomerList } from "../ui/quote-management-form-potential-customer-list"
import { Breadcrumb } from "@/shared/components"

export const QuoteManagementPotentialCustomerView = () => {
    const theme = useTheme();
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
                        name: 'Quản lý danh sách báo giá',
                        url: '/admin/quote-management',
                    },
                    {
                        name: 'Khách hàng tiềm năng',
                        url: '/admin/quote-management/potential-customer',
                    },
                ]}
                />
            </Box>
            <QuoteManagementFormPotentialCustomerList/>
        </>
    )
}