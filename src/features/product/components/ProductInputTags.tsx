import React, { useState, KeyboardEvent } from 'react';
import {
  Box,
  Chip,
  TextField,
  Typography,
  FormHelperText,
  useTheme,
} from '@mui/material';
import {  ProductTagsInputProps } from '@/features/product/type/productType';

export const ProductInputTags= ({
  label,
  important = false,
  placeholder = 'Nhập tag và nhấn Enter',
  register,
  errors,
  setValue,
  id,
  watch,
  validate,
  sx
}: ProductTagsInputProps) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  
  // Lấy giá trị tags hiện tại từ form
  const currentTags = watch(id);
  const tagsArray: { tag: string }[] = Array.isArray(currentTags)
    ? currentTags.filter(el => typeof el.tag === 'string' && el.tag.trim() !== '')
    : [];

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue &&
      !tagsArray.some(tagObj => tagObj.tag === trimmedValue)
    ) {
      const newTags = [...tagsArray, { tag: trimmedValue }];
      setValue(id, newTags, { shouldValidate: true });
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tagsArray.filter(tagObj => tagObj.tag !== tagToRemove);
    setValue(id, newTags, { shouldValidate: true });
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag();
    }
  };
  const fieldError = errors[id];

  return (
    <Box sx={sx}>
      <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.primary }}>
        {label} {important && <span style={{ color: 'red' }}>*</span>}
      </Typography>
      <input
        type="hidden"
        {...register(id, validate)}
      />
      {/* Tags hiển thị */}
      <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {tagsArray.map((el, index) => (
          <Chip
            key={index}
            label={el.tag}
            onDelete={() => removeTag(el.tag)}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
      
      {/* Input để nhập tag mới */}
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        error={!!fieldError}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.divider,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />
      
      {/* Helper text */}
      <FormHelperText sx={{ mt: 0.5 }}>
        Nhấn Enter hoặc dấu phẩy để thêm tag
      </FormHelperText>
      
      {/* Error message */}
      {fieldError && (
        <FormHelperText error sx={{ mt: 0.5 }}>
          {fieldError.message}
        </FormHelperText>
      )}
    </Box>
  );
};