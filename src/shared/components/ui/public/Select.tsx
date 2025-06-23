import React from 'react';
import { Select as SelectItem, MenuItem, SelectChangeEvent, Box } from '@mui/material';
import { SelectProps } from '@/types/components/select';

export const Select: React.FC<SelectProps> = ({ value, changeValue, options }) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    changeValue(event.target.value);
  };

  return (
    <Box width={{ xs: "100%", md: "220px" }} sx={{ boxShadow: 1, borderRadius: "5px" }}>
      <SelectItem
        fullWidth
        variant="outlined"
        value={value}
        onChange={handleChange}
        displayEmpty
      >
        {options.map((el) => (
          <MenuItem key={el.id} value={el.value}>
            {el.text}
          </MenuItem>
        ))}
      </SelectItem>
    </Box>
  );
};
