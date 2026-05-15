import { Collapsible } from "radix-ui";
import { Link, useLocation } from "react-router-dom";
import { CaretDownIcon } from "@phosphor-icons/react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export type NavSubItem = {
  title: string;
  url: string;
};

export type NavItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
  items?: NavSubItem[];
};

export function NavMain({
  label,
  items,
}: {
  label?: string;
  items: NavItem[];
}) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0 ? (
            <SidebarMenuItem key={item.title}>
              <Collapsible.Root
                defaultOpen={item.items.some((sub) =>
                  pathname.startsWith(sub.url),
                )}
                className="group/collapsible w-full"
              >
                <Collapsible.Trigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    data-active={
                      pathname === item.url ||
                      item.items?.some((sub) => pathname.startsWith(sub.url))
                    }
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    <CaretDownIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          data-active={pathname === subItem.url}
                        >
                          <Link to={subItem.url}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </Collapsible.Content>
              </Collapsible.Root>
            </SidebarMenuItem>
          ) : (
            // ── Simple flat link ─────────────────────────────────────────
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                data-active={pathname === item.url}
              >
                <Link to={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
