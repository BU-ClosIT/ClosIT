import Link from "next/link";

const FullNav: React.FC = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/closet">Manage Closet</Link>{" "}
        </li>
        <li>
          <Link href="/ai-chat">AI Chat</Link>
        </li>
        <li>
          <Link href="/test-display">Test Display</Link>
        </li>
      </ul>
    </div>
  );
};
export default FullNav;
