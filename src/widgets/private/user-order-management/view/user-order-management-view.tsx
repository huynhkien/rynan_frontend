import { Box } from "@mui/material"
import { Breadcrumb } from "@/shared/components"
import theme from "@/shared/configs/theme"
import { UserOrderManagementFormList } from "../ui/user-order-mangement-form-list"

export const UserOrderManagementView = () => {
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
                        name: 'Quản lý đơn hàng',
                        url: '/user/order-management',
                    }]}
                />
            </Box>
            <UserOrderManagementFormList/>
        </>
    )
}