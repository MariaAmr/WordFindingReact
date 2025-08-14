import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/store';
import { register } from '../app/authService';
import { registerStart, registerSuccess, registerFailure } from '../app/authSlice';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Loader from '../Loader/Loader';
import { User, Mail, Lock, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [navigationLoading, setNavigationLoading] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

 useEffect(() => {
   const timer = setTimeout(() => setPageLoading(false), 300);
   return () => clearTimeout(timer);
 }, []);

const onSubmit = async (data: RegisterFormData) => {
  dispatch(registerStart());

  try {
    const response = await register(data.username, data.email, data.password);

    // Store the token and user data
    localStorage.setItem("authToken", response.token);
    localStorage.setItem("username", data.username);

    dispatch(
      registerSuccess({
        username: data.username,
        token: response.token,
      })
    );

    setNavigationLoading(true);
    setTimeout(() => {
      navigate("/login", {
        state: {
          registrationSuccess: true,
          username: data.username,
        },
      });
    }, 800);
  } catch (err) {
    const error = err instanceof Error ? err.message : "Registration failed";
    dispatch(registerFailure(error));
    alert(`Registration failed: ${error}`);
  }
};

  if (pageLoading) return <Loader />;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {navigationLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <Loader />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-24 text-gray-600"
          >
            Redirecting to login...
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...formRegister("username")}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
                onBlur={() => trigger("username")}
              />
            </div>
            {errors.username && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.username.message}
              </motion.p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                {...formRegister("email")}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
                onBlur={() => trigger("email")}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                {...formRegister("password")}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              />
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.password.message}
              </motion.p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <p>Password must contain:</p>
              <ul className="list-disc pl-5">
                <li
                  className={
                    watch("password")?.length >= 8 ? "text-green-500" : ""
                  }
                >
                  At least 8 characters
                </li>
                <li
                  className={
                    watch("password") && /[A-Z]/.test(watch("password"))
                      ? "text-green-500"
                      : ""
                  }
                >
                  One uppercase letter
                </li>
                <li
                  className={
                    watch("password") && /[a-z]/.test(watch("password"))
                      ? "text-green-500"
                      : ""
                  }
                >
                  One lowercase letter
                </li>
                <li
                  className={
                    watch("password") && /[0-9]/.test(watch("password"))
                      ? "text-green-500"
                      : ""
                  }
                >
                  One number
                </li>
                <li
                  className={
                    watch("password") && /[^A-Za-z0-9]/.test(watch("password"))
                      ? "text-green-500"
                      : ""
                  }
                >
                  One special character
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                {...formRegister("confirmPassword")}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              />
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <span className="flex items-center justify-center">
                  <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                  Creating Account...
                </span>
                <Loader/>
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
            onClick={() => setNavigationLoading(true)}
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;