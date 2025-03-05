import React from 'react';
import { Container, Card, CardContent, Typography, Button } from '@mui/material';

const Login = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend Google auth endpoint
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: '20vh' }}>
      <Card sx={{ textAlign: 'center', p: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome
          </Typography>
          <Typography variant="body1" gutterBottom>
            Sign in with your Google account to continue.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoogleLogin}
            sx={{ mt: 2 }}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
