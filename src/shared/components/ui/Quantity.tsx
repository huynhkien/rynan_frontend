import { Box, IconButton, TextField, useTheme } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { ChangeEvent } from 'react';
import { QuantityProps } from '@/types/components/input.types';

export const Quantity = ({ 
  quantity, 
  handleQuantity, 
  handleChangeQuantity 
}: QuantityProps) => {
  const theme = useTheme();
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleQuantity(e.target.value);
  };

  const currentValue = typeof quantity === 'string' ? 
    (quantity === '' ? 0 : Number(quantity)) : quantity;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton 
        onClick={() => handleChangeQuantity('minus')}
        disabled={currentValue <= 1}
        size="small"
        aria-label="Decrease quantity"
      >
        <Remove
            sx={{
                backgroundColor: theme.palette.primary.main,
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                color: theme.palette.text.secondary
            }}
        />
      </IconButton>
      <TextField
        type="number"
        value={quantity}
        onChange={handleInputChange}
        inputProps={{ 
          min: 1,
          max: 999, 
        }}
        sx={{ 
          width: '80px',
          '& input': {
            textAlign: 'center'
          }
        }}
        size="small"
        variant="outlined"
      />
      <IconButton 
        onClick={() => handleChangeQuantity('plus')}
        disabled={currentValue >= 999}
        size="small"
        aria-label="Increase quantity"
      >
        <Add 
            sx={{
                backgroundColor: theme.palette.primary.main,
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                color: theme.palette.text.secondary
            }}
        />
      </IconButton>
    </Box>
  );
};
