import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, PasswordInput } from "@/components";
import { toast } from "react-toast";
import { useAuth } from "@hooks/useAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function RegisterPage() {
  const { register: registerUser } = useAuth();
  const loginFormSchema = z
    .object({
      name: z.string().min(2, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type loginFormData = z.infer<typeof loginFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  async function onSubmit(data: loginFormData) {
    const { name, email, password } = data;
    const { success, message } = await registerUser(name, email, password);

    if (success) {
      console.log("Registered");
      toast.success(message);
      navigate("/auth/login");
    } else {
      console.log("Registering failed");
      toast.error(message);
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-b from-[#42bedd] to-white to-50%">
      <div className="flex flex-col bg-white/20 backdrop-blur-xs rounded-4xl border border-gray-300 drop-shadow-md max-w-2xl w-fit h-fit p-6 my-6">
        <div>
          <div className="flex justify-center items-center p-2 w-18 h-18 mx-auto mb-4 shadow bg-white/25 rounded-3xl">
            <ArrowDownOnSquareIcon className="text-gray-700" />
          </div>
          <h1 className="text-center text-2xl text-gray-700 font-semibold mb-4">
            Sign up with email
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <TextInput
              iconNode={<UserIcon />}
              placeholder="Username"
              error={errors.name?.message}
              {...register("name")}
            />
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
            <PasswordInput
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            {errors.root && (
              <span className="text-red-500 text-sm -mt-1">
                {errors.root.message}
              </span>
            )}
            <div className="flex items-center justify-center bg-gray-800 w-full rounded-2xl my-4 min-w-sm hover:bg-gray-700 transition duration-300 ease-in-out">
              <button
                type="submit"
                className="text-gray-100 cursor-pointer w-full h-full focus:outline-none p-3"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
        <div className="flex items-center justify-center p-6">
          <p className="text-gray-600">Already have an account?</p>
          <Link
            to="/auth/login"
            className="text-[#42bedd] font-semibold ml-2 hover:text-[#42bedd]/80"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
