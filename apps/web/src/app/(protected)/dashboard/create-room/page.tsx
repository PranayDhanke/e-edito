"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createRoomFormSchema, CreateRoomFormInput } from "@repo/validation";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateRoomForm() {
  const form = useForm<CreateRoomFormInput>({
    resolver: zodResolver(createRoomFormSchema),
    defaultValues: {
      name: "",
      description: "",
      language: "javascript",
      code: "",
      is_public: true,
      is_audio_enabled: true,
      is_video_enabled: false,
      maxParticipants: 10,
    },
  });

  const onSubmit = (data: CreateRoomFormInput) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-2xl mx-auto p-6 bg-card border rounded-xl shadow-sm space-y-8"
    >
      {/* Header section adds context */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Create a Room</h2>
        <p className="text-sm text-muted-foreground">
          Set up your coding environment and participant permissions.
        </p>
      </div>

      <div className="space-y-6">
        {/* Row 1: Name and Max Participants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Room Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="JavaScript Interview Room"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            name="maxParticipants"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Max Participants</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  id={field.name}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Describe the purpose of this room..."
                rows={3}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <hr className="border-border" />

        {/* Coding Workspace Section */}
        <div className="space-y-4">
          <Controller
            name="language"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-full md:w-1/3">
                <FieldLabel>Default Language</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Starter Code</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={8}
                  placeholder="// Write or paste starter code here..."
                  className="font-mono text-sm bg-muted/30"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <hr className="border-border" />

        {/* Room Settings (Toggles Grid) */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Room Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Public Room */}
            <Controller
              name="is_public"
              control={form.control}
              render={({ field }) => (
                <Field className="flex items-start justify-between rounded-xl border p-4 bg-muted/10">
                  <div className="space-y-0.5 pr-2">
                    <FieldLabel className="text-sm font-medium">Public</FieldLabel>
                    <FieldDescription className="text-xs leading-normal">
                      Anyone with the link can join.
                    </FieldDescription>
                  </div>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </Field>
              )}
            />

            {/* Audio Enabled */}
            <Controller
              name="is_audio_enabled"
              control={form.control}
              render={({ field }) => (
                <Field className="flex items-start justify-between rounded-xl border p-4 bg-muted/10">
                  <div className="space-y-0.5 pr-2">
                    <FieldLabel className="text-sm font-medium">Audio</FieldLabel>
                    <FieldDescription className="text-xs leading-normal">
                      Allow participants to speak.
                    </FieldDescription>
                  </div>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </Field>
              )}
            />

            {/* Video Enabled */}
            <Controller
              name="is_video_enabled"
              control={form.control}
              render={({ field }) => (
                <Field className="flex items-start justify-between rounded-xl border p-4 bg-muted/10">
                  <div className="space-y-0.5 pr-2">
                    <FieldLabel className="text-sm font-medium">Video</FieldLabel>
                    <FieldDescription className="text-xs leading-normal">
                      Allow participants to share video.
                    </FieldDescription>
                  </div>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </Field>
              )}
            />
          </div>
        </div>
      </div>

      {/* Form Action */}
      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" className="w-full md:w-auto px-8" disabled={form.formState.isSubmitting}>
          Create Room
        </Button>
      </div>
    </form>
  );
}