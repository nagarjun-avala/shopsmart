"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useSessionsClient } from "@/hooks/useSessions";

const formSchema = z.object({
  identifier: z
    .string()
    .min(2, {
      message: "Email or Username must be at least 2 characters.",
    })
    .max(50),
  password: z.string().min(6),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { loading } = useSessionsClient();
  const { user, login } = useAuth();

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (user && user.id && pathname === "/login") router.push("/");
  }, [pathname, router, user]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "nagarjun",
      password: "Nagarjun@12345",
    },
  });

  if (loading) return <p>Loading...</p>;
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      setIsLoading(true);
      await login(values.identifier, values.password);

      console.log("Login successful:");
      router.push("/");
    } catch (error) {
      console.log("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email/username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com or username"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          type={`${showPassword ? "text" : "password"}`}
                          placeholder={`${showPassword ? "password" : "●●●●●●●●●●"
                            }`}
                          required
                          className="pr-10 text-gray-500"
                          {...field}
                        />
                        <span
                          className="absolute right-2 cursor-pointer select-none"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <span>🙈</span> : <span>👁️</span>}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                <Item variant="default">
                  {isLoading && (
                    <ItemMedia>
                      <Spinner className="h-4 w-4" />
                    </ItemMedia>
                  )}
                  <ItemContent>
                    <ItemTitle className="line-clamp-1">
                      {isLoading ? "Logging you in..." : "Login"}
                    </ItemTitle>
                  </ItemContent>
                </Item>
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
