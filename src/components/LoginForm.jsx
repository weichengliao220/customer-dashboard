import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!userId || !password) {
      setError("ユーザーIDとパスワードを入力してください");
      return;
    }
    alert("ログイン成功！(仮)");

    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">ログイン</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="ユーザーID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full border p-2 mb-2"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-2"
        />
        <button type="submit" className="bg-red-500 text-white p-2 rounded">
          ログイン
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
