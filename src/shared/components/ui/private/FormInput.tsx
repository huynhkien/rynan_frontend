import React from 'react';
import { TextField, Typography,  Box } from '@mui/material';
import { FormInputProps } from '@/types/components/input';
import { FieldError } from 'react-hook-form';



export const FormInput = <TFormValues extends Record<string, unknown>>({
  id,
  label,
  important = false,
  register,
  errors,
  validate,
  placeholder,
  defaultValue,
  sx,
  type ,
  multiline = false,
  rows,
}: FormInputProps<TFormValues>) => {
  const fieldError = errors[id] as FieldError | undefined;
  const errorMessage = fieldError?.message;

  return (
    <Box sx={{ ...sx }}>
      {label && (
        <Typography variant='body1' sx={{ mb: 1, fontWeight: 500 }}>
          {label} {important && <span style={{ color: 'error' }}>*</span>}
        </Typography>
      )}
      <TextField
        fullWidth
        id={id}
        type={type || 'text'}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register(id, validate)}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        error={!!fieldError}
        helperText={errorMessage || ''}
        variant='outlined'
        sx={{
          width: '100%',
          '& .MuiFormHelperText-root':{
            width: '80%',
            height:'10px'
          }
      }}
      />
    </Box>
  );
};
