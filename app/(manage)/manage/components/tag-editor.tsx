"use client";

import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTag, TTag, updateTag } from "@/app/api/query";
import { Field, FieldLabel } from "@/components/ui/field";
import ColorPicker from "@/components/color-picker";
import { useMutation } from "@tanstack/react-query";
import { Loading } from "@/components/loading";

export interface TagEditorProps {
  tag: TTag | null;
  onSuccess?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2).max(100),
  color: z.string().max(7),
  group: z.string(),
});

export default function TagEditor({ tag, onSuccess }: TagEditorProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      if (!!tag) {
        return updateTag(tag.id, data);
      } else {
        return createTag(data);
      }
    },
    onSuccess: () => {
      form.reset();
      onSuccess?.();
    },
  });

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    mutate(value);
  };

  const form = useForm({
    defaultValues: {
      name: tag?.name ?? "",
      color: tag?.color ?? "",
      group: tag?.group ?? "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
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
      <form.Field name="name">
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
                标签名称
              </FieldLabel>
              <Input
                {...fieldProps}
                placeholder="请输入标签名称"
                autoComplete="off"
                className={"md:text-md"}
              />
              {isInvalid && (
                <p className={"text-destructive  text-sm"}>标签名称不合法</p>
              )}
            </Field>
          );
        }}
      </form.Field>
      <form.Field name="color">
        {(field) => {
          const isInvalid = !field.state.meta.isValid;

          const fieldProps = {
            id: field.name,
            value: field.state.value,
            onBlur: field.handleBlur,
            onChange: (value: string) => field.handleChange(value),
            "aria-invalid": isInvalid,
          } as const;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name} className={"text-lg"}>
                标签颜色
              </FieldLabel>
              <ColorPicker {...fieldProps} showColor="outside" />
            </Field>
          );
        }}
      </form.Field>
      <form.Field name="group">
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
                标签分组
              </FieldLabel>
              <Input
                {...fieldProps}
                placeholder="请输入标签分组"
                autoComplete="off"
                className={"md:text-md"}
              />
              {isInvalid && (
                <p className={"text-destructive  text-sm"}>标签分组不合法</p>
              )}
            </Field>
          );
        }}
      </form.Field>
      <Button type="submit">{tag ? "保存" : "创建"}</Button>
    </form>
  );
}
