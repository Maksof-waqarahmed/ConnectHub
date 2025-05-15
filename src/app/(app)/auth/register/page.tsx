import { RegisterForm } from "@/components/auth/register-form"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function RegisterPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-svh w-full bg-gradient-to-br from-[#8E51FF] to-[#6930c3] p-2 md:p-0">
      {/* Left side - Illustration/Branding */}
      <div className="lg:w-1/2 p-6 lg:p-12 flex flex-col justify-center items-center text-white">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Link href="/auth/login" className="inline-flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Join ConnectHub</h1>
            <p className="text-white/80 text-lg">
              Connect with friends, share moments, and discover new opportunities in our growing community.
            </p>
          </div>

          <div className="hidden lg:block relative h-80 w-full">
            <Image
              src="/illustration-login.png"
              alt="ConnectHub Illustration"
              fill
              className="object-contain rounded-tr-full rounded-bl-full"
              priority
            />
          </div>

          <div className="hidden lg:block mt-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs"
                  >
                    <Image
                      src={`/person${i}.jpg`}
                      alt={`User ${i}`}
                      width={50}
                      height={50}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm">Join 10,000+ users already on ConnectHub</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="lg:w-1/2 bg-white rounded-t-3xl lg:rounded-none p-6 lg:p-0 flex items-center justify-center">
        <div className="w-full max-w-md p-4 lg:p-12">
          <div className="lg:hidden mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-500">Fill in your details to get started</p>
          </div>

          <RegisterForm />

          <div className="lg:hidden mt-8 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-xs text-purple-700"
                  >
                    <Image
                      src={`/person${i}.jpg`}
                      alt={`User ${i}`}
                      width={50}
                      height={50}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                ))}
              </div>
              <p>Join thousands of users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
