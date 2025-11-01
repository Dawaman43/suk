import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

function AuthPage() {
  return (
    <div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="register">
          <Register />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AuthPage;
