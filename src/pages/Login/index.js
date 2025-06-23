import {
  CssBaseline,
  Divider,
  IconButton,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Mail, Visibility, VisibilityOff } from "@material-ui/icons";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../context/Auth/AuthContext";
import useSettings from "../../hooks/useSettings";
import ColorModeContext from "../../layout/themeContext";
import { i18n } from "../../translate/i18n";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    flex: 2,
    position: "relative",
    background:
      theme.mode === "light" ? theme.palette.light : theme.palette.dark,
  },
  rightScreen: {
    flex: 1,
    width: "100vw",
    height: "100vh",
    background:
      theme.mode === "light" ? theme.palette.light : theme.palette.dark,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  leftScreen: {
    flex: 2,
    [theme.breakpoints.down("sm", "xs")]: {
      display: "none",
    },
  },
  paper: {
    backgroundColor:
      theme.mode === "light"
        ? "rgba(255, 255, 255, 0.8)"
        : "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(5px)",
    boxShadow:
      theme.mode === "light"
        ? "0 4px 6px rgba(0, 0, 0, 0.2)"
        : "0 4px 6px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "25px",
    borderRadius: "12px",
    maxWidth: "400px", // Limita a largura máxima do container
    width: "100%", // A largura será 100% até o máximo definido
  },
  signupButton: {
    marginTop: "45px",
    alignSelf: "center",
    borderRadius: "50px",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    borderRadius: "12px",
  },
  submit: {
    margin: "0px 0px -65px 0px",
    color: "white",
    borderRadius: "50px",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "250px",
    },
  },
  powered: {
    color: "white",
  },
  logoImg: {
    width: "100%",
    maxWidth: "250px",
    height: "auto",
    maxHeight: "120px",
    margin: "0 auto",
    content:
      "url(" +
      (theme.mode === "light"
        ? theme.calculatedLogoLight()
        : theme.calculatedLogoDark()) +
      ")",
  },
  iconButton: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "white",
  },
  link: {
    fontSize: "16px",
    lineHeight: "24px",
    color: theme.mode === "light" ? "black" : "white",
  },
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  borderRadius: "16px",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow: "0 8px 32px 0 #090b11",
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  padding: theme.spacing(2),

  // background: "linear-gradient(2deg, #bc48ff 0%, #aa83ff 50%, #474bff 100%)",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    "&:hover:not(.Mui-focused) fieldset": {
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
  },

  "& .MuiInputBase-input": {
    color: "rgba(255, 255, 255, 0.9)",
    paddingLeft: "10px",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

const StyledFormLabel = styled(FormLabel)({
  color: "rgba(255, 255, 255, 0.7)",
  marginBottom: "8px",
});

const StyledLink = styled(Link)({
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover": {
    color: "rgba(255, 255, 255, 0.9)",
  },
});

const Login = () => {
  const classes = useStyles();
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const { colorMode } = useContext(ColorModeContext);
  const { appLogoFavicon, appName, mode } = colorMode;
  const [user, setUser] = useState({ email: "", password: "" });
  const [allowSignup, setAllowSignup] = useState(false);
  const { getPublicSetting } = useSettings();
  const { handleLogin } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    getPublicSetting("allowSignup")
      .then((data) => {
        setAllowSignup(data === "enabled");
      })
      .catch((error) => {
        console.log("Erro ao ler configuração", error);
      });
  }, []);

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Por favor, insira um email válido.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <>
      <Helmet>
        <title>{appName || "EquipeChat"}</title>
        <link rel="icon" href={appLogoFavicon || "/default-favicon.ico"} />
      </Helmet>

      <SignInContainer>
        <CssBaseline enableColorScheme />
        <Card
          sx={{
            background: "linear-gradient(135deg, #474c4f 0%, #090b11 100%)",
          }}
        >
          <IconButton
            className={classes.iconButton}
            onClick={colorMode.toggleColorMode}
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box>
              <img
                className={classes.logoImg}
                alt="logo"
                style={{ width: "150px" }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 600,
                textAlign: "center",
                fontSize: "clamp(1.5rem, 5vw, 2rem)",
              }}
            >
              Bem-vindo de volta!
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center" }}
            >
              Acesse sua conta para continuar
            </Typography>
          </Box>
          <form noValidate onSubmit={handlSubmit} className={classes.form}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginBottom: 2,
              }}
            >
              <StyledFormLabel>{i18n.t("login.form.email")}</StyledFormLabel>
              <Box
                as={StyledTextField}
                variant="outlined"
                fullWidth
                id="email"
                size="small"
                placeholder="seu@email.com"
                name="email"
                autoFocus
                autoComplete="email"
                onChange={handleChangeInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail style={{ color: "#FFF" }} />
                    </InputAdornment>
                  ),
                  style: { textTransform: "lowercase" },
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginBottom: 4,
              }}
            >
              <StyledFormLabel>
                {" "}
                {i18n.t("login.form.password")}
              </StyledFormLabel>
              <Box
                as={StyledTextField}
                variant="outlined"
                fullWidth
                name="password"
                onChange={handleChangeInput}
                size="small"
                placeholder="******"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="start"
                      >
                        {showPassword ? (
                          <VisibilityOff style={{ color: "#FFF" }} />
                        ) : (
                          <Visibility style={{ color: "#FFF" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              size="small"
              variant="contained"
              color="primary"
              onClick={validateInputs}
              sx={{
                borderRadius: "12px",
                padding: "12px",

                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                boxShadow: "0 4px 15px #090b11",
                "&:hover": {
                  background: "#282929",
                  transition: "0.5s",
                },
                marginTop: "4px",
              }}
              endIcon={<SendIcon />}
            >
              {i18n.t("login.buttons.submit")}
            </Button>
          </form>
          {!allowSignup && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  my: 1,
                }}
              >
                <Divider
                  sx={{
                    flex: 1,
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  }}
                />
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.875rem",
                  }}
                >
                  ou
                </Typography>
                <Divider
                  sx={{
                    flex: 1,
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  }}
                />
              </Box>

              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Novo por aqui?
                </Typography>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Crie sua conta agora e comece a usar o{" "}
                  {appName || "EquipeChat"}
                  <Button
                    href="/signup"
                    color="primary"
                    variant="text"
                    sx={{
                      display: "inline-block",
                      ml: 1,
                      fontWeight: 500,
                    }}
                  >
                    Cadastre-se →
                  </Button>
                </Typography>
              </Box>
            </>
          )}
        </Card>
      </SignInContainer>
    </>
  );
};

export default Login;
