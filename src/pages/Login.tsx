import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/store";
import { login } from "../app/authService";
import { loginStart, loginSuccess, loginFailure } from "../app/authSlice";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loader from "../Loader/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "lucide-react";
import Alert from '@mui/material/Alert';
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [navigationLoading, setNavigationLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    if (location.state?.username) {
      setValue("username", location.state.username);
    }

    if (location.state?.registrationSuccess) {
      setShowAlert(true);
      const alertTimer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(alertTimer);
    }

    return () => clearTimeout(timer);
  }, [location.state, setValue]);

// const onSubmit = async (data: LoginFormData) => {
// setSubmitLoading(true);
// dispatch(loginStart());

// try {
//   const response = await login(data.username, data.password);

//   dispatch(
//     loginSuccess({
//       username: response.user.username,
//       token: response.token,
//     })
//   );
  // // Store tokens in localStorage
  // localStorage.setItem("authToken", response.token);
  // localStorage.setItem("username", response.user.username);

  // Use window.location instead of navigate for initial auth


  // Wait for Redux state to update before navigating
  // await new Promise((resolve) => setTimeout(resolve, 0)); // Microtask delay
  // navigate("/dashboard", { replace: true });

  // localStorage.setItem("authToken", response.token);
  // localStorage.setItem("username", response.user.username);

  // console.log("Before navigation"); // Debug log
  // navigate("/dashboard");
  // console.log("After navigation"); // Debug log
// } catch (err) {
//   console.error("Login error:", err); // Debug log
//   const errorMessage = err instanceof Error ? err.message : "Login failed";
//   dispatch(loginFailure(errorMessage));
// } finally {
//   setSubmitLoading(false); // Ensure loading is always reset
// }
// };
 const onSubmit = async (data: LoginFormData) => {
   setSubmitLoading(true);
   try {
     const response = await login(data.username, data.password);
     localStorage.setItem("authToken", response.token);
     navigate("/dashboard/datamuse-search"); // ✅ Use navigate() instead
   } finally {
     setSubmitLoading(false);
   }
 };

  if (pageLoading) return <Loader />;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Navigation Loader Overlay */}
      <AnimatePresence>
        {navigationLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90"
          >
            <Loader />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-lg text-gray-600"
            >
              Taking you to your dashboard...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xs sm:max-w-md bg-white rounded-lg shadow-md p-4 sm:p-8 mx-4"
          >
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
              onClose={() => setShowAlert(false)}
            >
              Welcome {location.state?.username}! Please login with your new
              account
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Sign In
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              {...formRegister("username")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              disabled={submitLoading}
            />
            {errors.username && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.username.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...formRegister("password")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              disabled={submitLoading}
            />
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 flex justify-center items-center"
          >
            {submitLoading ? (
              <>
                <Loader />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>

      {/* Form Submission Loader */}
      <AnimatePresence>
        {submitLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-40"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;