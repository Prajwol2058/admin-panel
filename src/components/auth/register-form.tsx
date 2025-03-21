"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validation/auth-schemas";
import { Separator } from "@/components/ui/separator";
import { RadioGroupField } from "../forms/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormField,
  FormSubmit,
  PasswordField,
  PhotoUpload,
  SelectField,
} from "..";
import { useAuth } from "../hooks/use-auth";
import { genderOptions, roleOptions } from "../constants/roles";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const initialValues: RegisterFormValues = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    gender: "MALE",
    role: "USER",
    photo: null,
  };

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const formData = new FormData();

      // Append all initial values to formData
      Object.entries(initialValues).forEach(([key, defaultValue]) => {
        const value = values[key as keyof RegisterFormValues];

        if (key === "photo" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(
            key,
            value ? value.toString() : defaultValue.toString()
          );
        }
      });

      await register(formData);

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(registerSchema)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex justify-center py-4">
                  <PhotoUpload
                    value={values.photo || null}
                    onChange={(value) => setFieldValue("photo", value)}
                  />
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    id="name"
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    required
                  />

                  <FormField
                    id="username"
                    name="username"
                    label="Username"
                    placeholder="johndoe"
                    required
                  />
                </div>

                <FormField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <PasswordField
                    id="password"
                    name="password"
                    label="Password"
                    required
                  />

                  <PasswordField
                    id="confirm_password"
                    name="confirm_password"
                    label="Confirm Password"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <RadioGroupField
                    id="gender"
                    name="gender"
                    label="Gender"
                    options={genderOptions}
                    required
                  />

                  <SelectField
                    id="role"
                    name="role"
                    label="Role"
                    options={roleOptions}
                    placeholder="Select a role"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <FormSubmit
                isSubmitting={isSubmitting}
                label="Create account"
                submittingLabel="Creating account..."
              />
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
