
import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import PersonIcon  from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/Person';

import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useHistory } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const UPDATEUSERSPASSWORD = gql`
 mutation 
  updateUsersPassword ($id:ID! $oldPassword: String! $newPassword: String!) {
    updateUsersPassword(id:$id, oldPassword:$oldPassword, newPassword: $newPassword)  {
      name
    }

  }`

const DELETEUSER = gql`
  mutation
  deleteUser ($id:ID!){
      deleteUser(id:$id){
          name 
      }
  }`

const ME = gql`
query {
  me  {
    id 
    name
    email
    birthDate
    
  }
}
`
export default function Account() {
    const history = useHistory();
    const classes = useStyles();
    const [id, setId] = useState('');
    
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
   

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [open, setOpen] = useState(false);
    const [passDialog, setPassDialog] = useState(false);
    const [delDialog, setDelDialog] = useState(false);
    const [Message, setMessage] = useState(null);
    const [severity, setSeverity] = useState(null);
    const [viewChange, setViewchange] = useState("A");

    const [updateUsersPassword] = useMutation(UPDATEUSERSPASSWORD, {
        onError: (error) => {
            console.log(error);
            showMessage("error", error.graphQLErrors[0].message);
        }
    });
    const [deleteUser] = useMutation(DELETEUSER, {
        onError: (error) => {
            console.log(error);
            showMessage("error", error.graphQLErrors[0].message);
        }
    });
    const showMessage = (severity, message) => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    }
    const { data, loading } = useQuery(ME, {
        fetchPolicy: "no-cache",
    });
    
    const handlePassDialogOpen = () => {
        setPassDialog(true);
    };

    const handleDelDialogOpen = () => {
        setDelDialog(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseDialog = () => {
        setDelDialog(false);
        setPassDialog(false);
    };
    if (data) {
        console.log(data.me.email);
    }
    
    useEffect(() => {
        if (data && data.me)
            //setName(data.me.name);
            setId(data.me.id);
        //setBirthDate(data.me.birthDate)
    }, [data]);


    
   
    const handleAgree = () => {
        setViewchange("P");
    }

    
    const handledelete = () => {
       
        deleteUser({ variables: { id} }).then(value => {
            if (value) {
                showMessage("success", "your Password is updated succesfully");

            }
        });
        localStorage.removeItem('token');
    history.push('./');

    }
    const handelPasswordrec = (e) => {
        e.preventDefault()
        updateUsersPassword({ variables: { id, oldPassword, newPassword } }).then(value => {
            if (value) {
                showMessage("success", "your Password is updated succesfully");

            }
        });
    }
   
    if (loading) { return <p>Loading ...</p> }
    return (
        <Container>
            <CssBaseline />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {Message}
                </Alert>
            </Snackbar>
            
            {viewChange  === "A" &&<div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <PersonIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    My Account
                </Typography>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handlePassDialogOpen}
                >
                    change my password
            </Button>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleDelDialogOpen}
                >
                    Delete My Account
            </Button>
                <Dialog
                    fullScreen={fullScreen}
                    open={passDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Do you realy want to change your passwprd?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            It is a good policy to routinely change your password to protect data, even in what you may consider a ‘safe’ environment.
          </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleCloseDialog} color="primary">
                            Disagree
          </Button>
                        <Button onClick={handleAgree} color="primary" autoFocus>
                            Agree
          </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    fullScreen={fullScreen}
                    open={delDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Do you realy want to delete your account?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        your account will be deleted difinitively you will lose all your information stored in the site 
          </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleCloseDialog} color="primary">
                            Disagree
          </Button>
                        <Button onClick={handledelete} color="primary" autoFocus>
                            Agree
          </Button>
                    </DialogActions>
                </Dialog>
            </div>}
            {viewChange === "P" &&<div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <VpnKeyIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Password Recovery
                </Typography>
                <form className={classes.form} noValidate onSubmit={handelPasswordrec}>
                <TextField
                       variant="outlined"
                       margin="normal"
                       required
                       fullWidth
                       name="old password"
                       label="current Password"
                       type="password"
                       id="old password"
                       autoComplete="current-password"
                       value={oldPassword}
                       onChange={(event) => setOldPassword(event.target.value)}
                       validators={['required']}
                       errorMessages={['this field is required']}
                    />
                    <TextField
                       variant="outlined"
                       margin="normal"
                       required
                       fullWidth
                       name="new password"
                       label="new Password"
                       type="new password"
                       id="password"
                       autoComplete="current-password"
                       value={newPassword}
                       onChange={(event) => setNewPassword(event.target.value)}
                       validators={['required']}
                       errorMessages={['this field is required']}
                    />
                 
                    <Typography component="h5" variant="p">
                        Please enter your current and new password.
                    </Typography>
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        reset my Password
          </Button>
                    
                </form>
            </div>}
        </Container>
    );
}