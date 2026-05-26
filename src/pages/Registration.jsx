import { AlertCircle, ArrowRight, CheckCircle, Loader, Lock, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { useUser } from '../contexts/UserContext';
import { registerEmployee } from "../services/authService";
import { validateEmail, validateEmployeeId, validatePassword } from '../utils/validation';

const Registration = ({ onSwitchToLogin }) => {
  const {
    register,
    isLoading,
    registrationSuccess,
    setRegistrationSuccess,
    registrationError,
    setRegistrationError,
    emailExists,
  } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    designation: '',
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, errors: [] });

  const roles = [
    { id: 'employee', label: '👤 Employee', emoji: '👤' },
    { id: 'team-lead', label: '👑 Team Lead', emoji: '👑' },
  ];

  const teams = [
    { id: 'java', label: 'Java Developer' },
    { id: 'python', label: 'Python Developer' },
    { id: 'devops', label: 'DevOps Engineer' },
    { id: 'hr', label: 'Human Resources' },
    { id: 'tester', label: 'QA Tester' },
    { id: 'frontend', label: 'Frontend Developer' },
    { id: 'designer', label: 'UI/UX Designer' },
    { id: 'manager', label: 'Project Manager' },
  ];

  // Auto-redirect to login after successful registration
  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        setRegistrationSuccess(false);
        onSwitchToLogin();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, setRegistrationSuccess, onSwitchToLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setRegistrationError('');

    // Validate password strength in real-time
    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordStrength(validation);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!validateEmployeeId(formData.employeeId).isValid) {
      setError('Employee ID is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0] || 'Password does not meet requirements');
      return;
    }
    if (!formData.team) {
      setError('Please select a team');
      return;
    }
    if (!formData.role) {
      setError('Please select a role');
      return;
    }

    // Email validation
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    try {

  const response = await registerEmployee({

    name: formData.name,

    employeeId: formData.employeeId,

    email: formData.email,

    password: formData.password,

    designation:
  formData.team === "java"
    ? "JAVA_DEVELOPER"
    : formData.team === "python"
    ? "PYTHON_DEVELOPER"
    : formData.team === "devops"
    ? "DEVOPS_ENGINEER"
    : formData.team === "hr"
    ? "HUMAN_RESOURCES"
    : formData.team === "tester"
    ? "QA_TESTER"
    : formData.team === "frontend"
    ? "FRONTEND_DEVELOPER"
    : formData.team === "designer"
    ? "UI_UX_DESIGNER"
    : "PROJECT_MANAGER",

    role:
      formData.role === "team-lead"
        ? "TEAM_LEAD"
        : "EMPLOYEE"

  });

  console.log(response.data);

  alert("Registration Successful");

  onSwitchToLogin();

} catch (error) {

  console.log(error);

  console.log(error.response);

  console.log(error.response.data);

  setError(error.response?.data?.message || "Registration Failed");

}
  };

  const errorMessage = error || registrationError;

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(120%_120%_at_10%_10%,#FFE6D0_0%,#FFD3B5_35%,#F9B37D_70%,#F27A3D_100%)] flex items-start sm:items-center justify-center px-4 py-8 overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full opacity-25 blur-2xl"></div>
      </div>

      {/* Registration card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img src={logo} alt="Application logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {registrationSuccess ? 'Account Created!' : 'Create Account'}
            </h1>
            <p className="text-gray-600">
              {registrationSuccess ? 'Redirecting to login...' : 'Join our task management platform'}
            </p>
          </div>

          {/* Success Message */}
          {registrationSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle size={64} className="text-green-500 mb-4" />
              <p className="text-lg font-semibold text-gray-900 text-center mb-2">
                Registration Successful!
              </p>
              <p className="text-gray-600 text-center">
                Your account has been created. You will be redirected to the login page shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message */}
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      disabled={isLoading}
                    />
                  </div>
                </div>

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

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
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
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={14} className={formData.password.length >= 6 ? 'text-green-500' : 'text-red-500'} />
                          <span className="text-xs text-gray-600">At least 6 characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle size={14} className={/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'} />
                          <span className="text-xs text-gray-600">One uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle size={14} className={/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'} />
                          <span className="text-xs text-gray-600">One number</span>
                        </div>
                      </div>
                      {passwordStrength.isValid && (
                        <p className="text-xs text-green-600 font-medium mt-2">✓ Password is strong!</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <label key={role.id} className="relative flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={formData.role === role.id}
                          onChange={handleChange}
                          className="sr-only"
                          disabled={isLoading}
                        />
                        <div className={`w-full p-3 rounded-lg border-2 text-center transition ${
                          formData.role === role.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 bg-white hover:border-primary-300'
                        }`}>
                          <p className="text-sm font-medium text-gray-900">{role.label}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Team Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Team
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {teams.map((team) => (
                      <label key={team.id} className="relative flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="team"
                          value={team.id}
                          checked={formData.team === team.id}
                          onChange={handleChange}
                          className="sr-only"
                          disabled={isLoading}
                        />
                        <div className={`w-full p-3 rounded-lg border-2 text-center transition ${
                          formData.team === team.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 bg-white hover:border-primary-300'
                        }`}>
                          <p className="text-sm font-medium text-gray-900">{team.label}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-center text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={onSwitchToLogin}
                    className="text-primary-600 font-semibold hover:text-primary-700 transition"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
