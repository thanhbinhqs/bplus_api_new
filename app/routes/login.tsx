import { useState } from "react";
import { Form, type ActionFunction, type LoaderFunction, redirect, useActionData, useNavigation, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { LayoutAuth } from "../components/Layout";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginSchema } from "../lib/validations";
import { validateFormData } from "../lib/utils";
import type { LoginDto } from "../types/auth.dto";

// Action để xử lý form submission
export const action: ActionFunction = async ({ request }) => {
  // Validate form data
  const validation = await validateFormData(request, loginSchema);
  
  if (!validation.success) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  const { username, password, rememberMe } = validation.data;

  try {
    // TODO: Implement actual authentication logic
    // For now, just simulate a login process
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, call your API
    if (username === "admin" && password === "password123") {
      // TODO: Set session/cookies here
      return redirect("/dashboard");
    } else {
      return {
        success: false,
        errors: {
          username: ["Tên đăng nhập hoặc mật khẩu không đúng"],
        },
      };
    }
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <LayoutAuth>
      <div className="h-full flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Đăng nhập</CardTitle>
            <CardDescription>
              Nhập thông tin đăng nhập để truy cập hệ thống
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

              {/* Username/Email field */}
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập hoặc Email</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Nhập tên đăng nhập hoặc email"
                  className={actionData?.errors?.username ? "border-red-500" : ""}
                />
                {actionData?.errors?.username && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.username[0]}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
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
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" name="rememberMe" value="true" />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ghi nhớ đăng nhập
                </Label>
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
                    <LogIn className="h-4 w-4" />
                    <span>Đăng nhập</span>
                  </div>
                )}
              </Button>

              {/* Links */}
              <div className="space-y-4 text-center">
                <div>
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Đăng ký ngay
                  </Link>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Thông tin đăng nhập demo:
              </p>
              <div className="text-sm text-blue-600 space-y-1">
                <p><strong>Tên đăng nhập:</strong> admin</p>
                <p><strong>Mật khẩu:</strong> password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </LayoutAuth>
  );
}
