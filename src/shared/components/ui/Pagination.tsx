import { Box, Pagination as PaginationItem } from "@mui/material"

export const Pagination = () => {
    return (
        <Box>
            <PaginationItem count={10} variant="outlined" />
        </Box>
    )
}