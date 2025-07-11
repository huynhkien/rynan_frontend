import React, { useState, useMemo } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { 
  Select as SelectItem, 
  MenuItem, 
  SelectChangeEvent, 
  Box, 
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ControlledSelectProps, SelectPrivateProps } from '@/types/components/select';
import theme from '@/shared/configs/theme';

const Select = ({ 
  value, 
  changeValue, 
  options, 
  label, 
  disabled,
  important,
  placeholder = "Lựa chọn",
  sx,
  searchable = false,
  onSelectionChange 
}: SelectPrivateProps & { 
  searchable?: boolean;
  onSelectionChange?: (value: string | number) => void;
}) => {
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const newValue = event.target.value;
    changeValue(newValue);
    // Gọi callback nếu có
    if (onSelectionChange) {
      onSelectionChange(newValue);
    }
  };

  // Lọc options theo searchText
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchText.trim()) return options;
    
    const normalizeString = (str: string) => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    };
    
    const normalizedSearch = normalizeString(searchText);
    return options.filter(option => 
      normalizeString(option.name).includes(normalizedSearch)
    );
  }, [options, searchText, searchable]);

  return (
    <Box sx={sx}>
      {label && (
        <Typography variant='body1' sx={{ mb: 1, fontWeight: 500 }}>
          {label} {important && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      )}
      
      {/* Ô tìm kiếm - chỉ hiển thị khi searchable = true và có nhiều hơn 5 options */}
      {searchable && options.length > 5 && (
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
      )}
      
      <SelectItem
        fullWidth
        variant="outlined"
        disabled={disabled}
        value={value || ''}
        onChange={handleChange}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) return <span style={{ color: '#999' }}>{placeholder}</span>;
          const selectedOption = options.find(opt => opt._id === selected);
          return (selectedOption?.name);
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: theme.palette.text.secondary,
            }
          }
        }}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((el) => (
            <MenuItem sx={{backgroundColor: theme.palette.text.secondary}}  key={el._id} value={el._id}>
              {el.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem sx={{backgroundColor: theme.palette.text.secondary}} disabled>
            <Typography variant="body2" color="textSecondary">
              Không tìm thấy kết quả
            </Typography>
          </MenuItem>
        )}
      </SelectItem>
    </Box>
  );
};

export const ControlledSelect = <T extends FieldValues>({
  name,
  rules,
  control,
  searchable = false,
  onSelectionChange, // Thêm prop
  ...selectProps
}: ControlledSelectProps<T> & { 
  searchable?: boolean;
  onSelectionChange?: (value: string | number) => void;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Select
          value={field.value || ''}
          changeValue={field.onChange}
          searchable={searchable}
          onSelectionChange={onSelectionChange}
          {...selectProps}
        />
      )}
    />
  );
};

export default Select;