import { Resend } from 'resend'
import { logger } from '../logger/logger.js'

const resend = new Resend(process.env.RESEND_API_KEY)

interface MailerProps {
  body: string
  subject: string
  to: string
}

async function mailer({ body, subject, to }: MailerProps) {
  return await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to,
    subject,
    html: body,
  })
}

export async function sendMail(content: MailerProps) {
  const { data, error } = await mailer(content)

  if (error) {
    logger.error(`Error sending email: ${error.message}`)
  } else {
    logger.info(
      `Email ID: ${data?.id} - ${content.subject} email was sent to user ${content.to}`,
    )
  }
}
