import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { BaseInputProps } from "@/types/components/input";

export const BaseInput = ({
  id,
  style,
  value,
  setValue,
  nameKey,
  multiline,
  rows,
  type,
  invalidFields = [],
  setInValidFields,
  iconClass,
  placeholder,
  onChange,
}: BaseInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    } else {
      setValue(e.target.value); 
    }
  };
  

  return (
    <TextField
      id={id}
      type={type || 'text'}
      variant="outlined"
      fullWidth
      placeholder={placeholder}
      value={value}
      multiline={multiline}
      rows={rows}
      onChange={handleChange}
      onFocus={() => setInValidFields && setInValidFields([])}
      error={invalidFields.some((el) => el.name === nameKey)}
      helperText={invalidFields.find((el) => el.name === nameKey)?.message || ""}
      InputProps={{
        startAdornment: iconClass && (
          <InputAdornment position="start">{iconClass}</InputAdornment>
        ),
        className: style,
      }}
      sx={{ mt: 2 }}
      required
    />
  );
};
