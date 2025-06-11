import api from "@/config/api";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import errorHandler from "@/config/errorHandler";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, Loader } from "@/components";
import { toast } from "react-toast";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { loading } = useAuth();

  const forgotPasswordFormSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  type forgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: forgotPasswordFormData) {
    if (loading) return;
    try {
      const response = await api.post("/user/forgot-password", data);
      toast.success(response.data.message);
      navigate("/auth/login");
    } catch (error) {
      toast.error(errorHandler(error));
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-b from-[#42bedd] to-white to-50%">
      <div className="flex flex-col bg-white/20 backdrop-blur-xs rounded-4xl border border-gray-300 drop-shadow-md max-w-2xl w-fit h-fit p-6 my-6">
        <div>
          <h1 className="text-center text-2xl font-semibold mb-4">
            Forgot Password
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Enter your email to receive a password reset link.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <TextInput
              iconNode={<EnvelopeIcon />}
              placeholder="Email"
              error={errors.email?.message}
              {...register("email")}
            />
            <div className="flex items-center justify-center bg-gray-800 w-full rounded-2xl my-4 min-w-sm hover:bg-gray-700 transition duration-300 ease-in-out">
              <button
                type="submit"
                className="text-gray-100 cursor-pointer w-full h-full focus:outline-none"
              >
                {loading ? (
                  <Loader size="small" />
                ) : (
                  <div className="p-3">Send Reset Link</div>
                )}
              </button>
            </div>
          </div>
        </form>
        <div className="flex items-center justify-center p-6">
          <p className="text-gray-600">Remembered your password?</p>
          <Link
            to="/login"
            className="text-[#42bedd] font-semibold ml-2 hover:text-[#42bedd]/80"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
