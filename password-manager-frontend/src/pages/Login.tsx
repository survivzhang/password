import { useState } from 'react';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { authAPI } from '../services/api';
import { authUtils } from '../utils/auth';

function Login() {
  // 你的代码：创建 3 个状态
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async () => {
    try {
      setError('');

      if (!email || !password) {
        setError("Please input your email and password");
        return;
      }

      const response = await authAPI.login(email, password);
      authUtils.setToken(response.token);
      alert('Login successful!');
    } catch (err: any) {
      // 你的代码：显示错误
      setError(err.response?.data?.error || 'Login failed');
    }
  };
  
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
         {/* 错误信息 */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <h3 className='email'></h3>
        <Input
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
          type='email'
          placeholder='please enter email'
        />
        <h3 className='password'></h3>
        <Input
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
          type='password'
          placeholder='please enter your password'
        />
        <Button onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}

export default Login;