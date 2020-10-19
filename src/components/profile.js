import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import PersonIcon from "@material-ui/icons/Person";
import Grid from "@material-ui/core/Grid";
import { Alert } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { gql, useMutation, useQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const UPDATEUSER = gql`
  mutation updateUser(
    $id: ID!
    $name: String!
    $email: String!
    $birthDate: String!
  ) {
    updateUser(id: $id, name: $name, email: $email, birthDate: $birthDate) {
      name
    }
  }
`;

const ME = gql`
  query {
    me {
      id
      name
      email
      birthDate
    }
  }
`;

export default function Profile() {
  const classes = useStyles();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [enable, setEnable] = useState(true);

  const [open, setOpen] = useState(false);
  const [Message, setMessage] = useState(null);
  const [severity, setSeverity] = useState(null);

  const [updateUser] = useMutation(UPDATEUSER, {
    onError: (error) => {
      console.log(error);
      showMessage("error", error.graphQLErrors[0].message);
    },
  });
  const showMessage = (severity, message) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };
  const { data, loading } = useQuery(ME, {
    fetchPolicy: "no-cache",
  });
  if (data) {
    console.log(data.me.email);
  }
  useEffect(() => {
    if (data && data.me) setBirthDate(data.me.birthDate);
  }, [data]);
  useEffect(() => {
    if (data && data.me) setId(data.me.id);
  }, [data]);

  useEffect(() => {
    if (data && data.me) setEmail(data.me.email);
  }, [data]);

  useEffect(() => {
    if (data && data.me) setName(data.me.name);
  }, [data]);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handelChecked = () => {
    setEnable((prev) => !prev);
  };
  const handelsubmit = (event) => {
    event.preventDefault();
    if (!enable) {
      updateUser({ variables: { id, name, email, birthDate } }).then(
        (value) => {
          if (value) {
            const name = value.data.updateUser.name;
            const message = "The profil of " + name + " is updated succesfully";
            showMessage("success", message);
          }
        }
      );
    }
  };
  if (loading) {
    return <p>Loading ...</p>;
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {Message}
        </Alert>
      </Snackbar>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        <ValidatorForm
          className={classes.form}
          noValidate
          onSubmit={handelsubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="Name"
                variant="standard"
                fullWidth
                id="Name"
                label="Name"
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                validators={["required"]}
                errorMessages={["this field is required"]}
                InputProps={{
                  readOnly: enable,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextValidator
                variant="standard"
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "email is not valid"]}
                InputProps={{
                  readOnly: enable,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                variant="standard"
                margin="normal"
                fullWidth
                label="Birthdate"
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                validators={["required"]}
                errorMessages={["this field is required"]}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: enable,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch size="small" onChange={handelChecked} />}
                label="Modify"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Update my Profile
          </Button>
        </ValidatorForm>
      </div>
    </Container>
  );
}
