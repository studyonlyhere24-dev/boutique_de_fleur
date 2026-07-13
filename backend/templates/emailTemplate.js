//backend/templates/emailTemplate.js

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif  line-height: 1.6  color: #333  max-width: 600px  margin: 0 auto  padding: 20px ">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049)  padding: 20px  text-align: center ">
    <h1 style="color: white  margin: 0 ">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9  padding: 20px  border-radius: 0 0 5px 5px  box-shadow: 0 2px 5px rgba(0,0,0,0.1) ">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center  margin: 30px 0 ">
      <div style="background-color: #4CAF50  color: white  width: 50px  height: 50px  line-height: 50px  border-radius: 50%  display: inline-block  font-size: 30px ">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center  margin-top: 20px  color: #888  font-size: 0.8em ">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif  line-height: 1.6  color: #333  max-width: 600px  margin: 0 auto  padding: 20px ">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049)  padding: 20px  text-align: center ">
    <h1 style="color: white  margin: 0 ">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9  padding: 20px  border-radius: 0 0 5px 5px  box-shadow: 0 2px 5px rgba(0,0,0,0.1) ">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center  margin: 30px 0 ">
      <a href="{resetURL}" style="background-color: #4CAF50  color: white  padding: 12px 20px  text-decoration: none  border-radius: 5px  font-weight: bold ">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center  margin-top: 20px  color: #888  font-size: 0.8em ">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`

export const ORDER_CONFIRMATION_TEMPLATE = (order, orderId) => {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 10px  border-bottom: 1px solid #eee "><strong>${item.product.name}</strong></td>
            <td style="padding: 10px  border-bottom: 1px solid #eee  text-align: center ">${item.quantity}</td>
            <td style="padding: 10px  border-bottom: 1px solid #eee  text-align: right ">${item.priceAtPurchase.toFixed(2)} €</td>
            <td style="padding: 10px  border-bottom: 1px solid #eee  text-align: right  font-weight: bold ">${(item.quantity * item.priceAtPurchase).toFixed(2)} €</td>
        </tr>
    `).join('') 

    return `
        <div style="font-family: Arial, sans-serif  max-width: 600px  margin: auto  padding: 20px  border: 1px solid #eaeaea  border-radius: 10px ">
            <h2 style="color: #2e7d32  text-align: center ">Merci pour votre commande ! 🌸</h2>
            <p style="color: #333  font-size: 16px ">Bonjour,</p>
            <p style="color: #333  font-size: 16px ">Nous avons bien reçu votre commande <strong>#${orderId}</strong> et nous la préparons avec soin. Voici votre récapitulatif :</p>
            
            <table style="width: 100%  border-collapse: collapse  margin-top: 20px  margin-bottom: 20px  font-size: 15px ">
                <thead>
                    <tr style="background-color: #f9f9f9 ">
                        <th style="padding: 10px  text-align: left  border-bottom: 2px solid #ddd ">Fleur</th>
                        <th style="padding: 10px  text-align: center  border-bottom: 2px solid #ddd ">Qté</th>
                        <th style="padding: 10px  text-align: right  border-bottom: 2px solid #ddd ">Prix U.</th>
                        <th style="padding: 10px  text-align: right  border-bottom: 2px solid #ddd ">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 15px 10px  text-align: right  font-size: 16px  border-top: 2px solid #ddd "><strong>Total :</strong></td>
                        <td style="padding: 15px 10px  text-align: right  font-size: 18px  color: #2e7d32  border-top: 2px solid #ddd "><strong>${order.totalAmount.toFixed(2)} €</strong></td>
                    </tr>
                </tfoot>
            </table>
            
            <p style="font-size: 14px  color: #555  text-align: center ">À très bientôt,<br><strong>L'équipe FloraNet</strong></p>
        </div>
    ` 
} 