'use client'
import { ButtonContactProps } from "@/types/components/button"
import { Button, useTheme } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const ButtonContact = ({text, handleOnClick}: ButtonContactProps) => {
    const theme = useTheme();
    return (
      <Button
        variant='outlined'
        size='large'
        sx={{
          display:'flex',  
          justifyContent: 'space-between',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.text.secondary,
          width: '250px',
          height: '50px',
          borderRadius: '100px',
          px: { xs: 2, md: 3 },
          py: { xs: 1, md: 1.5 },
          fontSize: { xs: '0.9rem', md: '1rem' },
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0, 
            width: '0%',
            height: '100%',
            backgroundColor: theme.palette.primary.light,
            transition: 'width 0.4s ease-in-out',
            zIndex: -1,
          },
          '&:hover': {
            borderColor: theme.palette.text.secondary,
            transform: 'translateY(-2px)',
            '&::before': {
              width: '100%',
              right: 0,
            },
          },
          '&:not(:hover)::before': {
            width: '0%',
            right: 0,
          },
        }}
        type='submit'
        onClick={handleOnClick}
        >
            {text}
            <ArrowForwardIosIcon
                sx={{
                    backgroundColor: theme.palette.primary.light,
                    width: '30px',
                    height: '30px',
                    borderRadius: '100px',
                    padding: '6px',
                    transition: 'all 0.3s ease',
                    '.MuiButton-root:hover &': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: theme.palette.primary.light,
                    }
                }}
            />
        </Button>  
    )
}