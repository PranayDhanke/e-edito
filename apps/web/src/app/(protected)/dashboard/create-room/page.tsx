"use client";

import { useCreateRoom } from "@/api/hooks/room/createRoom";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomFormSchema, CreateRoomFormInput } from "@repo/validation";
import {
  ArrowRight,
  Globe,
  Headphones,
  Lock,
  MonitorPlay,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const roomSettingCards = [
  {
    name: "is_public" as const,
    title: "Public access",
    description: "Let anyone with the room link join.",
    icon: Globe,
  },
  {
    name: "is_audio_enabled" as const,
    title: "Audio enabled",
    description: "Allow participants to speak during the session.",
    icon: Headphones,
  },
  {
    name: "is_video_enabled" as const,
    title: "Video enabled",
    description: "Allow participants to share video when needed.",
    icon: Video,
  },
];

export default function CreateRoomPage() {
  const router = useRouter();
  const { mutateAsync } = useCreateRoom();

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

  const onSubmit = async (data: CreateRoomFormInput) => {
    try {
      const res = await mutateAsync(data);

      if (!res?.data?.room_code) {
        throw new Error("Room created, but no room code was returned");
      }

      toast.success("Room created");
      router.push(`/dashboard/workspace/${res.data.room_code}?role=owner`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create room",
      );
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] p-6 shadow-[0_32px_120px_-48px_rgba(15,23,42,0.45)] md:p-8">
          <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(90deg,rgba(249,115,22,0.08),rgba(14,165,233,0.06),rgba(16,185,129,0.06))]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              New workspace
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold text-foreground">
              Shape the room before anyone joins.
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
              Pick a language, set the seating, and decide how open the room
              should be. The goal is to make setup feel quick while still giving
              you control.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[1.75rem] border border-border/60 bg-card/75 p-5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(14,165,233,0.12))]">
                    <MonitorPlay className="size-5 text-foreground" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold">
                      Good defaults
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      JavaScript, audio on, and space for ten participants.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-border/60 bg-card/75 p-5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(59,130,246,0.12))]">
                    <Lock className="size-5 text-foreground" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold">
                      Invitation ready
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Owners can share links as soon as the room is created.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-[2.5rem] border border-border/60 bg-card/85 p-6 shadow-[0_24px_90px_-48px_rgba(15,23,42,0.45)] backdrop-blur md:p-8"
        >
          <div>
            <h2 className="font-heading text-3xl font-semibold text-foreground">
              Create a room
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Set the basics first, then add starter code if your session needs
              a running head start.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Room name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Frontend interview rehearsal"
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>
                        Give the room a clear name participants will recognize.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="maxParticipants"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Seats</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id={field.name}
                      min={1}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>How many people can join.</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Walk through a mock interview problem and review the final solution together."
                    rows={4}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Share the purpose of the room so people know what to expect.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
              <Controller
                name="language"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Default language</FieldLabel>
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
                    <FieldDescription>
                      Sets the room&apos;s default editing language.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Starter code</FieldLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      rows={10}
                      placeholder="// Add starter code, prompts, or notes for participants..."
                      className="font-mono text-sm"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      Optional. Use this to preload a challenge or template.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Room settings
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                These can shape how social or controlled the session feels.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {roomSettingCards.map(({ name, title, description, icon: Icon }) => (
                  <Controller
                    key={name}
                    name={name}
                    control={form.control}
                    render={({ field }) => (
                      <Field className="rounded-[1.75rem] border border-border/60 bg-background/70 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(14,165,233,0.12))]">
                              <Icon className="size-4 text-foreground" />
                            </div>
                            <FieldLabel className="mt-4 block text-sm font-semibold">
                              {title}
                            </FieldLabel>
                            <FieldDescription className="mt-2 text-xs leading-6">
                              {description}
                            </FieldDescription>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </Field>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating..." : "Create room"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
