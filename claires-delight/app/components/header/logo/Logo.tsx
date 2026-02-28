import Image from "next/image";
import ClairesDelight from "@/public/image/Logo.svg";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src={ClairesDelight}
        alt="Claires Delight"
        width={50}
        height={50}
      />
    </Link>
  );
}
