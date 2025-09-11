"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createAvatarAction } from "../actions/action";
import { toast } from "sonner";
import { EquosAvatar } from "@equos/node-sdk/dist/types/avatar.type";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Check, Copy, ImagesIcon, Loader2 } from "lucide-react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [creating, setCreating] = useState<boolean>(false);
  const [createdAvatar, setCreatedAvatar] = useState<EquosAvatar | null>(null);
  const [refImage, setRefImg] = useState<string | null>(null);

  const [copying, setCopying] = useState<Record<string, boolean>>({});

  const schema = z.object({
    name: z.string().min(3).max(64),
    identity: z.string().min(3).max(64).optional(),
    refImage: z.string().min(1),
  });
  type Schema = z.infer<typeof schema>;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      identity: "",
      refImage: "",
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    if (!creating) {
      const { name, refImage, identity } = data;

      setCreating(true);

      const resolvedIdentity =
        identity || name.replaceAll(" ", "-").toLowerCase();

      const res = await createAvatarAction({
        name,
        refImage: refImage,
        identity: resolvedIdentity,
      }).catch((e) => {
        if (
          e.message?.toLowerCase().includes("body exceeded") ||
          e.message?.toLowerCase().includes("body is too large")
        ) {
          toast.error("Image is too large...");
        } else {
          toast.error("An error occured while creating the avatar...");
        }

        return null;
      });

      if (res) {
        setCreatedAvatar(res);

        form.reset();
        setRefImg(null);
      }

      setCreating(false);
    }
  };

  const onDropFile = async (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      toast.error("File is too large.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      form.setValue("refImage", dataUrl);
      setRefImg(dataUrl);
    };

    reader.readAsDataURL(file);
  };

  const fileDropzone = useDropzone({
    onDrop: onDropFile,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 5, // 5 Mo
  });

  return (
    <div className="max-w-xl w-full mx-auto mt-16">
      <h1 className="text-4xl mb-8">Create Equos Avatar</h1>

      {createdAvatar && (
        <div className="w-full border rounded-lg p-4 flex items-center gap-2">
          <img
            src={createdAvatar.thumbnailUrl}
            alt={createdAvatar.name}
            className="size-24 rounded-lg"
          />

          <div className="flex flex-col flex-1">
            <span className="text-md font-bold">{createdAvatar.name}</span>
            <span className="text-xs text-muted-foreground">
              {createdAvatar.identity}
            </span>

            <div className="mt-4">
              <Button
                size="sm"
                onClick={() => {
                  setCopying({ ...copying, [createdAvatar.id]: true });
                  navigator.clipboard.writeText(createdAvatar.id);
                  setTimeout(
                    () => setCopying({ ...copying, [createdAvatar.id]: false }),
                    3000
                  );
                }}
              >
                <code className="max-w-[80px] overflow-hidden text-ellipsis">
                  {createdAvatar.id}
                </code>
                {copying[createdAvatar.id] ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-8 w-full"
        >
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="grid gap-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Avatar name..." />
                  </FormControl>
                  <FormDescription>
                    This is public & shown in the UI.
                  </FormDescription>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="identity"
              render={({ field }) => (
                <div className="grid gap-2">
                  <FormLabel>Identity</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Avatar identity" />
                  </FormControl>
                  <FormDescription>
                    This is internal and not shown in the UI.
                  </FormDescription>
                  <FormMessage />
                </div>
              )}
            />

            <Separator />
            <div
              {...fileDropzone.getRootProps()}
              className={`aspect-square w-full cursor-pointer rounded-md border border-dashed transition-colors hover:ring-primary`}
            >
              {!!refImage && (
                <img
                  src={refImage}
                  alt="new avatar"
                  className="size-full rounded-md object-cover"
                />
              )}

              {!refImage && (
                <div className="flex size-full flex-col items-center justify-center gap-4 text-center">
                  <ImagesIcon />
                  Drag an image or click to select. <br />
                  (5Mo max)
                </div>
              )}

              <input {...fileDropzone.getInputProps()} />
            </div>
            <span className="text-xs text-muted-foreground">
              This is the reference image used to create the avatar.
            </span>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button type="submit">
              {creating && <Loader2 className="animate-spin" />}
              Create Avatar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
