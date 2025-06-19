import React from 'react';
import { Select, MenuItem, SelectChangeEvent, Box, Typography } from '@mui/material';
import { ProductSortProps } from '@/types/widgets/productSort.types';

export const ProductSort: React.FC<ProductSortProps> = ({ value, changeValue, options }) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    changeValue(event.target.value);
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
            return <Typography >Sắp xếp</Typography>;
          }
          return options.find((opt) => opt.value === selected)?.text || "";
        }}
      >
        {options.map((el) => (
          <MenuItem key={el.id} value={el.value}>
            {el.text}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
