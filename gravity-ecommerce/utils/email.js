const nodemailer = require('nodemailer');

const sendOrderConfirmation = async (user, order) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #fff; padding: 20px; border-radius: 8px;">
      <h1 style="color: #d4af37; text-align: center;">Gravity Premium</h1>
      <h2 style="border-bottom: 1px solid #333; padding-bottom: 10px;">Order Confirmation</h2>
      <p>Hello ${user.name},</p>
      <p>Thank you for your premium order. Below is your order summary:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        ${order.items.map(item => `
          <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 10px 0;">${item.name} (${item.size}, ${item.color}) x ${item.quantity}</td>
            <td style="text-align: right;">$${item.price.toFixed(2)}</td>
          </tr>
        `).join('')}
      </table>
      <h3 style="text-align: right; margin-top: 20px; color: #d4af37;">Total: $${order.totalAmount.toFixed(2)}</h3>
      <p>Your items will be shipped to:</p>
      <p style="color: #ccc;">${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
      <p style="text-align: center; font-size: 12px; color: #666; margin-top: 40px;">Gravity Ecommerce &copy; 2026</p>
    </div>
  `;

  // Send to user
  await transporter.sendMail({
    from: `"Gravity" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Order Confirmation - ${order._id}`,
    html: htmlContent
  });

  // ADMIN EMAIL: replace with your email in .env or hardcode here as requested
  const adminEmail = process.env.ADMIN_EMAIL || 'shazaib@example.com'; 
  await transporter.sendMail({
    from: `"Gravity Alerts" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `New Order Received - ${order._id}`,
    html: `<p>New order placed by ${user.email}.</p>${htmlContent}`
  });
};

module.exports = { sendOrderConfirmation };
