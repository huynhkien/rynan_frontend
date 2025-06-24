// types/components/select.ts
export interface OptionPrivate {
  _id: string;
  name: string;
}

export interface SelectPrivateProps {
  value: string | number;
  changeValue: (value: string | number) => void;
  options: OptionPrivate[];
  label?: string;
  important?: boolean;
  placeholder?: string; 
  sx?: SxProps<Theme>;
}

export interface ControlledSelectProps<T extends FieldValues> extends Omit<SelectPrivateProps, 'value' | 'changeValue'> {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
}

import React from 'react';
import { Controller, FieldValues, Control, RegisterOptions, Path } from 'react-hook-form';
import { 
  Select as SelectItem, 
  MenuItem, 
  SelectChangeEvent, 
  Box, 
  Typography,
  SxProps,
  Theme
} from '@mui/material';

const Select: React.FC<SelectPrivateProps> = ({ 
  value, 
  changeValue, 
  options, 
  label, 
  important,
  placeholder = "Lựa chọn",
  sx
}) => {
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
          if (!selected) {
            return <span style={{ color: '#999' }}>{placeholder}</span>;
          }
          return selected;
        }}
      >
        {options.map((el) => (
          <MenuItem key={el._id} value={el.name}>
            {el.name}
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