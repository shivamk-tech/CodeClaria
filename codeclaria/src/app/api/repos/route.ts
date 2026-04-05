
import { getServerSession } from "next-auth"
import authOption from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOption)

  if (!session?.accessToken) {
    return Response.json({ error: "No access token" }, { status: 401 })
  }

  const res = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  })

  const data = await res.json()

  return Response.json(data)
}