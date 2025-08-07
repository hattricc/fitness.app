import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button, styled } from "@mui/material";
import { forwardRef, ComponentProps } from "react";

const PreviousButton = forwardRef<
    HTMLButtonElement,
    Omit<ComponentProps<"button">, "className"> & {
        onClick: () => void;
    }
>((props) => {

    const PreviousButton = styled(Button)({
        backgroundColor: 'white',
        color: '#1B1B1B',
        borderRadius: 50,
        padding: '12px 40px',
        fontWeight: 'bold',
        textTransform: 'none',
        margin: '0 auto',
        marginBottom: '40px',
        '&:hover': {
            backgroundColor: '#efefef',
        },
        width: '15%',
    });

    return (
        <PreviousButton
            variant="contained"
            onClick={props.onClick}
            fullWidth
            size="small"
        >
            <ChevronLeftIcon fontSize="large" />
        </PreviousButton>
    );
});

export default PreviousButton;
