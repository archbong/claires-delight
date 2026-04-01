import { SocialLinkProps } from "@/typings";
import Image from "next/image";

const SocialLink: React.FC<SocialLinkProps> = ({
    href,
    image,
    alt,
  }) => (
    <a
      href={href}
      aria-label="social-link"
      className="mr-6 text-white duration-300 hover:text-primary"
    >
      <Image src={image} alt={alt} width={25} height={25} />
    </a>
  );

export default SocialLink;