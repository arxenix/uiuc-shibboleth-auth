import About from "@/components/About";

export default function Footer() {
  return (
    <footer className="p-8 self-center text-center">
      <ul className="flex flex-row flex-wrap gap-8">
        <li><a href="#">Contact</a></li>
        <li><a href="#">Privacy</a></li>
        <li><a href="#">FAQ</a></li>
        <li><a href="https://github.com/sigpwny/shibboleth-link" target="_blank" rel="noopener">GitHub</a></li>
      </ul>
    </footer>
  );
}