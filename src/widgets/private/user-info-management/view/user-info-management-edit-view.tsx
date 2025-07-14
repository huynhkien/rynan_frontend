import { Box } from "@mui/material"
import { UserInfoManagementFormEdit } from "../ui/user-info-management-form-edit"
import theme from "@/shared/configs/theme"
import { Breadcrumb } from "@/shared/components"

export const UserInfoManagementEditView = () => {
    return (
        <>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    width: '100%'
                }}
            >
                <Breadcrumb
                    type='User'
                    breadcrumb={[{
                        name: 'Thông tin khách hàng',
                        url: '/user/',
                    },
                ]}
                />
                </Box>
            <UserInfoManagementFormEdit/>
        </>
    )
}