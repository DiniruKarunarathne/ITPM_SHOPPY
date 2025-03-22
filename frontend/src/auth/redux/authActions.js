// authActions.js
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseURI } from "../../const/endpoint";

const backendURL = baseURI;


export const userLogin = createAsyncThunk(
    'api/login',
    async ({ email, password }, { rejectWithValue }) => {
      try {
        
        const mockResponse = {
          token: 'fake-jwt-token',
          userInfo: {
            roles: ['User'], 
          },
        };
        localStorage.setItem('userToken', mockResponse.token);
        localStorage.setItem('userInfo', JSON.stringify(mockResponse.userInfo));
        return mockResponse;
      } catch (error) {
        return rejectWithValue('Mock login failed');
      }
    }
  );

  export const registerUser = createAsyncThunk(
    "api/signup",
    async ({ firstName,lastName,email,password,confirmPassword,image, }, { rejectWithValue }) => {
      try {
        console.log(firstName,lastName,email,password,confirmPassword,image,);
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        await axios.post(
          `${backendURL}api/signup`,
          { firstName,lastName,email,password,confirmPassword,image, },
          config
        );
      } catch (error) {
        // return custom error message from backend if present
        console.log("error", error);
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
  );
