"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-users";

const ClientPage = () => {
  const user = useCurrentUser();

  return <UserInfo label="Client component" user={user} />;
};

export default ClientPage;
