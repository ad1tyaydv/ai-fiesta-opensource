import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ChatClient from './ChatClient'

export default async function HomePage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return <ChatClient />
}