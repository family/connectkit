import { MDiv } from "@/components/motion/motion"
import { DialogLayout } from "@/components/Showcase/DialogLayout"
import { Button } from "@/components/Showcase/ui/Button"
import { Header } from "@/components/Showcase/ui/Header"
import { InputMessage } from "@/components/Showcase/ui/InputMessage"
import { useCommonEmail } from "@/components/Showcase/useCommonEmail"
import { cn } from "@/lib/cn"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEmailAuth } from "@openfort/openfort-kit"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MailIcon, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const Route = createFileRoute(
  '/_showcase/showcase/auth/forgot-password',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const nav = useNavigate()
  const { email, setEmail } = useCommonEmail();

  const {
    requestResetPassword,
    error,
    isLoading,
    isSuccess,
  } = useEmailAuth({
    emailVerificationRedirectTo: "/showcase/auth/password-callback",
  })

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
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  })

  const onSubmit = async (data: FormValues) => {
    requestResetPassword({
      email: data.email,
    })
  }

  return (
    <DialogLayout>
      <Header onBack={() => nav({ to: "/" })} title="Forgot password" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-3"
        noValidate
      >
        <div className="text-center text-sm text-base-content/50">
          Enter your email address and we will send you a link to reset your password
        </div>

        <div>
          <label className={cn(
            "input w-full",
            errors.email && "input-error"
          )}>
            <MailIcon size={16} className="" />
            <input
              type="email"
              placeholder="Email"
              className="grow peer"
              {...register("email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              disabled={isLoading}
            />
            <Button
              className={cn(
                "text-xs group-focus-within:text-base-content/50 text-base-content/20 hover:text-base-content transition-all duration-200",
                isLoading && "pointer-events-none translate-x-3 -translate-y-3 scale-0 duration-1000"
              )}
            >
              <MDiv
                initial={{ opacity: 1, scale: 1 }}
                whileHover={{
                  x: [0, -2, 2, -2, 2, 0], // Quick side-to-side movement
                  y: [0, 2, -2, 2, -2, 0], // Quick side-to-side movement
                  scale: [1, 1.2, 1, 1.2, 1],
                  transition: {
                    duration: 1.3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Send size={16} />
              </MDiv>
            </Button>
          </label>
          <InputMessage
            message={errors.email?.message || ""}
            show={!!errors.email}
            variant="error"
          />
          <InputMessage
            message={error?.message || ""}
            show={!!error}
            variant="error"
          />
          <InputMessage
            message={"Email sent successfully"}
            show={!!isSuccess}
            variant="success"
          />
        </div>
      </form>

    </DialogLayout >
  )
}