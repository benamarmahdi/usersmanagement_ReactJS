import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";

import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { gql, useMutation } from "@apollo/client";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Userfy
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const REQUESTRESET = gql`
  mutation requestReset($email: String!) {
    requestReset(email: $email)
  }
`;

export default function PswRecovery() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const history = useHistory();

  const [requestReset] = useMutation(REQUESTRESET, {
    onError: (error) => {
      console.log(error);
    },
  });

  const handelsubmit = (event) => {
    event.preventDefault();

    requestReset({ variables: { email } }).then((value) => {
      if (value) {
        history.push("./");
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <VpnKeyIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Password Recovery
        </Typography>
        <ValidatorForm
          className={classes.form}
          noValidate
          onSubmit={handelsubmit}
        >
          <TextValidator
            variant="outlined"
            margin="normal"
            required
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
          />

          <Typography component="h5" variant="p">
            Please enter your email address to reset your password.
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
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Sign in?
              </Link>
            </Grid>
            <Grid item>
              <RouterLink to="./signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </RouterLink>
            </Grid>
          </Grid>
        </ValidatorForm>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
