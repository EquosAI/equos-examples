import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronDown, Github, Slack } from "lucide-react";

export function Header() {
  return (
    <header className="w-full sticky top-0 p-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.jpeg"
          height={40}
          width={40}
          alt="Equos Logo"
          className="rounded-lg"
        />
        <Link className="font-bold text-xl !font-funnel" href="/">
          Equos.ai
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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Examples</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/avatar-sessions">Run Sessions</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/create-avatars">Create Avatars</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/create-agents">Create Agents</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/custom-livekit">
                        Custom Livekit Sessions
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Developers</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <Link href="https://github.com/EquosAI" target="_blank">
                      <Github />
                      GitHub
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="https://docs.equos.ai" target="_blank">
                      Documentation
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="https://api.equos.ai/docs/v1" target="_blank">
                      API Reference
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="https://www.npmjs.com/package/@equos/node-sdk"
                      target="_blank"
                    >
                      Node.js SDK
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="https://docs.google.com/forms/d/e/1FAIpQLSdoK7LvORdQf7KOQKvhhlESStJcKc3bDB9HPsEet6LuOmVUfQ/viewform"
                      target="_blank"
                    >
                      Support
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Ecosystem</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="https://www.equos.ai" target="_blank">
                  Equos.ai
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="https://studio.equos.ai" target="_blank">
                  Studio
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="https://join.slack.com/t/equosaicommunity/shared_invite/zt-3d8oy19au-jZpsJB0i~gdL0jbDswdzzQ"
                  target="_blank"
                >
                  <Slack />
                  Slack Community
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild>
          <Link href="https://docs.equos.ai" target="_blank">
            Get Started
          </Link>
        </Button>
      </div>
    </header>
  );
}
