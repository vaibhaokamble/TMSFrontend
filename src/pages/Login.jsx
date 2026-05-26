import { ArrowRight, Loader, Lock, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { useUser } from '../contexts/UserContext';
import { loginEmployee } from "../services/authService";
import { validateEmployeeId } from '../utils/validation';

const Login = ({ onSwitchToRegister }) => {
  const { login, isLoading, loginError, setLoginError } = useUser();
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');

  // Update local error when context loginError changes
  useEffect(() => {
    if (loginError) {
      setError(loginError);
      setLoginError(''); // Clear context error after displaying
    }
  }, [loginError, setLoginError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!validateEmployeeId(formData.employeeId).isValid) {
      setError('Employee ID is required');
      return;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }
    if (!formData.role) {
      setError('Please select a role');
      return;
    }
    // Call login with form data
   loginEmployee({
  employeeId: formData.employeeId.trim(),
  password: formData.password,
  role: formData.role,
})
  .then((res) => {

    console.log(res.data);

    localStorage.setItem(
      "accessToken",
      res.data.data.accessToken
    );

    localStorage.setItem(
      "refreshToken",
      res.data.data.refreshToken
    );

    alert("Login Successful");

  })
  .catch((err) => {

    console.log(err);

    setError("Invalid Credentials");

  });
  };

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(120%_120%_at_10%_10%,#FFE6D0_0%,#FFD3B5_35%,#F9B37D_70%,#F27A3D_100%)] flex items-start sm:items-center justify-center px-4 py-8 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full opacity-25 blur-2xl"></div>
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 overflow-visible">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img src={logo} alt="Application logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management</h1>
            <p className="text-gray-600">Secure access with your employee ID</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Employee ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Enter your employee ID"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="TEAM_LEAD"
                    checked={formData.role === 'TEAM_LEAD'}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div className={`w-full p-3 rounded-lg border-2 text-center transition ${
                    formData.role === 'TEAM_LEAD'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 bg-white hover:border-primary-300'
                  }`}>
                    <p className="text-sm font-medium text-gray-900">👑 Team Lead</p>
                  </div>
                </label>
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="EMPLOYEE"
                    checked={formData.role === 'EMPLOYEE'}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div className={`w-full p-3 rounded-lg border-2 text-center transition ${
                    formData.role === 'EMPLOYEE'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 bg-white hover:border-primary-300'
                  }`}>
                    <p className="text-sm font-medium text-gray-900">👤 Employee</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-primary-600 font-semibold hover:text-primary-700 transition"
              >
                Sign Up
              </button>
            </p>
            <p className="text-xs text-center text-gray-500 mt-6">
              Please sign in with your account credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
