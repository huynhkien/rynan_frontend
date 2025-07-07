'use client'
import { Breadcrumb } from "@/shared/components"
import { Box, useTheme } from "@mui/material"
import { ReceiptExportManagementFormAddEditMaterial } from "../ui/receipt-export-management-form-add-edit-material";

export const ReceiptExportManagementAddEditMaterialView = () => {
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
                        name: 'Quản lý xuất kho',
                        url: '/admin/receipt-management/export',
                    },
                    {
                        name: 'Xuất kho nguyên liệu',
                        url: '/admin/receipt-management/export/add/material',
                    },
                ]}
                />
            </Box>
            <ReceiptExportManagementFormAddEditMaterial/>
        </>
    )
}