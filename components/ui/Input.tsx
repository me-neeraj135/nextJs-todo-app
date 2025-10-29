
'use client';
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { forwardRef } from 'react';

export type CustomInputProps = TextFieldProps & {
    /** component defaults can be overridden by props */
    fullWidth?: boolean;
    variant?: 'outlined' | 'filled' | 'standard';
    margin?: 'none' | 'dense' | 'normal';
    size?: 'small' | 'medium';
};

const Input = forwardRef<HTMLInputElement, CustomInputProps>(
    (
        {
            fullWidth = true,
            variant = 'outlined',
            margin = 'normal',
            size = 'medium',
            ...props
        },
        ref
    ) => {
        return (
            <TextField
                ref={ref}
                fullWidth={fullWidth}
                variant={variant}
                margin={margin}
                size={size}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';

export default Input;