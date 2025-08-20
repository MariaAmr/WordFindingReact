import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/store";
import { login } from "../app/authService";
import { loginSuccess } from "../app/authSlice";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Loader from "../Loader/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "lucide-react";
import Alert from "@mui/material/Alert";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  // Hook declarations]
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // State declarations
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  // const [navigationLoading, setNavigationLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form hook
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Effects
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

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  // Event handlers
  const onSubmit = async (data: LoginFormData) => {
  setSubmitLoading(true);
  setError(null);
    try {
      const response = await login(data.username, data.password);

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("username", data.username);

      await new Promise<void>((resolve) => {
        dispatch(
          loginSuccess({
            username: data.username,
            token: response.token,
          })
        );
        resolve();
      });

      await new Promise((resolve) => requestAnimationFrame(resolve));

      navigate("/dashboard", { state: { fromLogin: true } });
    } catch (error) {
      let message = "Login failed. Please try again.";
      if (error instanceof Error) {
        message = error.message.includes("Invalid")
          ? "Invalid username or password"
          : error.message;
      }
      setError(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) return <Loader />;

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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Error Display - Now at the top of the page */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-0 right-0 flex justify-center z-50"
          >
            <div className="bg-red-100 text-red-700 p-4 rounded-md shadow-lg max-w-md w-full mx-4 text-center">
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Loader Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 flex justify-center z-50"
          >
            <div className="bg-red-100 text-red-700 p-4 rounded-md shadow-lg max-w-md w-full mx-4">
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Alert - Also moved to top */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 flex justify-center z-50"
          >
            <div className="w-full max-w-xs sm:max-w-md bg-white rounded-lg shadow-md p-2 sm:p-8 mx-4">
              <Alert
                icon={<CheckIcon fontSize="inherit" />}
                severity="success"
                onClose={() => setShowAlert(false)}
              >
                Welcome {location.state?.username}! Please login with your new
                account
              </Alert>
            </div>
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
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-30"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;
