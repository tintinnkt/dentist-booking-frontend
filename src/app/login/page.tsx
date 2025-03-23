"use client";
import { InteractiveHoverButton } from "@/components/magicui/InteractiveHoverButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { BackendRoutes, FrontendRoutes } from "@/config/apiRoutes";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Registration state
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Login handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Create a loading toast that you can dismiss later
    const toastId = toast.loading("Logging in...");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // Update the toast to show an error
        toast.error("Invalid credentials. Please try again.", { id: toastId });
        setError(result.error);
      } else {
        // Update the toast to show success
        toast.success("Logged in successfully!", { id: toastId });
        router.push(FrontendRoutes.DENTIST_LIST);
      }
    } catch (err) {
      // In case of a network error or other exception
      toast.error("Login failed. Please try again.", { id: toastId });
      setError("An unexpected error occurred.");
    }
  };

  // Registration handler
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    const registerPromise = axios.post(BackendRoutes.REGISTER, {
      name,
      email: regEmail,
      password: newPassword,
      tel: phone,
      role: "user",
    });

    toast.promise(registerPromise, {
      loading: "Creating your account...",
      success: "Account created successfully!",
      error: "Registration failed. Please try again.",
    });

    try {
      await registerPromise;

      // Automatically log in the user after successful registration
      const loginPromise = signIn("credentials", {
        redirect: false,
        email: regEmail,
        password: newPassword,
      });

      toast.promise(loginPromise, {
        loading: "Logging you in...",
        success: "Logged in successfully!",
        error: "Login failed after registration.",
      });

      const result = await loginPromise;

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(FrontendRoutes.DENTIST_LIST);
      }
    } catch (err) {
      axios.isAxiosError(err)
        ? setError(err.response?.data.message || "Registration failed.")
        : setError("An unexpected error occurred.");
    }
  };

  return (
    <main className="mx-auto my-10 max-w-screen-xl place-items-center px-8">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* Login Form */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your email and password.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
              </CardContent>
              <CardFooter className="py-3">
                <InteractiveHoverButton type="submit">
                  Log in
                </InteractiveHoverButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Register Form */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Create your account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Firstname Lastname"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="zeng@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+660123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="********"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {success && !error && (
                  <p className="text-green-500">{success}</p>
                )}
              </CardContent>
              <CardFooter className="py-3">
                <InteractiveHoverButton type="submit">
                  Register
                </InteractiveHoverButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Page;
