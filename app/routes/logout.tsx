import { redirect } from "react-router";

export async function action() {

    return redirect("/login", {
        headers: {
            "Set-Cookie": "auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
        }

    });
}

export async function loader() {
    // Nếu có ai đó truy cập logout qua GET, cũng xóa cookie
    const headers = new Headers();
    headers.append("Set-Cookie", "auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");

    return redirect("/login", {
        headers: {
            "Set-Cookie": "auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
        }
    });
}
