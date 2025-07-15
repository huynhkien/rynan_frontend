import { Breadcrumb } from "@/shared/components"
import theme from "@/shared/configs/theme"
import { Box } from "@mui/material"
import { ContactManagementFormList } from "../ui/contact-management-form-list"

export const ContactManagementView = () => {
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
                        name: 'Quản lý liên hệ',
                        url: '/admin/contact-management',
                    }]}
                />
            </Box>
            <ContactManagementFormList/>
        </>
    )
}