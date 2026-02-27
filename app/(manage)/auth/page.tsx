"use client";

import { login } from "@/app/api/query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { userAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import * as z from "zod";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "密码至少6个字符").max(36, "密码最多36个字符"),
});

export default function LoginPage() {
  const router = useRouter();
  const isAuth = userAuthStore((s) => s.isAuthed);
  const setAuth = userAuthStore((s) => s.setAuth);

  const { mutate } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (response) => {
      setAuth({
        user: response.user,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  useEffect(() => {
    if (isAuth) router.replace("/manage");
  }, [isAuth, router]);

  if (isAuth) return null;

  return (
    <div className={"w-screen h-screen flex items-center justify-center"}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>在下方输入邮箱和密码以登录</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            id="login-form"
            className={"flex flex-col gap-4"}
          >
            <form.Field name="email">
              {(field) => {
                const isInvalid = !field.state.meta.isValid;

                const fieldProps = {
                  id: field.name,
                  value: field.state.value,
                  onBlur: field.handleBlur,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value),
                  "aria-invalid": isInvalid,
                } as const;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>标题</FieldLabel>
                    <Input
                      {...fieldProps}
                      placeholder="请输入邮箱"
                      autoComplete="off"
                      className="md:text-md"
                    />
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                const isInvalid = !field.state.meta.isValid;

                const fieldProps = {
                  id: field.name,
                  value: field.state.value,
                  onBlur: field.handleBlur,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value),
                  "aria-invalid": isInvalid,
                } as const;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>密码</FieldLabel>
                    <Input
                      {...fieldProps}
                      placeholder="请输入密码"
                      autoComplete="off"
                      type="password"
                      className="md:text-md"
                    />
                  </Field>
                );
              }}
            </form.Field>
          </form>
        </CardContent>
        <CardFooter className={"flex-col gap2"}>
          <Button type="submit" form="login-form" className={"w-full"}>
            登录
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
