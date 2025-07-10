'use client'
import { Box, useTheme } from "@mui/material"
import { Breadcrumb } from "@/shared/components"
import { ReceiptApproveCancelManagementFormList } from "../ui/receipt-approve-cancel-management-form-list";

export const ReceiptApproveCancelManagementView = () => {
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
                        name: 'Đã hủy',
                        url: '/admin/receipt-management/approve/confirm',
                    },
                ]}
                />
            </Box>
           <ReceiptApproveCancelManagementFormList/>
        </>
    )
}