import { Button } from "@/components/ui/Button";
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

const Page = () => {
  return (
    <main className="mx-auto my-10 max-w-screen-xl px-8">
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
              <CardDescription>
                Enter your email and password here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="user@email.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="********" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Register Form */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Create your account here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Firstname Lastname" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="zeng@example.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+660123456789" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="********"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="********"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Register</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Page;
