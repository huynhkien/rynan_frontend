'use client'
import { Box, useTheme } from "@mui/material"
import { Breadcrumb } from "@/shared/components"
import { ReceiptApprovePendingManagementFormList } from "../ui/receipt-approve-pending-management-form-list";

export const ReceiptApprovePendingManagementView = () => {
    const theme = useTheme();
    return(
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
                        name: 'Kiểm duyệt',
                        url: '/admin/receipt-management/approve/pending',
                    },
                    {
                        name: 'Đang chờ duyệt',
                        url: '/admin/receipt-management/approve/pending',
                    },
                ]}
                />
            </Box>
           <ReceiptApprovePendingManagementFormList/>
        </>
    )
}