
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/cn";
import { useCommonEmail } from "@/components/Showcase/useCommonEmail";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/Showcase/ui/Button";
import { MDiv } from "@/components/motion/motion";

export function EmailLoginButton() {
  const { setEmail, email } = useCommonEmail();
  const [buttonPressed, setButtonPressed] = useState(false);

  const nav = useNavigate()

  // Create a dynamic schema based on password policy
  const createFormSchema = () => {
    return z.object({
      email: z.email({ message: "Please enter a valid email address" }),
    })
  }

  const formSchema = createFormSchema()
  type FormValues = z.infer<typeof formSchema>
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  })

  return (
    <div className=" p-0 relative flex align-center justify-start w-full">

      <form
        className="w-full"
        onSubmit={handleSubmit(() => {
          nav({
            to: "/showcase/auth/login"
          })
        })}
        noValidate
        onBlur={() => {
          setButtonPressed(false)
        }}
      >
        <label className={cn(
          "group input w-full transition-border duration-200",
          errors.email && "input-error",
          // !buttonPressed && "border-transparent"
        )}>
          <MailIcon size={16} className="shrink-0 opacity-0" />
          <input
            type="email"
            placeholder="Email"
            className="grow peer "
            tabIndex={-1}
            {...register("email", {
              value: email,
              onChange: (e) => {
                setEmail(e.target.value)
                setButtonPressed(true)
              }
            })}
          />
          <Button
            className="text-xs group-focus-within:text-base-content/50 text-base-content/30 hover:text-base-content transition-colors duration-200"
            onPointerDown={() => {
              setTimeout(() => {
                setButtonPressed(true)
              });
            }}
          >
            submit
          </Button>
        </label>
        <AnimatePresence>
          {errors.email && (
            <MDiv
              className="label block overflow-hidden"
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <span className="label-text-alt text-error text-xs">
                {errors.email.message}
              </span>
            </MDiv>
          )}
        </AnimatePresence>
      </form>

      <Button
        className={cn(
          'btn btn-accent p-3 border-transparent transition-all duration-300 z-2 absolute',
          !buttonPressed
            ? 'w-[100%]'
            : "w-unset text-base-content bg-transparent pointer-events-none cursor-default",

        )}

        type="button"
        onClick={() => {
          setFocus("email")
          setButtonPressed(true)
        }}
      >
        <div className="w-full flex items-center justify-center relative">
          <MailIcon className="w-4 h-4 mr-2" />
          <span className={cn(
            "transition-opacity duration-300",
            buttonPressed && "opacity-0"
          )}>
            <span>
              Continue with email
            </span>
          </span>
        </div>
      </Button>

    </div>
  )
}