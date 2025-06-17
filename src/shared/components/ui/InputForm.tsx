import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { InputFormProps } from "@/types/components/inputForm.types";


export const InputForm: React.FC<InputFormProps> = ({
  id,
  sx,
  value,
  setValue,
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
      rows={rows}
      multiline={multiline}
      value={value}
      onChange={handleChange}
      onFocus={() => setInValidFields && setInValidFields([])}
      error={invalidFields.some((el) => el.name === nameKey)}
      helperText={invalidFields.find((el) => el.name === nameKey)?.message || ""}
      InputProps={{
        startAdornment: iconClass && (
          <InputAdornment position="start">{iconClass}</InputAdornment>
        ),
      }}
      sx={sx}
      required
    />
  );
};
