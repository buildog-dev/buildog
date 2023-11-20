'use client'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AuthenticationPage() {
    return (
        <>
            <div className="container relative h-full w-full flex-col items-center justify-center md:grid  lg:grid-cols-2 lg:px-0 bg-white lg:flex-row m-0">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-6 w-6"
                        >
                            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                        </svg>
                        Burası Bizim
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                “This library has saved me countless hours of work and
                                helped me deliver stunning designs to my clients faster than
                                ever before.”
                            </p>
                            <footer className="text-sm">Sofia Davis</footer>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight text-black">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-muted-foreground text-black">
                                Enter your email below
                            </p>
                        </div>
                        <Input placeholder="Enter email" className="text-black"></Input>
                        <Input placeholder="Enter password" type="password" className="text-black"></Input>
                        <Button className="bg-black text-white">SignIn</Button>

                    </div>
                </div>
            </div>
            <style jsx>{`
                @media (max-width: 600px) {
                    .container {
                        flex-direction: column;
                    }
                }
            `}</style>
        </>
    )
}
