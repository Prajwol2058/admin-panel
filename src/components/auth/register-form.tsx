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
import { FormField } from "@/components/forms/form-field";
import { PasswordField } from "@/components/forms/password-field";
import { SelectField } from "@/components/forms/select-field";
import { PhotoUpload } from "@/components/forms/photo-upload";
import { FormSubmit } from "@/components/forms/form-submit";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validation/auth-schemas";
import { Separator } from "@/components/ui/separator";
import { RadioGroupField } from "../forms/radio-group";

export function RegisterForm() {
  const router = useRouter();

  const initialValues: RegisterFormValues = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "MALE",
    role: "USER",
    photo: "",
  };

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "PREFERNOTTOSAY", label: "Prefer not to say" },
  ];

  const roleOptions = [
    { value: "USER", label: "User" },
    { value: "ADMIN", label: "Editor" },
  ];

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      console.log(values);

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
                    value={values.photo || ""}
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
                    id="confirmPassword"
                    name="confirmPassword"
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
