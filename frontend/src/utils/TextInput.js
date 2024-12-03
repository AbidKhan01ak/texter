// utils/TextInput.js
import * as React from 'react';
import { Input as BaseInput } from '@mui/base/Input';
import { styled } from '@mui/system';

const Input = React.forwardRef(function CustomInput(props, ref) {
  return (
    <BaseInput
      slots={{
        root: RootDiv,
        input: 'input',
        textarea: TextareaElement,
      }}
      {...props}
      ref={ref}
    />
  );
});

export default function TextInput({ placeholder, ...rest }) {
  return <Input aria-label="Text input" multiline placeholder={placeholder} {...rest} />;
}

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const RootDiv = styled('div')`
  display: flex;
  max-width: 500%;
  width: 150%; 

   @media (max-width: 1024px) {
    max-width: 90%; /* Slightly reduce the width for medium screens */
    width: 100%;
  }
    
  @media (max-width: 768px) {
    max-width: 100%;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const TextareaElement = styled('textarea', {
  shouldForwardProp: (prop) =>
    !['ownerState', 'minRows', 'maxRows'].includes(prop.toString()),
})(
  ({ theme }) => `
  width: 100%;
  height: 250px; /* Adjusted height for approximately 15 lines at 12px font size */
  font-family: 'Merriweather', sans-serif;
  font-size: 14px; /* 12px font size */
  font-weight: 400;
  line-height: 1.5rem;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
  }

  // Firefox focus-visible outline reset
  &:focus-visible {
    outline: 0;
  }
    /* Responsive styles */
    @media (max-width: 1024px) {
    height: 220px; /* Slightly reduce height for 1024px */
    font-size: 13.5px; /* Subtle font size reduction */
    padding: 7px 10px; /* Adjusted padding for balance */
  }
  @media (max-width: 768px) {
    height: 180px; /* Slightly reduce height for smaller screens */
    font-size: 13px;
    padding: 6px 10px;
  }

  @media (max-width: 480px) {
    height: 150px; /* Further reduce height for mobile screens */
    font-size: 12px;
    padding: 5px 8px;
  }
`,
);
