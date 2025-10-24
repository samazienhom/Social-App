export const otp_tamplate=({otp,name,subject}:{otp:string,name:string,subject:string})=>`<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #4CAF50;
      color: #ffffff;
      text-align: center;
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 30px;
      text-align: center;
      line-height: 1.6;
    }
    .otp-code {
      display: inline-block;
      background-color: #f0f0f0;
      color: #333;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      padding: 15px 30px;
      margin: 20px 0;
      border-radius: 6px;
    }
    .footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
    <h1>${subject}</h1>
    </div>
    <div class="content">
      <h2>Hello ${name}</h2>
      <p>لقد طلبت رمز التحقق لمتابعة العملية.</p>
      <div class="otp-code">${otp}</div>
      <p>إذا لم تطلب هذا الرمز، يرجى تجاهل الرسالة.</p>
      <p>شكراً لاستخدامك خدمتنا!</p>
    </div>
    <div class="footer">
      &copy; 2025 شركتك. جميع الحقوق محفوظة.
    </div>
  </div>
</body>
</html>
`