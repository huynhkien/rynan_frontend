import React from "react";
import { TextField, InputAdornment, Box, Typography } from "@mui/material";
import { InputFormProps } from "@/types/components/input.types";
import theme from "@/shared/configs/theme";


export const InputForm: React.FC<InputFormProps> = ({
  id,
  important,
  label,
  sx,
  value,
  setValue,
  disabled = false,
  validate,
  register,
  errors,
  defaultValue,
  nameKey,
  multiline,
  type,
  rows,
  invalidFields = [],
  setInValidFields,
  iconClass,
  placeholder,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    } else {
      if(setValue){
        setValue(e.target.value)
      }
    }
  };
  

  return (
    <Box>
      {label && (
        <Typography
          variant='body1'
          sx={{
            fontWeight: theme.typography.fontWeightBold
          }}
        >
          {label}{important && <Typography component='span' color='error' fontSize='fontSize'>*</Typography>}:
        </Typography>
      )}
      <TextField
        id={id}
        type={type || 'text'}
        variant="outlined"
        fullWidth
        disabled = {disabled}
        {...(register && id ? register(id, validate) : {})}
        placeholder={placeholder}
        rows={rows}
        multiline={multiline}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onFocus={() => setInValidFields && setInValidFields([])}
        error={invalidFields ? invalidFields.some((el) => el.name === nameKey) : !!(errors && id && errors[id])}
        helperText={
          invalidFields?.find((el) => el.name === nameKey)?.message ||
          (errors && id && errors[id]?.message?.toString()) ||
          ''}      
        InputProps={{
              startAdornment: iconClass && (
                <InputAdornment position="start">{iconClass}</InputAdornment>
              ),
            }}
        sx={sx}
        required
      />
    </Box>
  );
};
