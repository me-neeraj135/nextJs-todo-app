'use client';
import Button from "@mui/material/Button";
import { ButtonProps } from "@mui/material/Button";
import { forwardRef } from "react";

export interface CustomButtonProps extends ButtonProps {
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    fullWidth?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
    ({ children, variant = 'contained', color = 'primary', fullWidth = false, size = 'medium', ...props }, ref) => {
    return (
        <Button
            variant={variant}
            color={color}
            fullWidth={fullWidth}
            size={size}
            ref={ref}
            {...props}
        >
            {children}
        </Button>
    );
});

CustomButton.displayName = 'CustomButton';

export default CustomButton;