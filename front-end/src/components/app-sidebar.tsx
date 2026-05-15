import * as React from "react";

import { NavMain } from "@/components/nav-main";
import type { NavItem } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  SquaresFourIcon,
  BriefcaseIcon,
  BuildingsIcon,
  UsersIcon,
  FileTextIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  ClipboardTextIcon,
  ShieldCheckIcon,
  CommandIcon,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { fetchCurrentUserThunk } from "@/app/auth/authSlice";

// ─── Role-based nav config ────────────────────────────────────────────────────

/** Sections rendered for the ADMIN role */
const adminNav: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/dashboard/admin",
        icon: <SquaresFourIcon />,
      },
    ],
  },
  {
    label: "Platform Management",
    items: [
      {
        title: "Job Listings",
        url: "/dashboard/admin/job-listings",
        icon: <BriefcaseIcon />,
        items: [
          { title: "All Listings", url: "/dashboard/admin/job-listings" },
        ],
      },
      {
        title: "Employers",
        url: "/dashboard/admin/employers",
        icon: <BuildingsIcon />,
      },
      {
        title: "Candidates",
        url: "/dashboard/admin/candidates",
        icon: <UsersIcon />,
      },
    ],
  },
];

/** Sections rendered for the EMPLOYER role */
const employerNav: { label?: string; items: NavItem[] }[] = [
  // {
  //   items: [
  //     {
  //       title: "Overview",
  //       url: "/dashboard",
  //       icon: <SquaresFourIcon />,
  //     },
  //   ],
  // },
  {
    label: "Manage",
    items: [
      {
        title: "Job Listings",
        url: "/dashboard/employer/job-listings",
        icon: <BriefcaseIcon />,
        items: [
          { title: "My Listings", url: "/dashboard/employer/job-listings" },
          {
            title: "Post New Job",
            url: "/dashboard/employer/job-listings/new",
          },
        ],
      },
      {
        title: "Candidates",
        url: "/dashboard/employer/candidates",
        icon: <UsersIcon />,
      },
      {
        title: "Applications",
        url: "/dashboard/employer/applications",
        icon: <ClipboardTextIcon />,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Company Profile",
        url: "/dashboard/employer/profile",
        icon: <BuildingsIcon />,
      },
    ],
  },
];

/** Sections rendered for the CANDIDATE role */
const candidateNav: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/dashboard/candidate",
        icon: <SquaresFourIcon />,
      },
    ],
  },
  {
    label: "Jobs",
    items: [
      {
        title: "Browse Jobs",
        url: "/dashboard/candidate/job-listings",
        icon: <MagnifyingGlassIcon />,
      },
      {
        title: "My Applications",
        url: "/dashboard/candidate/applications",
        icon: <FileTextIcon />,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "My Profile",
        url: "/dashboard/candidate/profile",
        icon: <UserCircleIcon />,
      },
    ],
  },
];

// ─── Role label badge ─────────────────────────────────────────────────────────

const roleBadgeStyles: Record<string, string> = {
  admin: "bg-destructive/10 text-destructive",
  employer: "bg-blue-500/10 text-blue-600",
  candidate: "bg-green-500/10 text-green-700",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        roleBadgeStyles[role] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {role}
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, [dispatch]);

  // Pick the nav sections based on user role
  const role = user?.role ?? "";
  const navSections =
    role === "admin"
      ? adminNav
      : role === "employer"
        ? employerNav
        : role === "candidate"
          ? candidateNav
          : [];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Job Board</span>
                {role && <RoleBadge role={role} />}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Nav sections ───────────────────────────────────────────── */}
      <SidebarContent>
        {navSections.length > 0 ? (
          navSections.map((section, index) => (
            <React.Fragment key={index}>
              {index > 0 && <SidebarSeparator />}
              <NavMain label={section.label} items={section.items} />
            </React.Fragment>
          ))
        ) : (
          /* No role assigned yet — show a minimal fallback */
          <NavMain
            label="Menu"
            items={[
              {
                title: "Overview",
                url: "/dashboard",
                icon: <SquaresFourIcon />,
              },
              {
                title: "Complete Profile",
                url: "/complete-profile",
                icon: <ShieldCheckIcon />,
              },
            ]}
          />
        )}
      </SidebarContent>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
