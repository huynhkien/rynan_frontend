'use client'
import { Breadcrumb } from "@/shared/components"
import { Box, useTheme } from "@mui/material"
import { SpecificationManagementFormList } from "../ui/specification-management-form-list";

export const SpecificationManagementView = () => {
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
                        name: 'Quy cách đóng gói',
                        url: '/admin/product-management/specification',
                    }
                ]}
                />
            </Box>
            <Box>
                <SpecificationManagementFormList/>
            </Box>
        </>
    )
}