'use client'
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from "react";
import theme from "@/shared/configs/theme";


export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </MuiThemeProvider>
            </AppRouterCacheProvider>
        </>
    )
}