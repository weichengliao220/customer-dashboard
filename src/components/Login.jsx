import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Container, Checkbox, FormControlLabel, Link, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!userId || !password) {
      setError("ユーザーIDとパスワードをご入力ください");
    } else if (!/\S+@\S+\.\S+/.test(userId)) {
      setError("有効なメールアドレスをご入力ください");
    } else if (password.length < 6) {
      setError("パスワードは6文字以上である必要があります");
    } else {
      setError(""); // Clear error if fields are valid
      navigate("/customers"); // Navigate to the customers page
    }
  };

  const handleOpenForgotPasswordDialog = () => {
    setOpenForgotPasswordDialog(true);
  };

  const handleCloseForgotPasswordDialog = () => {
    setOpenForgotPasswordDialog(false);
    setForgotPasswordEmail("");
    setForgotPasswordError("");
  };

  const handleForgotPassword = () => {
    if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      setForgotPasswordError("有効なメールアドレスをご入力ください");
    } else {
      setForgotPasswordError("");
      // Add your forgot password logic here (e.g., sending a password reset email)
      handleCloseForgotPasswordDialog();
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw", // Ensure the container takes the full width
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor: "#f3f3f3", // Set the background color to #f3f3f3
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "black" }}>
          ログイン
        </Typography>
        <TextField
          label="ユーザーID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <TextField
          label="パスワード"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography sx={{ color: "darkgrey" }}>
              ログイン状態を保持する
            </Typography>
          }
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          ログイン
        </Button>
        <Link href="#" variant="body2" sx={{ mt: 2 }} onClick={handleOpenForgotPasswordDialog}>
          パスワードを忘れましたか？
        </Link>
      </Box>
      <Dialog open={openForgotPasswordDialog} onClose={handleCloseForgotPasswordDialog}>
        <DialogTitle>パスワードをリセット</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="メールアドレス"
            type="email"
            fullWidth
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            error={!!forgotPasswordError}
            helperText={forgotPasswordError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPasswordDialog} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleForgotPassword} color="primary">
            送信
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
