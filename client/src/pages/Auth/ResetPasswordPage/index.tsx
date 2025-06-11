import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { PasswordInput, Loader } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toast";
import api from "@/config/api";
import errorHandler from "@/config/errorHandler";

function ResetPasswordPage() {
  const { loading } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const resetPasswordFormSchema = z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type resetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: resetPasswordFormData) {
    if (loading) return;
    try {
      const response = await api.post(`/user/reset-password/${token}`, {
        password: data.password,
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-b from-[#42bedd] to-white to-50%">
      <div className="flex flex-col bg-white/20 backdrop-blur-xs rounded-4xl border border-gray-300 drop-shadow-md max-w-2xl w-fit h-fit p-6 my-6">
        <div>
          <h1 className="text-center text-2xl font-semibold mb-4">
            Reset Password
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Enter your new password below.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <PasswordInput
              error={errors.password?.message}
              {...register("password")}
            />
            <PasswordInput
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <div className="flex items-center justify-center bg-gray-800 w-full rounded-2xl my-4 min-w-sm hover:bg-gray-700 transition duration-300 ease-in-out">
              <button
                type="submit"
                className="text-gray-100 cursor-pointer w-full h-full focus:outline-none"
              >
                {loading ? (
                  <Loader size="small" />
                ) : (
                  <div className="p-3">Reset Password</div>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
