import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowRightEndOnRectangleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Loader } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toast";

function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const loginFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

  type loginFormData = z.infer<typeof loginFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: loginFormData) {
    if (loading) return;
    const { success, message } = await login(data.email, data.password);

    if (success) {
      toast.success(message);
      toast.info("Redirecting to home page...");
      setTimeout(() => {
        toast.hideAll();
        navigate("/");
      }, 2000);
    } else {
      toast.error(message);
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-b from-[#42bedd] to-white to-50%">
      <div className="flex flex-col bg-white/20 backdrop-blur-xs rounded-4xl border border-gray-300 drop-shadow-md max-w-2xl w-fit h-fit p-6 my-6">
        <div>
          <div className="flex justify-center items-center p-2 w-18 h-18 mx-auto mb-4 shadow bg-white/25 rounded-3xl">
            <ArrowRightEndOnRectangleIcon className="text-gray-700" />
          </div>
          <h1 className="text-center text-2xl font-semibold mb-4">
            Sign in with email
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Please enter your credentials to log in.
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
            <PasswordInput
              error={errors.password?.message}
              {...register("password")}
            />
            <Link to="/forgot-password" className="place-self-end -mt-2">
              Forgot Password?
            </Link>
            <div className="flex items-center justify-center bg-gray-800 w-full rounded-2xl my-4 min-w-sm hover:bg-gray-700 transition duration-300 ease-in-out">
              <button
                type="submit"
                className="text-gray-100 cursor-pointer w-full h-full focus:outline-none"
              >
                {loading ? (
                  <Loader size="small" />
                ) : (
                  <div className="p-3">Log In</div>
                )}
              </button>
            </div>
          </div>
        </form>
        <div className="flex items-center justify-center p-6">
          <p className="text-gray-600">Don't have an account?</p>
          <Link
            to="/register"
            className="text-[#42bedd] font-semibold ml-2 hover:text-[#42bedd]/80"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
