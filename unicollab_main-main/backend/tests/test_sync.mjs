import fs from 'fs';
const email = "testx5@test.com";
const password = "password123";

async function run() {
    console.log("Registering...");
    const res = await fetch("http://127.0.0.1:8000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: "Test User 5", role: "founder" })
    });
    console.log(res.status);

    console.log("Logging in...");
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const res2 = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    const data = await res2.json();
    console.log(res2.status);

    const token = data.access_token;
    console.log("Syncing...");
    const res3 = await fetch("http://127.0.0.1:8000/api/v1/auth/sync-supabase-profile", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const txt = await res3.text();
    fs.writeFileSync('sync_err.txt', txt);
    console.log(res3.status, "Done");
}
run();
