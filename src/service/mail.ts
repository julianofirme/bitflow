import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMail({
  body,
  subject,
  to,
}: {
  body: string
  subject: string
  to: string
}) {
  return await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to,
    subject,
    html: body,
  })
}
