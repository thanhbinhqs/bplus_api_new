import { redirect } from "@remix-run/node";

export interface AuthContext {
  isAuthenticated: boolean;
  menuItems?: string[];
  userPermissions?: string[];
  user?: {
    id: string;
    name: string;
    role: string;
  };
}

// Helper để parse cookie
function parseCookies(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  
  return cookies;
}

// Giả lập verify token (trong thực tế sẽ verify JWT hoặc session)
function verifyAuthToken(token: string): { isValid: boolean; user?: any; permissions?: string[] } {
  // Giả lập một số token hợp lệ
  const validTokens = {
    'admin-token-123': {
      user: { id: '1', name: 'Admin User', role: 'admin' },
      permissions: ['admin', 'editor']
    },
    'editor-token-456': {
      user: { id: '2', name: 'Editor User', role: 'editor' },
      permissions: ['editor']
    },
    'user-token-789': {
      user: { id: '3', name: 'Regular User', role: 'user' },
      permissions: ['user']
    }
  };

  const tokenData = validTokens[token as keyof typeof validTokens];
  return tokenData ? { isValid: true, ...tokenData } : { isValid: false };
}

export function requireAuth(request: Request): AuthContext {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parseCookies(cookieHeader);
  const authToken = cookies.auth_token;

  if (!authToken) {
    throw redirect("/login");
  }

  const tokenVerification = verifyAuthToken(authToken);
  
  if (!tokenVerification.isValid) {
    throw redirect("/login");
  }

  return { 
    isAuthenticated: true,
    user: tokenVerification.user,
    userPermissions: tokenVerification.permissions
  };
}

export async function getMenuItems(request: Request): Promise<string[]> {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parseCookies(cookieHeader);
  const authToken = cookies.auth_token;

  if (!authToken) {
    throw new Error("Auth token not found");
  }

  const tokenVerification = verifyAuthToken(authToken);
  
  if (!tokenVerification.isValid || !tokenVerification.permissions) {
    throw new Error("Invalid token or permissions not found");
  }

  // Logic để determine menu items dựa trên permissions
  const permissions = tokenVerification.permissions;
  const menuItems = [];

  if (permissions.includes("admin")) {
    menuItems.push("Dashboard", "User Management", "System Settings");
  }

  if (permissions.includes("editor")) {
    menuItems.push("Content Editor", "Media Library");
  }

  if (permissions.includes("user")) {
    menuItems.push("Profile", "My Content");
  }

  return menuItems;
}

export async function getAuthContext(request: Request): Promise<AuthContext> {
  try {
    // Kiểm tra authentication và lấy user info
    const authResult = requireAuth(request);
    
    if (!authResult.isAuthenticated) {
      return { isAuthenticated: false };
    }

    // Lấy menu items dựa trên token
    const menuItems = await getMenuItems(request);

    return {
      isAuthenticated: true,
      user: authResult.user,
      menuItems,
      userPermissions: authResult.userPermissions
    };
  } catch (error) {
    // Nếu có lỗi redirect thì throw lại
    if (error instanceof Response) {
      throw error;
    }
    
    // Các lỗi khác trả về not authenticated
    return { isAuthenticated: false };
  }
}

// Helper để sử dụng trong Remix loader
export async function withAuth<T>(
  request: Request,
  handler: (authContext: AuthContext) => Promise<T>
): Promise<T> {
  const authContext = await getAuthContext(request);
  return handler(authContext);
}
