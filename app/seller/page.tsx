"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import { Upload, X, Sparkles, CheckCircle } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getSession } from "@/lib/auth-client";

const ProductSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.coerce.number().min(0),
  description: z.string().max(1000).optional(),
  category: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  images: z.array(z.string().url()).min(1),
  // Mongo ObjectId string (24 hex chars)
  sellerId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, { message: "Invalid seller id" }),
  status: z.enum(["available", "sold", "reserved"]).optional(),
});

type ProductProps = z.infer<typeof ProductSchema>;

interface ImageUploadState {
  file: File;
  src: string;
  url?: string;
  progress: number;
}

export default function SellerPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);

  const form = useForm<ProductProps>({
    resolver: zodResolver(ProductSchema) as Resolver<ProductProps>,
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category: "",
      location: "",
      images: [],
      sellerId: "",
      status: "available",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      const u = session.data?.user || null;
      const newUser = u && u.id ? { id: u.id } : null;
      setUser(newUser);
      if (newUser) {
        form.setValue("sellerId", newUser.id);
      }
    };
    void fetchUser();
  }, [form]);

  const [uploads, setUploads] = useState<ImageUploadState[]>([]);
  const [activeCropIndex, setActiveCropIndex] = useState<number | null>(null);
  const [cropStates, setCropStates] = useState<
    Record<
      number,
      { crop: { x: number; y: number }; zoom: number; croppedArea?: Area }
    >
  >({});

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95)
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUploads: ImageUploadState[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target!.result as string;
        newUploads.push({ file, src, progress: 0 });

        if (newUploads.length === files.length) {
          setUploads((prev) => {
            const startIdx = prev.length;
            const updated = [...prev, ...newUploads];
            if (activeCropIndex === null && newUploads.length > 0) {
              const newIdx = startIdx;
              setActiveCropIndex(newIdx);
              setCropStates((s) => ({
                ...s,
                [newIdx]: { crop: { x: 0, y: 0 }, zoom: 1 },
              }));
            }
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = useCallback((idx: number) => {
    return (_: Area, croppedAreaPixels: Area) => {
      setCropStates((prev) => ({
        ...prev,
        [idx]: { ...prev[idx], croppedArea: croppedAreaPixels },
      }));
    };
  }, []);

  const finishCrop = async () => {
    if (activeCropIndex === null) return;
    const idx = activeCropIndex;
    const up = uploads[idx];
    const cropState = cropStates[idx];
    if (!up || !cropState?.croppedArea) return;

    toast.loading("Cropping & uploading...", { id: `crop-${idx}` });

    try {
      const croppedBlob = await getCroppedImg(up.src, cropState.croppedArea);
      const croppedFile = new File([croppedBlob], up.file.name, {
        type: "image/jpeg",
      });

      setUploads((prev) =>
        prev.map((u, i) => (i === idx ? { ...u, file: croppedFile } : u))
      );

      setActiveCropIndex(null);
      setCropStates((prev) => {
        const newStates = { ...prev };
        delete newStates[idx];
        return newStates;
      });

      toast.dismiss(`crop-${idx}`);
      uploadToCloudinary(idx, croppedFile);
    } catch {
      toast.error("Failed to crop image");
    }
  };

  const uploadToCloudinary = async (idx: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploads((prev) =>
          prev.map((u, i) => (i === idx ? { ...u, progress: percent } : u))
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        const url = data.secure_url;

        setUploads((prev) =>
          prev.map((u, i) => (i === idx ? { ...u, url, progress: 100 } : u))
        );

        const current = form.getValues("images");
        form.setValue("images", [...current, url]);

        toast.success("Image uploaded!", { duration: 2000 });
      } else {
        toast.error("Upload failed");
      }
    };

    xhr.onerror = () => toast.error("Network error");

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`
    );
    xhr.send(formData);
  };

  const removeImage = (idx: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== idx));
    const urls = form.getValues("images").filter((_, i) => i !== idx);
    form.setValue("images", urls);

    if (activeCropIndex === idx) {
      setActiveCropIndex(null);
    } else if (activeCropIndex !== null && activeCropIndex > idx) {
      setActiveCropIndex(activeCropIndex - 1);
    }

    setCropStates((prev) => {
      const newStates = { ...prev };
      delete newStates[idx];
      const remapped: typeof newStates = {};
      Object.keys(newStates).forEach((key) => {
        const k = Number(key);
        if (k > idx) {
          remapped[k - 1] = newStates[k];
        } else {
          remapped[k] = newStates[k];
        }
      });
      return remapped;
    });
  };

  const openCropper = (idx: number) => {
    setActiveCropIndex(idx);
    setCropStates((s) => ({
      ...s,
      [idx]: s[idx] ?? { crop: { x: 0, y: 0 }, zoom: 1 },
    }));
  };

  const onSubmit = async (data: ProductProps) => {
    if (!user) {
      toast.error("Please sign in to post a product");
      return;
    }
    const pending = uploads.some((u) => u.progress > 0 && u.progress < 100);
    if (pending) {
      toast.error("Please wait for all images to finish uploading");
      return;
    }

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      toast.success("Product posted successfully!");
      form.reset();
      setUploads([]);
      setActiveCropIndex(null);
      setCropStates({});
    } catch {
      toast.error("Failed to post product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/50 to-muted/50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-xl border-border">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              Sell Your Product
            </CardTitle>
            <CardDescription>List your item with ease</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">
                            Product Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., iPhone 13 Pro"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">
                            Price ($)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="49.99"
                              className="h-12"
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Description (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe condition, features, etc."
                            className="min-h-28 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">
                            Category (Optional)
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="electronics">
                                Electronics
                              </SelectItem>
                              <SelectItem value="furniture">
                                Furniture
                              </SelectItem>
                              <SelectItem value="clothing">Clothing</SelectItem>
                              <SelectItem value="books">Books</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">
                            Location (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., New York, NY"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Product Images
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-5">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="group"
                            >
                              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors bg-muted/50">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleFileSelect}
                                  className="hidden"
                                  id="image-upload"
                                />
                                <label
                                  htmlFor="image-upload"
                                  className="cursor-pointer block"
                                >
                                  <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 1.5,
                                    }}
                                  >
                                    <Upload className="mx-auto h-12 w-12 text-primary group-hover:text-primary/80" />
                                  </motion.div>
                                  <p className="mt-2 text-base font-medium text-foreground">
                                    Click or drop images here
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    PNG, JPG up to 10 MB
                                  </p>
                                </label>
                              </div>
                            </motion.div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                              {uploads.map((up, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="relative group"
                                >
                                  {up.url ? (
                                    <div className="relative w-full h-32 rounded-lg overflow-hidden shadow-md ring-2 ring-green-500 dark:ring-green-400 ring-opacity-50">
                                      <img
                                        src={up.url}
                                        alt={`uploaded ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                      </div>
                                    </div>
                                  ) : up.progress > 0 ? (
                                    <div className="relative w-full h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity,
                                          ease: "linear",
                                        }}
                                        className="absolute inset-0 opacity-10"
                                      >
                                        <div className="w-full h-full bg-gradient-to-r from-primary to-primary/70 blur-xl" />
                                      </motion.div>
                                      <div className="relative z-10 text-center">
                                        <motion.div
                                          animate={{ scale: [1, 1.3, 1] }}
                                          transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                          }}
                                        >
                                          <Sparkles className="h-7 w-7 text-primary mx-auto mb-1" />
                                        </motion.div>
                                        <p className="text-xl font-bold text-primary">
                                          {up.progress}%
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => openCropper(idx)}
                                      className="w-full h-32 rounded-lg overflow-hidden shadow-md ring-2 ring-border hover:ring-primary transition-all"
                                    >
                                      <img
                                        src={up.src}
                                        alt={`preview ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </button>
                                  )}

                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                                    aria-label="Remove image"
                                  >
                                    <X className="h-4 w-4" />
                                  </motion.button>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex justify-end"
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 px-10 text-lg font-semibold"
                    disabled={!user || form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                        Posting...
                      </span>
                    ) : (
                      "Post Product"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            {activeCropIndex !== null && activeCropIndex < uploads.length && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-background rounded-xl max-w-2xl w-full p-5 relative shadow-2xl border border-border"
                >
                  <button
                    type="button"
                    onClick={() => setActiveCropIndex(null)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-destructive z-10 bg-background/80 backdrop-blur rounded-full p-1.5 shadow"
                    aria-label="Close crop editor"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-muted">
                    <Cropper
                      image={uploads[activeCropIndex].src}
                      crop={cropStates[activeCropIndex]?.crop ?? { x: 0, y: 0 }}
                      zoom={cropStates[activeCropIndex]?.zoom ?? 1}
                      aspect={4 / 3}
                      onCropChange={(crop) =>
                        setCropStates((s) => ({
                          ...s,
                          [activeCropIndex]: { ...s[activeCropIndex], crop },
                        }))
                      }
                      onZoomChange={(zoom) =>
                        setCropStates((s) => ({
                          ...s,
                          [activeCropIndex]: { ...s[activeCropIndex], zoom },
                        }))
                      }
                      onCropComplete={onCropComplete(activeCropIndex)}
                      restrictPosition={false}
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-5">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setActiveCropIndex(null);
                        removeImage(activeCropIndex);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="lg"
                      onClick={finishCrop}
                      disabled={!cropStates[activeCropIndex]?.croppedArea}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Apply Crop & Upload
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
