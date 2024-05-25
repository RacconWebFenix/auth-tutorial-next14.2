"use client";

import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { BeatLoader } from "react-spinners";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (successMessage || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccessMessage(data.success);
        setError(data.error);
      })
      .catch(() => setError("Something went wrong!"));
  }, [error, successMessage, token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirm your  verification"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center justify-center w-full">
        {!successMessage && !error && <BeatLoader />}
        <FormSuccess messege={successMessage} />
        {!successMessage && <FormError messege={error} />}
      </div>
    </CardWrapper>
  );
};
