import React from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { Select as SelectItem, MenuItem, SelectChangeEvent, Box, Typography} from '@mui/material';
import { ControlledSelectProps, SelectPrivateProps } from '@/types/components/select';

const Select = ({ 
  value, 
  changeValue, 
  options, 
  label, 
  important,
  placeholder = "Lựa chọn",
  sx
}: SelectPrivateProps) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    changeValue(event.target.value);
  };

  return (
    <Box sx={sx}>
      {label && (
        <Typography variant='body1' sx={{ mb: 1, fontWeight: 500 }}>
          {label} {important && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      )} 
      <SelectItem
        fullWidth
        variant="outlined"
        value={value || ''}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) return <span style={{ color: '#999' }}>{placeholder}</span>;
          const selectedOption = options.find(opt => opt._id === selected);
          return (selectedOption?.name || selectedOption?.name_vn) || placeholder;
        }}
      >
        {options.map((el) => (
          <MenuItem key={el._id} value={el._id}>
            {el.name || el.name_vn}
          </MenuItem>
        ))}
      </SelectItem>
    </Box>
  );
};

export const ControlledSelect = <T extends FieldValues>({
  name,
  rules,
  control,
  ...selectProps
}: ControlledSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Select
          value={field.value || ''}
          changeValue={field.onChange}
          {...selectProps}
        />
      )}
    />
  );
};

export default Select;