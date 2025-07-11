import React from 'react';
import { Select, MenuItem, SelectChangeEvent, Box, Typography } from '@mui/material';
import { ProductSortProps } from '@/types/widgets/product';
import theme from '@/shared/configs/theme';

export const ProductSort: React.FC<ProductSortProps> = ({ value, changeValue, options }) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      changeValue(selectedValue);
    } else {
      changeValue('');
    }
  };

  return (
    <Box width={{ xs: "100%", md: "220px" }} sx={{ boxShadow: 1, borderRadius: "5px" }}>
      <Select
        fullWidth
        variant="outlined"
        value={value}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <Typography>Sắp xếp</Typography>;
          }
          return options.find((opt) => opt.value === selected)?.text || "";
        }}
      >
        {/* Thêm option để reset sắp xếp */}
        <MenuItem sx={{backgroundColor: theme.palette.text.secondary}} value="">
          <Typography>
            Sắp xếp
          </Typography>
        </MenuItem>
        {options.map((el) => (
          <MenuItem sx={{backgroundColor: theme.palette.text.secondary}} key={el.id} value={el.value}>
            {el.text}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};