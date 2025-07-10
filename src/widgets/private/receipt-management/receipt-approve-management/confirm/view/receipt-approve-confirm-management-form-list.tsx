'use client'
import { Box, useTheme } from "@mui/material"
import { Breadcrumb } from "@/shared/components"
import { ReceiptApproveConfirmManagementFormList } from "../ui/receipt-approve-confirm-management-form-list";

export const ReceiptApproveConfirmManagementView = () => {
    const theme = useTheme();
    return(
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
                        name: 'Kiểm duyệt',
                        url: '/admin/receipt-management/approve/confirm',
                    },
                    {
                        name: 'Đã duyệt',
                        url: '/admin/receipt-management/approve/confirm',
                    },
                ]}
                />
            </Box>
           <ReceiptApproveConfirmManagementFormList/>
        </>
    )
}