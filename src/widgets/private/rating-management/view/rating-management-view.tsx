import { Box } from "@mui/material"
import { RatingManagementFormList } from "../ui/rating-management-form-list"
import theme from "@/shared/configs/theme"
import { Breadcrumb } from "@/shared/components"

export const RatingManagementView = async() => {
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
                        name: 'Quản lý bình luận',
                        url: '/admin/rating-management',
                    }]}
                />
            </Box>
            <RatingManagementFormList/>
        </>
    )
}