"use client";
import { useForm } from "react-hook-form";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";

interface LoginFormInputs {
  name: string;
  email: string;
}

const LoginPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const router = useRouter();

  const onSubmitLogin = async (data: LoginFormInputs) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const json = await response.json();
      setCookie(null, 'user_id', json.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const onSubmitSignup = async (data: LoginFormInputs) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const json = await response.json();
      setCookie(null, 'user_id', json.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      router.push('/');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-4 text-center">タイムカプセルへ ようこそ</h2>
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-10 mb-4'>
          <form onSubmit={handleSubmit(onSubmitLogin)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                ニックネーム
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: '名前は必須です' })}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'メールアドレスは必須です',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '有効なメールアドレスを入力してください',
                  },
                })}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                ログイン
              </button>
            </div>
          </form>
          <form onSubmit={handleSubmit(onSubmitSignup)}>
            <div className="flex items-center justify-center pt-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                サインアップ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
