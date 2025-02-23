import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from './api';

// Google Client ID for Firstvite project
const GOOGLE_CLIENT_ID = "621298865119-6iq3rvj3kcnqv6vt4g7v6265j8d7245h.apps.googleusercontent.com";

const GoogleAuth = ({ callback }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const response = await api.post('/user/auth/google', {
              token: credentialResponse.credential,
            });
            
            if (response.data.token) {
              // Store the token and user data
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('user', JSON.stringify(response.data.user));
              // Call the success callback
              callback(null, response.data);
            } else {
              // In case token is not present in response
              callback('No token received from server');
            }
          } catch (error) {
            callback(
              error.response?.data?.message || 'Error signing in with Google'
            );
          }
        }}
        onError={() => {
          callback('Google Sign In was unsuccessful');
        }}
        useOneTap
        theme="filled_blue"
        shape="pill"
        text="continue_with"
        width="300"
        locale="en"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
