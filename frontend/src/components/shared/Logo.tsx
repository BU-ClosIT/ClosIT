import Link from "next/link";

export default function Logo() {
  return (
    <div className="text-2xl font-bold hover:scale-115">
      <Link href="/dashboard">ClosIT</Link>
    </div>
  );
}
