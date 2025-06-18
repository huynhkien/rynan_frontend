'use client';
import { ButtonProps } from "@/types/components/button.types";
import { Button as ButtonItem,  useTheme } from "@mui/material";

export const Button = ({ name, handleOnClick }: ButtonProps) => {
    const theme = useTheme();

    return (
        <ButtonItem
            sx={{
                color: theme.palette.text.secondary,
                padding: 1.5,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                },
                width: '100%'
            }}
            onClick={handleOnClick}
            type='submit'
        >
            {name}
        </ButtonItem>
    );
};
