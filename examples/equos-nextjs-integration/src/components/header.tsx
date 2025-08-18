import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="w-full sticky top-0 p-6 flex justify-between items-center">
      <div className="flex items-center">
        <Image
          src="/logo_star_blue.svg"
          height={40}
          width={40}
          alt="Equos Logo"
        />
        <Link className="font-bold text-xl" href="/">
          Equos <sub className="text-xs text-[#ffae00]">NextJs</sub>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              Examples <ChevronDown />{" "}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>Examples</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/avatar-and-agent">
                  Avatar + Agent Conference (Livekit)
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Equos.ai</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="https://www.equos.ai" target="_blank">
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="https://studio.equos.ai" target="_blank">
                  Studio
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="https://github.com/EquosAI" target="_blank">
                GitHub
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="https://api.equos.ai/docs/v1" target="_blank">
                GitHub
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild>
          <Link href="https://studio.equos.ai" target="_blank">
            Get Started
          </Link>
        </Button>
      </div>
    </header>
  );
}
