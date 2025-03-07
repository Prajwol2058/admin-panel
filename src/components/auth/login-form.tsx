"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FormField } from "../forms/form-field";
import { PasswordField } from "../forms/password-field";
import { FormSubmit } from "../forms/form-submit";
import { LoginFormValues, loginSchema } from "@/lib/validation/auth-schemas";

export function LoginForm() {
  const router = useRouter();

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      console.log(values);

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(loginSchema)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <CardContent className="space-y-4">
              <FormField
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                required
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <PasswordField
                    id="password"
                    name="password"
                    label="Password"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <FormSubmit
                isSubmitting={isSubmitting}
                label="Login"
                submittingLabel="Logging in..."
              />
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </div>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
