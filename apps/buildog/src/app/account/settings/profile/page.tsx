"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { toast } from "@ui/components/use-toast";
import { Service } from "@/web-sdk";
import { useAuth } from "@/components/auth-provider";

const nameUpdateFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

const emailUpdateFormSchema = z.object({
  email: z.string().email().optional(),
});

type NameUpdateFormValues = z.infer<typeof nameUpdateFormSchema>;
type EmailUpdateFormValues = z.infer<typeof emailUpdateFormSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userCredentials, setUserCredentials] = useState<{
    first_name: string;
    last_name: string;
    email: string;
  }>({
    first_name: "",
    last_name: "",
    email: "",
  });

  const fetchUser = useCallback(async () => {
    const response = await Service.makeAuthenticatedRequest("user");
    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
      });
    } else {
      setUserCredentials(response);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) setLoading(true);
    fetchUser();
  }, [user, fetchUser]);

  const nameForm = useForm<NameUpdateFormValues>({
    resolver: zodResolver(nameUpdateFormSchema),
    mode: "onChange",
  });

  const emailForm = useForm<EmailUpdateFormValues>({
    resolver: zodResolver(emailUpdateFormSchema),
    mode: "onChange",
  });

  async function onNameFormSubmit(data: NameUpdateFormValues) {
    const response = await Service.makeAuthenticatedRequest(
      "users/update",
      "PUT",
      nameForm.getValues()
    );
    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
      });
    }
    setUserCredentials((prev) => ({ ...prev, ...data }));
    nameForm.setValue("first_name", "");
    nameForm.setValue("last_name", "");
  }

  function onEmailFormSubmit(data: EmailUpdateFormValues) {
    toast({
      title: "You submitted the following email value:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Fragment>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Form {...nameForm}>
            <form onSubmit={nameForm.handleSubmit(onNameFormSubmit)} className="space-y-8">
              <div className="overflow-y-auto w-full border rounded-lg">
                <div className="w-full p-5 space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight">Profile Information</h2>
                  <div className="w-full flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <FormField
                    control={nameForm.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            className="w-96"
                            type="text"
                            placeholder={userCredentials.first_name}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={nameForm.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            className="w-96"
                            type="text"
                            placeholder={userCredentials.last_name}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <hr />
                <div className="w-full p-4 space-y-4 flex justify-end">
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </form>
          </Form>

          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailFormSubmit)} className="space-y-8 mt-8">
              <div className="overflow-y-auto w-full border rounded-lg">
                <div className="w-full p-5 space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight">Account Information</h2>
                  <div className="w-full flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            className="w-96"
                            type="email"
                            placeholder={userCredentials.email}
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <hr />
                <div className="w-full p-4 space-y-4 flex justify-end">
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </form>
          </Form>
        </>
      )}
    </Fragment>
  );
}
