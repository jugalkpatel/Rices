import type { NextPage } from "next";
import { useState } from "react";

import { AuthMode } from "@/types/";
import { Login, Register } from "@/components/all";

const Access: NextPage = () => {
  const [page, setPage] = useState<AuthMode>("LOGIN");

  const toggleAuthMode = (): void => {
    setPage((prevState: AuthMode) => {
      return prevState === "LOGIN" ? "REGISTER" : "LOGIN";
    });
  };

  if (page === "REGISTER") {
    return <Register switchPage={toggleAuthMode} />;
  }

  return <Login switchPage={toggleAuthMode} />;
};

export default Access;
