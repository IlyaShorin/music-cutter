import { Button as ChakraButton } from '@chakra-ui/react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'solid' | 'outline' | 'ghost';
    colorPalette?: 'blue' | 'green' | 'red' | 'gray';
    size?: 'sm' | 'md' | 'lg';
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    isLoading?: boolean;
}

export function Button({
    children,
    onClick,
    type = 'button',
    disabled = false,
    variant = 'solid',
    colorPalette = 'blue',
    size = 'md',
    width,
    height,
    padding,
    isLoading = false,
}: ButtonProps) {
    return (
        <ChakraButton
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            variant={variant}
            colorPalette={colorPalette}
            size={size}
            width={width}
            height={height}
            padding={padding}
            loading={isLoading}
        >
            {children}
        </ChakraButton>
    );
}
