import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from '@mui/material';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import { useApiMutate } from './query/useFetch';

const SignupPage: React.FC = () => {
  // const { signup } = useAuth();
  const { mutate } = useApiMutate('signup');
  // const navigate = useNavigate();
  const [formData, setFormData] = useState<object>({});

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      mutate(formData);
      // signup(formData as SignupData, {
      //   onSuccess: () =>
      //     setTimeout(() => {
      //       navigate('/');
      //     }, 2000),
      //   onError: console.error,
      // });
    },
    [formData],
  );

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isValid = useMemo(() => {
    return (
      !formData['firstname'] ||
      !formData['lastname'] ||
      !formData['username'] ||
      !formData['password']
    );
  }, [formData]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Signup
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstname"
            label="Firstname"
            name="firstname"
            error={!formData['firstname']}
            value={formData['firstname']}
            onChange={onFormChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="lastname"
            label="Lastname"
            name="lastname"
            error={!formData['lastname']}
            value={formData['lastname']}
            onChange={onFormChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            error={!formData['username']}
            value={formData['username']}
            onChange={onFormChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            error={!formData['password']}
            value={formData['password']}
            onChange={onFormChange}
          />

          <Button
            disabled={isValid}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
