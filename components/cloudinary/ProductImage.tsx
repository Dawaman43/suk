"use client";
import { CldImage } from "next-cloudinary";

export default function Page() {
  return (
    <CldImage
      src="products/product1"
      alt="Product image"
      width={500}
      height={500}
      crop="fill"
      gravity="auto"
      quality="auto"
    />
  );
}
