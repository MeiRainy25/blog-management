"use client";

import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { EmptyContent } from "../../../../components/editor/constant";
import Editor, { JSONContent } from "../../../../components/editor";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import React from "react";
import { EditorRef } from "../../../../components/editor/ui/EditorRoot";
import {
  createBlog,
  getTags,
  ICreateBlogDto,
  IUpdateBlogDto,
  TBlogDetail,
  updateBlog,
} from "@/app/api/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/loading";
import MultiSelect from "@/components/multi-select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BlogEditorProps {
  blog?: TBlogDetail;
}

const TiptapNodeSchema: z.ZodType<JSONContent, JSONContent> = z.lazy(() =>
  z.object({
    type: z.string().optional(),
    text: z.string().optional(),
    attrs: z.record(z.any(), z.any()).optional(),
    content: z.array(TiptapNodeSchema).optional(),
  }),
);

const formSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(50, "标题不能超过50个字符"),
  content: TiptapNodeSchema,
  tags: z.array(z.number()),
});

export default function BlogEditor(props: BlogEditorProps) {
  const { blog } = props;
  const isEdit = !!blog?.id;

  const editorIns = React.useRef<EditorRef | null>(null);

  const router = useRouter();

  const {
    data: tagsData,
    isFetching: tagsFetching,
    isPending: tagsPending,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags({ page: 1, pageSize: 100 }),
  });
  const { mutate: create, isPending: createLoading } = useMutation({
    mutationFn: (dto: ICreateBlogDto) => createBlog(dto),
    onSuccess: () => {
      router.back();
      toast.success("博客创建成功");
    },
  });
  const { mutate: update, isPending: updateLoading } = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: IUpdateBlogDto }) =>
      updateBlog(id, dto),
    onSuccess: () => {
      router.back();
      toast.success("博客更新成功");
    },
  });

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    console.log(value);
    if (isEdit) {
      const updateBlogDto: IUpdateBlogDto = {
        ...value,
      };
      update({ id: blog.id, dto: updateBlogDto });
    } else {
      const createBlogDto: ICreateBlogDto = {
        ...value,
        //TODO: 测试用固定userId
        authorId: "cmltfsfmy0000acgci0lwrmi6",
      };
      create(createBlogDto);
    }
  };

  const form = useForm({
    defaultValues: {
      title: blog?.title ?? "",
      content: blog?.content ?? EmptyContent,
      tags: blog?.tags.map((tag) => tag.id) ?? [],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <div className="flex flex-col gap-2 p-1 relative h-full w-full">
      <Loading loading={createLoading || updateLoading} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className={"flex flex-col gap-4 px-72"}
      >
        <form.Field name="title">
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
                  标题
                </FieldLabel>
                <Input
                  {...fieldProps}
                  placeholder="请输入标题"
                  autoComplete="off"
                  className={"md:text-md"}
                />
                {isInvalid && (
                  <p className="text-destructive text-sm">标题不合法</p>
                )}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="tags">
          {(field) => {
            const isInvalid = !field.state.meta.isValid;

            const tagOptions =
              tagsData?.data.map((tag) => ({
                label: tag.name,
                value: tag.id,
                disabled: false,
              })) ?? [];

            return (
              <Field aria-invalid={isInvalid} data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className={"text-lg"}>
                  标签
                </FieldLabel>

                <MultiSelect
                  id={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  aria-invalid={isInvalid}
                  options={tagOptions}
                />
                {isInvalid && (
                  <p className="text-destructive text-sm">标签不合法</p>
                )}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="content">
          {(field) => {
            const isInvalid = !field.state.meta.isValid;

            const fieldProps = {
              id: field.name,
              value: field.state.value,
              onBlur: field.handleBlur,
              onChange: (value: JSONContent) => field.handleChange(value),
              "aria-invalid": isInvalid,
            } as const;

            return (
              <Field aria-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className={"text-lg"}>
                  内容
                </FieldLabel>
                <div
                  className={"border px-2 rounded-md cursor-text"}
                  onClick={() => editorIns.current?.focus()}
                >
                  <Editor {...fieldProps} editable={true} ref={editorIns} />
                </div>
                {isInvalid && (
                  <p className="text-destructive text-sm">内容不合法</p>
                )}
              </Field>
            );
          }}
        </form.Field>
        <div className={"flex items-center justify-center"}>
          <Button type="submit" className={"w-36 cursor-pointer"}>
            {isEdit ? "保存" : "提交"}
          </Button>
        </div>
      </form>
    </div>
  );
}
