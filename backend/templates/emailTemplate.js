//backend/templates/emailTemplate.js

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mot de passe réinitialisé</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #292524; background-color: #FAFAF9; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
    <div style="background-color: #6B8767; padding: 40px 20px; text-align: center;">
      <p style="color: #D4A3A2; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 10px 0;">Maison Florale</p>
      <h1 style="font-family: Georgia, 'Times New Roman', serif; font-weight: normal; color: white; margin: 0; font-size: 28px;">Succès de l'opération</h1>
    </div>
    <div style="padding: 40px 30px;">
      <p style="font-size: 15px; color: #78716C;">Bonjour,</p>
      <p style="font-size: 15px; color: #78716C;">Nous vous confirmons que votre mot de passe a été réinitialisé avec succès.</p>
      <div style="text-align: center; margin: 40px 0;">
        <div style="background-color: #f0fdf4; color: #6B8767; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 24px; border: 2px solid #6B8767;">
          ✓
        </div>
      </div>
      <p style="font-size: 14px; color: #78716C; font-style: italic;">Si vous n'êtes pas à l'origine de cette modification, veuillez contacter notre atelier immédiatement.</p>
      <p style="font-size: 15px; color: #78716C; margin-top: 30px;">À très bientôt,<br><strong style="color: #292524;">L'Atelier Maison Florale</strong></p>
    </div>
    <div style="text-align: center; padding: 20px; background-color: #FAFAF9; color: #a8a29e; font-size: 11px;">
      <p>Ceci est un message automatique, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
`

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de votre mot de passe</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #292524; background-color: #FAFAF9; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
    <div style="background-color: #6B8767; padding: 40px 20px; text-align: center;">
      <p style="color: #D4A3A2; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 10px 0;">Maison Florale</p>
      <h1 style="font-family: Georgia, 'Times New Roman', serif; font-weight: normal; color: white; margin: 0; font-size: 28px;">Oubli de mot de passe ?</h1>
    </div>
    <div style="padding: 40px 30px;">
      <p style="font-size: 15px; color: #78716C;">Bonjour,</p>
      <p style="font-size: 15px; color: #78716C;">Nous avons reçu une demande de réinitialisation pour votre compte. Si vous n'avez pas fait cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>
      <p style="font-size: 15px; color: #78716C;">Pour définir un nouveau mot de passe, veuillez cliquer sur le bouton ci-dessous :</p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="{resetURL}" style="background-color: #6B8767; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: 500; font-size: 14px; display: inline-block;">Réinitialiser mon mot de passe</a>
      </div>
      <p style="font-size: 13px; color: #a8a29e; text-align: center;">Ce lien expirera dans 1 heure.</p>
      <p style="font-size: 15px; color: #78716C; margin-top: 30px;">L'élégance à l'état premium,<br><strong style="color: #292524;">L'Atelier Maison Florale</strong></p>
    </div>
    <div style="text-align: center; padding: 20px; background-color: #FAFAF9; color: #a8a29e; font-size: 11px;">
      <p>Ceci est un message automatique, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
`

export const ORDER_CONFIRMATION_TEMPLATE = (order, orderId) => {
    // 💡 Changement de la devise pour correspondre au front (DA au lieu de €)
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 16px 10px; border-bottom: 1px solid #f3f4f6; color: #292524;"><strong>${item.product.name}</strong></td>
            <td style="padding: 16px 10px; border-bottom: 1px solid #f3f4f6; text-align: center; color: #78716C;">${item.quantity}</td>
            <td style="padding: 16px 10px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #78716C;">${item.priceAtPurchase.toLocaleString('fr-FR')} DA</td>
            <td style="padding: 16px 10px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 600; color: #6B8767;">${(item.quantity * item.priceAtPurchase).toLocaleString('fr-FR')} DA</td>
        </tr>
    `).join('') 

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #292524; background-color: #FAFAF9; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
    <div style="background-color: #FAFAF9; padding: 40px 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
      <p style="color: #6B8767; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 10px 0;">Maison Florale</p>
      <h1 style="font-family: Georgia, 'Times New Roman', serif; font-weight: normal; color: #292524; margin: 0; font-size: 26px;">Votre poésie est en préparation 🌸</h1>
    </div>
    <div style="padding: 30px;">
        <p style="color: #78716C; font-size: 15px;">Bonjour,</p>
        <p style="color: #78716C; font-size: 15px;">Nous avons bien reçu votre commande <strong>#${orderId}</strong>. Nos artisans fleuristes préparent vos compositions avec le plus grand soin.</p>
        
        <div style="margin-top: 30px; margin-bottom: 30px; padding: 20px; background-color: #FAFAF9; border-radius: 16px;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #D4A3A2; font-weight: bold; margin-bottom: 15px; text-align: center;">Récapitulatif de l'Atelier</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr>
                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #D4A3A2; color: #a8a29e; font-weight: normal; font-size: 12px; text-transform: uppercase;">Création</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 1px solid #D4A3A2; color: #a8a29e; font-weight: normal; font-size: 12px; text-transform: uppercase;">Qté</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 1px solid #D4A3A2; color: #a8a29e; font-weight: normal; font-size: 12px; text-transform: uppercase;">Prix</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 1px solid #D4A3A2; color: #a8a29e; font-weight: normal; font-size: 12px; text-transform: uppercase;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 20px 10px 10px 10px; text-align: right; font-size: 15px; color: #78716C;">Sous-total :</td>
                        <td style="padding: 20px 10px 10px 10px; text-align: right; font-size: 18px; color: #6B8767; font-weight: bold;">${order.totalAmount.toLocaleString('fr-FR')} DA</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        
        <p style="font-size: 15px; color: #78716C; text-align: center; margin-top: 40px;">Merci pour votre confiance.<br><strong style="color: #292524;">L'équipe Maison Florale</strong></p>
    </div>
  </div>
</body>
</html>
    ` 
}