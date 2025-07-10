'use client'
import { Breadcrumb } from "@/shared/components"
import { Box, useTheme } from "@mui/material"
import { ReceiptImportManagementFormAddEditMaterial } from "../ui/receipt-import-management-form-add-edit-material";

export const ReceiptImportManagementAddEditMaterialView = () => {
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
                        name: 'Quản lý nhập kho',
                        url: '/admin/receipt-management/import',
                    },
                    {
                        name: 'Nhập kho nguyên liệu',
                        url: '/admin/receipt-management/import/add/material',
                    },
                ]}
                />
            </Box>
            <ReceiptImportManagementFormAddEditMaterial/>
        </>
    )
}