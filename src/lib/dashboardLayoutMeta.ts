export type DashboardPageMeta = {
  badge: string;
  title: string;
  subtitle: string;
};

export function getAdminPageMeta(pathname: string): DashboardPageMeta {
  if (pathname === "/admin" || pathname === "/admin/") {
    return {
      badge: "Administrator",
      title: "Admin dashboard",
      subtitle:
        "Overview of users, projects, submissions, and marketplace activity across Jointlly.",
    };
  }
  if (pathname.startsWith("/admin/users")) {
    if (pathname !== "/admin/users" && !pathname.endsWith("/users/")) {
      return {
        badge: "User 360",
        title: "User profile",
        subtitle: "Full account view — tickets, payments, submissions, and activity.",
      };
    }
    return { badge: "Manage", title: "Users", subtitle: "All platform accounts and roles." };
  }
  if (pathname.startsWith("/admin/landowners")) {
    if (pathname !== "/admin/landowners" && pathname.split("/").length > 3) {
      return {
        badge: "Detail",
        title: "Landowner profile",
        subtitle: "Properties, projects, and contact information.",
      };
    }
    return { badge: "Manage", title: "Landowners", subtitle: "Landowner profiles and property activity." };
  }
  if (pathname.startsWith("/admin/professionals")) {
    if (pathname !== "/admin/professionals" && pathname.split("/").length > 3) {
      return {
        badge: "Detail",
        title: "Professional profile",
        subtitle: "Capabilities, approval status, portfolio, and pricing.",
      };
    }
    return { badge: "Manage", title: "Professionals", subtitle: "Builder and professional profiles." };
  }
  if (pathname.startsWith("/admin/form-submissions")) {
    return { badge: "Manage", title: "Form submissions", subtitle: "Review submitted onboarding forms." };
  }
  if (pathname.startsWith("/admin/connections")) {
    return { badge: "Manage", title: "Connections", subtitle: "Marketplace selection and match records." };
  }
  if (pathname.startsWith("/admin/support-tickets")) {
    return { badge: "Support", title: "Support tickets", subtitle: "User support requests and resolutions." };
  }
  if (pathname.startsWith("/admin/payments-cases")) {
    return { badge: "Billing", title: "Payments cases", subtitle: "Payment disputes and transaction cases." };
  }
  if (pathname.startsWith("/admin/settings")) {
    return { badge: "Account", title: "Settings", subtitle: "Update your admin credentials and preferences." };
  }
  return {
    badge: "Administrator",
    title: "Admin",
    subtitle: "Jointlly administration console.",
  };
}

export function getLandownerPageMeta(pathname: string): DashboardPageMeta {
  const path = pathname.split("?")[0];
  if (path === "/landowner/dashboard") {
    return {
      badge: "Property owner",
      title: "Dashboard",
      subtitle: "Manage your requests and projects. Create listings and track matches with professionals.",
    };
  }
  if (path.startsWith("/landowner/matches")) {
    return { badge: "Matches", title: "Your matches", subtitle: "Professionals matched to your projects." };
  }
  if (path.startsWith("/landowner/marketplace")) {
    return { badge: "Opportunities", title: "Opportunities", subtitle: "Discover builders and browse the marketplace." };
  }
  if (path.startsWith("/landowner/my-projects")) {
    return { badge: "Projects", title: "My projects", subtitle: "All your published and draft project listings." };
  }
  if (path.startsWith("/landowner/options")) {
    return { badge: "New listing", title: "Post a listing", subtitle: "Choose how you want to collaborate on your property." };
  }
  if (path.includes("/landowner/account/profile")) {
    return { badge: "Account", title: "Profile", subtitle: "Your landowner profile and contact details." };
  }
  if (path.includes("/landowner/account/properties")) {
    return { badge: "Account", title: "Properties", subtitle: "Properties linked to your account." };
  }
  if (path.includes("/landowner/account/payments")) {
    return { badge: "Account", title: "Your payments", subtitle: "Payment history and entry fees." };
  }
  if (path.startsWith("/landowner/account")) {
    return { badge: "Account", title: "Account", subtitle: "Manage your landowner account settings." };
  }
  if (path.includes("contract-construction")) {
    return { badge: "Project", title: "Contract construction", subtitle: "Find a professional team to build on your land." };
  }
  if (path.includes("joint-venture")) {
    return { badge: "Project", title: "Joint venture / JD", subtitle: "Explore joint development opportunities." };
  }
  if (path.includes("/landowner/interior")) {
    return { badge: "Project", title: "Interior architecture", subtitle: "Connect with interior design professionals." };
  }
  if (path.includes("reconstruction")) {
    return { badge: "Project", title: "Renovation / repaint", subtitle: "Repairs and improvements for your space." };
  }
  return {
    badge: "Property owner",
    title: "Landowner",
    subtitle: "Your Jointlly property owner workspace.",
  };
}

export function getBuilderPageMeta(pathname: string): DashboardPageMeta {
  const path = pathname.split("?")[0];
  if (path === "/builder/dashboard") {
    return {
      badge: "Construction company",
      title: "Dashboard",
      subtitle: "Manage profiles, track matches, and discover landowner opportunities.",
    };
  }
  if (path.startsWith("/builder/matches")) {
    return { badge: "Matches", title: "Your matches", subtitle: "Landowner requests matched to your profile." };
  }
  if (path.startsWith("/builder/marketplace")) {
    return { badge: "Opportunities", title: "Opportunities", subtitle: "Browse landowner listings and evaluate projects." };
  }
  if (path.startsWith("/builder/my-projects")) {
    return { badge: "Projects", title: "My projects", subtitle: "Selected landowner projects and your portfolio." };
  }
  if (path.startsWith("/builder/options")) {
    return { badge: "New listing", title: "Register profile", subtitle: "Choose your service type and complete your profile." };
  }
  if (path.includes("/builder/account/profile")) {
    return { badge: "Account", title: "Profile", subtitle: "Your company profile and credentials." };
  }
  if (path.includes("/builder/account/projects")) {
    return { badge: "Account", title: "Projects", subtitle: "Projects linked to your builder account." };
  }
  if (path.includes("/builder/account/portfolio")) {
    return { badge: "Account", title: "Portfolio", subtitle: "Showcase your completed work and capabilities." };
  }
  if (path.includes("/builder/account/payments")) {
    return { badge: "Account", title: "Your payments", subtitle: "Payment history and platform fees." };
  }
  if (path.startsWith("/builder/account")) {
    return { badge: "Account", title: "Account", subtitle: "Manage your builder account settings." };
  }
  if (path.includes("contract-construction")) {
    return { badge: "Profile", title: "Contract construction", subtitle: "Register or update your construction profile." };
  }
  if (path.includes("joint-venture")) {
    return { badge: "Profile", title: "JV / JD developer", subtitle: "Register or update your joint venture profile." };
  }
  if (path.includes("/builder/interior")) {
    return { badge: "Profile", title: "Interior architect", subtitle: "Register or update your interior design profile." };
  }
  if (path.includes("reconstruction")) {
    return { badge: "Profile", title: "Renovation / repaint", subtitle: "Register or update your renovation profile." };
  }
  return {
    badge: "Construction company",
    title: "Builder",
    subtitle: "Your Jointlly professional workspace.",
  };
}
