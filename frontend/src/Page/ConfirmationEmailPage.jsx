import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="border-none shadow-lg shadow-zinc-500/10 bg-zinc-800 w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Email Confirmation Sent</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-white text-lg">
            We've sent a confirmation email to your inbox. Please check your email and click on the confirmation link to verify your account.
          </p>
        </CardContent>
        {/* <CardFooter className="flex justify-center">
          <Button className="w-full sm:w-auto">Return to Homepage</Button>
        </CardFooter> */}
      </Card>
    </div>
  )
}