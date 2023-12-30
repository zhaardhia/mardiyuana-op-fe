import { Icon } from "@iconify/react";
import React, { useState } from "react";

type ImageUploaderType = {
  setImage: any
  imageURL: any
}
const ImageUploader = ({ setImage, imageURL }: ImageUploaderType) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>()
  
  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="relative flex flex-col justify-between items-center w-full bg-slate-50  border-2 border-slate-200 rounded-xl p-8">
      <input
        id="image"
        name="image"
        type="file"
        className="absolute w-full h-full top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
        onChange={(e) => {
          onImageUpload(e)
        }}
      />
      {/* EDIT IMAGE URL DISINI JIKA SUDAH ADA API */}
      {imageURL ? (
        <>
          <img src={imagePreview} className="w-full object-fill flex justify-center items-center" alt={imageURL} />
          {/* Button for remove image url */}
          <div
            className="cursor-pointer"
            onClick={(e) =>
              setImage()
            }
          >
            <Icon icon="mdi:cancel-bold" className="border border-slate-200 bg-white rounded-full text-[#DE5959] absolute -top-4 -right-4" />
          </div>
        </>
      ) : (
        <>
          <Icon icon="bx:image-add"  className="text-[#4B8F98] text-2xl" />
          <span className="text-gray-700 text-center m-0">Click or drag & drop gambar produk</span>
        </>
      )}
    </div>
  );
};

export default ImageUploader;
