import Image, { ImageProps } from "next/image";
import { FC } from "react";

const AuthorImg: FC<Omit<ImageProps, "src" | "alt"> & { src?: string; alt?: string }> = ({ src, alt, ...props }) => {
  return <Image {...props} src={src ?? "/profile.jpg"} alt={alt ?? "Profile"} priority={true} />;
};

export default AuthorImg;
