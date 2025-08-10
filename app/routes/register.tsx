import { useState } from "react";
import { Form, type ActionFunction, type LoaderFunction, redirect, useActionData, useNavigation, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Button, Checkbox } from "../components/ui";
import { LayoutAuth } from "../components/layout";
import { Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";
import { registerSchema } from "../lib/validations";
import { validateFormData } from "../lib/utils";
import type { RegisterDto } from "../types/auth.dto";

// Action để xử lý form submission
export const action: ActionFunction = async ({ request }) => {
  // Validate form data
  const validation = await validateFormData(request, registerSchema);
  
  if (!validation.success) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  const { email, username, fullName, password, agreeToTerms } = validation.data;

  try {
    // TODO: Implement actual registration logic
    // For now, just simulate a registration process
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock registration validation
    // Check if username already exists
    if (username === "admin" || username === "test") {
      return {
        success: false,
        errors: {
          username: ["Tên đăng nhập đã tồn tại"],
        },
      };
    }
    
    // Check if email already exists (if provided)
    if (email && (email === "admin@example.com" || email === "test@example.com")) {
      return {
        success: false,
        errors: {
          email: ["Email đã được sử dụng"],
        },
      };
    }
    
    // Mock successful registration
    // TODO: Save user to database
    // TODO: Send verification email if email provided
    // TODO: Set session/cookies here
    
    return {
      success: true,
      message: "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.",
      redirectTo: "/login"
    };
    
  } catch (error) {
    return {
      success: false,
      errors: {
        general: ["Đã xảy ra lỗi, vui lòng thử lại"],
      },
    };
  }
};

// Loader để kiểm tra authentication status
export const loader: LoaderFunction = async ({ request }) => {
  // TODO: Check if user is already logged in
  // If logged in, redirect to dashboard
  return null;
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // If registration was successful, show success message and redirect button
  if (actionData?.success) {
    return (
      <LayoutAuth>
        <div className="h-full flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card className="shadow-lg border-green-200">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-green-800">Đăng ký thành công!</CardTitle>
              <CardDescription className="text-green-600">
                {actionData.message}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Đăng nhập ngay</span>
                </Link>
                <Link
                  to="/"
                  className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Về trang chủ</span>
                </Link>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </LayoutAuth>
    );
  }

  return (
    <LayoutAuth>
      <div className="h-full flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Đăng ký tài khoản</CardTitle>
            <CardDescription>
              Tạo tài khoản mới để sử dụng hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-6">
              {/* General error message */}
              {actionData?.errors?.general && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">
                    {actionData.errors.general[0]}
                  </div>
                </div>
              )}

              {/* Full Name field */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Nhập họ và tên"
                  className={actionData?.errors?.fullName ? "border-red-500" : ""}
                />
                {actionData?.errors?.fullName && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.fullName[0]}
                  </p>
                )}
              </div>

              {/* Username field */}
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập *</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Tên đăng nhập (chỉ chữ cái, số và _)"
                  className={actionData?.errors?.username ? "border-red-500" : ""}
                />
                {actionData?.errors?.username && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.username[0]}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Ít nhất 3 ký tự, chỉ được chứa chữ cái, số và dấu gạch dưới
                </p>
              </div>

              {/* Email field (optional) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email (không bắt buộc)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Nhập địa chỉ email"
                  className={actionData?.errors?.email ? "border-red-500" : ""}
                />
                {actionData?.errors?.email && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.email[0]}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Email dùng để khôi phục mật khẩu và nhận thông báo
                </p>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Nhập mật khẩu"
                    className={`pr-10 ${actionData?.errors?.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {actionData?.errors?.password && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.password[0]}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Ít nhất 8 ký tự, chứa chữ hoa, chữ thường và số
                </p>
              </div>

              {/* Confirm Password field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Nhập lại mật khẩu"
                    className={`pr-10 ${actionData?.errors?.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {actionData?.errors?.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.confirmPassword[0]}
                  </p>
                )}
              </div>

              {/* Terms and Conditions checkbox */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="agreeToTerms" 
                    name="agreeToTerms" 
                    value="true" 
                    required
                    className={actionData?.errors?.agreeToTerms ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Tôi đồng ý với{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      className="text-blue-600 hover:text-blue-500 underline"
                    >
                      Điều khoản sử dụng
                    </a>
                    {" "}và{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      className="text-blue-600 hover:text-blue-500 underline"
                    >
                      Chính sách bảo mật
                    </a>
                  </Label>
                </div>
                {actionData?.errors?.agreeToTerms && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.agreeToTerms[0]}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Đăng ký</span>
                  </div>
                )}
              </Button>

              {/* Links */}
              <div className="space-y-4 text-center">
                <div className="text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Đăng nhập ngay
                  </Link>
                </div>
                <div>
                  <Link
                    to="/"
                    className="text-sm text-gray-500 hover:text-gray-600 flex items-center justify-center space-x-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Về trang chủ</span>
                  </Link>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Registration tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-800 mb-2">
                💡 Lưu ý khi đăng ký:
              </p>
              <div className="text-sm text-blue-600 space-y-1 text-left">
                <p>• Tên đăng nhập phải duy nhất trong hệ thống</p>
                <p>• Email (nếu có) sẽ dùng để khôi phục mật khẩu</p>
                <p>• Mật khẩu mạnh giúp bảo vệ tài khoản của bạn</p>
                <p>• Thông tin sẽ được bảo mật theo chính sách</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </LayoutAuth>
  );
}
