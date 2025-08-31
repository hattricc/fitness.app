import * as React from 'react';
import { Menu as MuiMenu, MenuProps as MuiMenuProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const DropdownMenu = (props: MuiMenuProps) => {
  return <MuiMenu {...props} />;
};

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement> & { children: React.ReactElement }>(({ children, ...props }, ref) => {
  return React.cloneElement(children, {
    ref,
    ...props,
  });
});

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuContent = styled('div')(({ theme }) => ({
  minWidth: 220,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  boxShadow: theme.shadows[8],
  border: `1px solid ${theme.palette.divider}`,
}));

const DropdownMenuItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:focus-visible': {
    outline: 'none',
    backgroundColor: theme.palette.action.focus,
  },
}));

const DropdownMenuLabel = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
  fontSize: theme.typography.pxToRem(12),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

const DropdownMenuSeparator = styled('div')(({ theme }) => ({
  height: 1,
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(0.5, 1),
}));

const DropdownMenuShortcut = styled('span')(({ theme }) => ({
  marginLeft: 'auto',
  fontSize: theme.typography.pxToRem(12),
  color: theme.palette.text.disabled,
}));

const DropdownMenuCheckboxItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:focus-visible': {
    outline: 'none',
    backgroundColor: theme.palette.action.focus,
  },
}));

const DropdownMenuRadioItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:focus-visible': {
    outline: 'none',
    backgroundColor: theme.palette.action.focus,
  },
}));

const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, children, ...props }, ref) => (
    <DropdownMenuItem
      ref={ref}
      className={className}
      style={{
        paddingLeft: inset ? 32 : undefined,
      }}
      {...props}
    >
      {children}
      <DropdownMenuShortcut>▶</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
);

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

// These are kept for compatibility but will use MUI's Menu components internally
const DropdownMenuGroup = React.Fragment;
const DropdownMenuPortal = React.Fragment;
const DropdownMenuSub = React.Fragment;
const DropdownMenuRadioGroup = React.Fragment;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuSubTrigger,
};
