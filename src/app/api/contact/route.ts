import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = (formData.get("phone") as string) || "Not provided";
    const project = (formData.get("project") as string) || "Not specified";
    const message = formData.get("message") as string;

    // Honeypot check
    const honey = formData.get("_honey") as string;
    if (honey) {
      return NextResponse.redirect(new URL("/#contact", request.url));
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Colorado Apps Co. <noreply@coloradoappsco.com>",
      to: ["support@coloradoappsco.com"],
      replyTo: email,
      subject: `New Project Inquiry from ${name} - ColoradoAppsCo.com`,
      html: `
        <h2>New Project Inquiry</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Name</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Phone</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Project Type</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${project}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Message</td>
            <td style="padding: 8px 12px;">${message.replace(/\n/g, "<br>")}</td>
          </tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">Sent from ColoradoAppsCo.com contact form</p>
      `,
    });

    return NextResponse.redirect(new URL("/?submitted=true#contact", request.url));
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
