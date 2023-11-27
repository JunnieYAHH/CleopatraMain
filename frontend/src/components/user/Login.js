import React, { Fragment, useState, useEffect } from 'react';


import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DiamondRoundedIcon from '@mui/icons-material/DiamondRounded';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom'

import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from '../../actions/userActions'
import { useNavigate } from 'react-router-dom';



//Google Login
import { LoginSocialFacebook } from 'reactjs-social-login'
import { FacebookLoginButton } from 'react-social-login-buttons'


const defaultTheme = createTheme();



const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()


    const errMsg = (message = '') =>
        toast.error(message, {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {


        if (isAuthenticated ) {
            navigate('/')
        }

        if (error) {
            errMsg(error);
            dispatch(clearErrors());
        }

    }, [dispatch, navigate, isAuthenticated, error])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email,password))
   
    } 


    return (
      <ThemeProvider theme={defaultTheme}>
        <Fragment>
            <ToastContainer />
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Login'} />
                       
                           <Grid container component="main" sx={{ height: '100vh' }}>
                               <CssBaseline />
                                  <Grid
                                      item
                                      xs={false}
                                      sm={4}
                                      md={7}
                                      sx={{
                                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundColor: (t) =>
                                          t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                      }}
                                  />    
                                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                                      <Box
                                        sx={{
                                          my: 8,
                                          mx: 4,
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                        }}
                                        >
                                          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                            <DiamondRoundedIcon/>
                                          </Avatar>
                                              <Typography component="h1" variant="h5">
                                                Sign in
                                              </Typography>

                                              <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
                                                    <div className="form-group">
                                                        <TextField  
                                                        type="email"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="email_field"
                                                        label="Email Address" 
							                                          autoComplete="email"							
                                                        className="form-control" 
                                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                                        />
                                                    </div>
                                                        <div className="form-group">
                                                            <TextField
                                                            type="password"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="password_field"
                                                            label="Password"
                                                            className="form-control" 
                                                            value={password} onChange={(e) => setPassword(e.target.value)} 
                                                            
                                                            />
                                                        </div>
                                                        <FormControlLabel
                                                                  control={<Checkbox value="remember" color="primary" />}
                                                                  label="Remember me"
                                                        />
                                                    
                                                          
                                                     
                                                   <Button variant="contained" color="success"
                                                              type="submit"
                                                               id="login_button"
                                                               fullWidth
                                                              
                                                               sx={{ mt: 3, mb: 2 }}
                                                             >
                                                               Sign In
                                                             </Button>

                                                             <LoginSocialFacebook appId="649261693947479" onResolve={(response) => { console.log(response); }}        onReject={(error) => { console.log(error) }}>
                                                                  <FacebookLoginButton
                                                                    fullWidth
                                                                    variant="contained"
                                                                    sx={{ mt: 3, mb: 2 }} />
                                                                </LoginSocialFacebook>

                                                             <Grid container spacing={{ xs: 2, md: 3 }}>
                                                                <Grid item xs >
                                                                  <Link to="/password/forgot" variant="body1">
                                                                    Forgot password?
                                                                  </Link>
                                                                </Grid>
                                                                <Grid item>
                                                                  <Link to="/register" variant="boy2">
                                                                    {"Don't have an account?Sign Up"}
                                                                  </Link>
                                                                </Grid>
                                                              </Grid>

                                                   </Box>
                                       </Box>
                                      </Grid>
                           </Grid>
                       

                </Fragment>
            )}
        </Fragment>
        </ThemeProvider>
    )
   
}
export default Login