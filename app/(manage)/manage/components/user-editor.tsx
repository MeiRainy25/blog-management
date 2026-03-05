"use client";

import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  createUser,
  ICreateUserDto,
  IUpdateUserDto,
  TUserData,
  updateUser,
} from "@/app/api/query";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface UserEditorProps {
  user: TUserData | null;
  onSuccess?: () => void;
}

const schema = z.object({
  email: z.email().max(255),
  nickname: z.string().min(2).max(100),
  // 编辑时允许为空（表示不修改密码），创建时要求必填
  password: z.string().max(100),
});

export default function UserEditor({ user, onSuccess }: UserEditorProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ICreateUserDto | IUpdateUserDto) => {
      if (user) {
        return updateUser(user.id, data as IUpdateUserDto);
      }
      return createUser(data as ICreateUserDto);
    },
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  const form = useForm({
    defaultValues: {
      email: user?.email ?? "",
      nickname: user?.nickname ?? "",
      password: "",
    },
    validators: {
      onSubmit: (args) => {
        const value = args.value;
        const parsed = schema.safeParse(value);
        if (!parsed.success) {
          return parsed.error;
        }

        if (!user) {
          // 创建：密码必填且最少 6 位
          if (!value.password || value.password.length < 6) {
            return "密码长度至少为 6 位";
          }
        } else {
          // 编辑：如果填写了密码才校验长度
          if (value.password && value.password.length < 6) {
            return "密码长度至少为 6 位";
          }
        }

        return undefined;
      },
    },
    onSubmit: ({ value }) => {
      if (user) {
        const dto: IUpdateUserDto = {};
        dto.email = value.email;
        dto.nickname = value.nickname;
        if (value.password) dto.password = value.password;
        mutate(dto);
      } else {
        mutate({
          email: value.email,
          nickname: value.nickname,
          password: value.password,
        });
      }
    },
  });

  return (
    <form
      className={"flex flex-col w-full gap-2 relative"}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Loading loading={isPending} />

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
              <FieldLabel htmlFor={field.name} className={"text-lg"}>
                邮箱
              </FieldLabel>
              <Input
                {...fieldProps}
                placeholder="请输入邮箱"
                autoComplete="off"
                type="email"
                className={"md:text-md"}
              />
              {isInvalid && (
                <p className={"text-destructive text-sm"}>邮箱不合法</p>
              )}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="nickname">
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
              <FieldLabel htmlFor={field.name} className={"text-lg"}>
                昵称
              </FieldLabel>
              <Input
                {...fieldProps}
                placeholder="请输入昵称"
                autoComplete="off"
                className={"md:text-md"}
              />
              {isInvalid && (
                <p className={"text-destructive text-sm"}>昵称不合法</p>
              )}
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
              <FieldLabel htmlFor={field.name} className={"text-lg"}>
                密码
              </FieldLabel>
              <Input
                {...fieldProps}
                placeholder={user ? "不修改请留空" : "请输入密码"}
                autoComplete="off"
                type="password"
                className={"md:text-md"}
              />
              {isInvalid && (
                <p className={"text-destructive text-sm"}>密码不合法</p>
              )}
            </Field>
          );
        }}
      </form.Field>

      <Button type="submit">{user ? "保存" : "创建"}</Button>
    </form>
  );
}
