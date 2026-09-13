import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Building2, Phone, KeyRound, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import {
  login as apiLogin,
  register as apiRegister,
  verifyOtp as apiVerifyOtp,
  resendOtp as apiResendOtp,
  postLoginRedirectPath,
  type BackendRole
} from "@/lib/api";
const appLogo = "/image/IMG-20260323-WA0012-removebg-preview.png";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, login } = useAuth();
  const authState = location.state as { userType?: string; from?: string; authMode?: "login" | "signup" } | null;
  const isAdminLogin = authState?.userType === "admin" || authState?.from?.startsWith("/admin");
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: (authState?.userType === "landowner" ? "landowner" : "builder") as "builder" | "landowner",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Redirect if already authenticated (use stored role, not dropdown selection)
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const from = authState?.from;
    const role: BackendRole =
      user.userType === "admin" ? "ADMIN" : user.userType === "builder" ? "PROFESSIONAL" : "LANDOWNER";
    navigate(postLoginRedirectPath(role, from), { replace: true });
  }, [isAuthenticated, user, navigate, authState?.from]);

  // Support path (/login vs /signup), query params (?mode=signup, ?type=landowner), and location.state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryMode = searchParams.get("mode");
    const queryType = searchParams.get("type");

    if (location.pathname === "/signup" || queryMode === "signup" || authState?.authMode === "signup") {
      setIsLogin(false);
    } else if (location.pathname === "/login" || queryMode === "login" || authState?.authMode === "login") {
      setIsLogin(true);
    }

    if (queryType === "landowner" || authState?.userType === "landowner") {
      setFormData((prev) => ({ ...prev, userType: "landowner" }));
    } else if (queryType === "builder" || queryType === "professional" || authState?.userType === "builder") {
      setFormData((prev) => ({ ...prev, userType: "builder" }));
    }
  }, [location.pathname, location.search, authState]);

  // Keep auth screen on a single solid background across html/body/root.
  useEffect(() => {
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    const prevBodyBg = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#edf8f1";
    document.body.style.backgroundColor = "#edf8f1";
    return () => {
      document.documentElement.style.backgroundColor = prevHtmlBg;
      document.body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name] || errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        delete newErrors.general;
        return newErrors;
      });
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (isLogin && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Mobile number is required";
      } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.phone.trim())) {
        newErrors.phone = "Mobile number is invalid";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!isLogin && !acceptedTerms) {
      newErrors.terms =
        "You must accept the Terms & Conditions to use Jointlly. Jointlly is only a facilitator and is not responsible for any disputes between parties.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, general: "" }));
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        const response = isAdminLogin
          ? await apiLogin(formData.email, formData.password)
          : await apiLogin(formData.email, formData.password, formData.userType as "builder" | "landowner");
        login(response);
        navigate(postLoginRedirectPath(response.user.role, authState?.from), { replace: true });
      } else {
        const role: BackendRole = formData.userType === "builder" ? "PROFESSIONAL" : "LANDOWNER";
        await apiRegister(
          formData.name.trim(),
          formData.email.trim(),
          formData.phone.trim(),
          formData.password,
          role
        );
        // Navigate directly to dedicated /verify-email page
        const query = new URLSearchParams({
          email: formData.email.trim(),
          userType: formData.userType,
        }).toString();
        navigate(`/verify-email?${query}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setSubmitting(false);
    }

  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, otp: "", general: "" }));
    setResendMessage(null);

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "Please enter a valid 6-digit OTP code" }));
      return;
    }

    setOtpSubmitting(true);
    try {
      await apiVerifyOtp(formData.email.trim(), otpCode.trim());
      // Log user in automatically after successful verification
      const loginResp = await apiLogin(formData.email.trim(), formData.password, formData.userType);
      login(loginResp);
      navigate(postLoginRedirectPath(loginResp.user.role, authState?.from), { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid or expired OTP code.";
      setErrors((prev) => ({ ...prev, otp: message }));
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setErrors((prev) => ({ ...prev, otp: "", general: "" }));
    setResendMessage(null);
    setResendingOtp(true);
    try {
      const res = await apiResendOtp(formData.email.trim());
      setResendMessage(res.message || "A new OTP code has been sent to your email.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to resend OTP. Please try again.";
      setErrors((prev) => ({ ...prev, otp: message }));
    } finally {
      setResendingOtp(false);
    }
  };


  const userTypeLabel = formData.userType === "builder" ? "Construction Company" : "Landowner";

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 sm:mb-8 transition-colors min-h-[44px] items-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-glass-border"
          >
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="mb-3 sm:mb-4 flex justify-center">
                <img
                  src={appLogo}
                  alt="Jointlly"
                  className="h-16 sm:h-20 w-auto object-contain block"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {showOtpScreen ? "Verify OTP" : isLogin ? "Login" : "Create Account"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {showOtpScreen
                  ? `Enter the 6-digit code sent to ${formData.email}`
                  : isLogin
                  ? `Login to continue as ${userTypeLabel}`
                  : `Sign up to get started as ${userTypeLabel}`}
              </p>
            </div>

            {showOtpScreen ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-6">
                {successMessage && (
                  <div className="text-xs sm:text-sm text-primary mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    {successMessage}
                  </div>
                )}
                {resendMessage && (
                  <div className="text-xs sm:text-sm text-green-600 mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    {resendMessage}
                  </div>
                )}
                {errors.otp && (
                  <div className="text-xs sm:text-sm text-destructive mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    {errors.otp}
                  </div>
                )}

                <div>
                  <Label htmlFor="otpCode" className="mb-2 block">
                    6-Digit Verification Code *
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="otpCode"
                      name="otpCode"
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                      className="pl-10 text-center tracking-widest font-mono text-lg"
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full btn-premium min-h-[44px]"
                  disabled={otpSubmitting}
                >
                  {otpSubmitting ? "Verifying..." : "Verify OTP & Continue"}
                </Button>

                <div className="flex items-center justify-between pt-2 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpScreen(false);
                      setIsLogin(true);
                    }}
                    className="text-muted-foreground hover:text-foreground underline"
                  >
                    Back to Login
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendingOtp}
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resendingOtp ? "animate-spin" : ""}`} />
                    {resendingOtp ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              </form>
            ) : (
              <>
            {/* Toggle Login/Signup */}
            <div className="flex items-center gap-2 mb-5 sm:mb-6 p-1 bg-secondary/50 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setErrors((prev) => ({ ...prev, general: "" }));
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2.5 sm:py-2 px-4 rounded-md text-sm font-medium transition-colors min-h-[44px] sm:min-h-0 ${
                  isLogin
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setErrors((prev) => ({ ...prev, general: "" }));
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2.5 sm:py-2 px-4 rounded-md text-sm font-medium transition-colors min-h-[44px] sm:min-h-0 ${
                  !isLogin
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>


            {errors.general && (
              <div className="text-sm text-destructive mb-4 p-3 rounded-lg bg-destructive/10 space-y-2">
                <p>{errors.general}</p>
                {(errors.general.toLowerCase().includes("already exists") ||
                  errors.general.toLowerCase().includes("registered") ||
                  errors.general.toLowerCase().includes("log in") ||
                  errors.general.toLowerCase().includes("conflict")) && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setErrors({});
                    }}
                    className="text-xs font-semibold text-[#1A5C35] dark:text-[#52b788] underline block hover:opacity-80 cursor-pointer"
                  >
                    Already registered? Click here to switch to Login →
                  </button>
                )}
              </div>
            )}

            {successMessage && (
              <p className="text-sm text-emerald-700 mb-4 p-3 rounded-lg bg-emerald-50">
                {successMessage}
              </p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name" className="mb-2 block">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name}</p>
                  )}
                </div>
              )}

              {!isLogin && (
                <div>
                  <Label htmlFor="phone" className="mb-2 block">
                    Mobile Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="mb-2 block">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
                {isLogin && (
                  <div className="flex justify-end mt-1">
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword" className="mb-2 block">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none p-1"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Account type dropdown */}
              {!isAdminLogin && (
                <div>
                  <Label className="mb-2 block">Account type</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value: "builder" | "landowner") =>
                      setFormData((prev) => ({ ...prev, userType: value }))
                    }
                  >
                    <SelectTrigger className="h-10 bg-primary/5 border-primary/20">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="builder">
                        <span className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Construction Company
                        </span>
                      </SelectItem>
                      <SelectItem value="landowner">
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Landowner
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1">
                <label className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <Link to="/legal/terms" className="text-primary underline underline-offset-2">
                      Terms &amp; Conditions
                    </Link>{" "}
                    and understand that Jointlly is an online facilitator platform and is not responsible for
                    any disputes, escalations, or agreements between users.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-destructive mt-1">{errors.terms}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full btn-premium min-h-[44px]"
                disabled={submitting}
              >
                {submitting ? "Please wait..." : isLogin ? "Login" : "Create Account"}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link to="/legal/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/legal/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
            </>
            )}
          </motion.div>
      </div>
    </div>
  );
};


export default Auth;
