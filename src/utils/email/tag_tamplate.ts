export const tagged_template = ({
  name,
  author,
  subject
}: {
  name: string;
  author: string;
  subject: string;
}) => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      direction: rtl;
      text-align: right;
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
      background-color: #6366F1;
      color: #ffffff;
      text-align: center;
      padding: 20px;
      font-size: 22px;
      font-weight: bold;
    }
    .content {
      padding: 30px;
      line-height: 1.7;
    }
    .post-box {
      background: #f5f7ff;
      border: 1px solid #e0e7ff;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .post-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #1e293b;
    }
    .post-excerpt {
      font-size: 14px;
      color: #475569;
    }
    .cta-btn {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 12px 24px;
      margin-top: 15px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
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
      <h1 style="margin: 0;">${subject}</h1>
    </div>

    <div class="content">
      <h2>Hi ${name}</h2>

      <p> <strong>${author}</strong> mintioned you.</p>

      

    
    </div>

   
  </div>

</body>
</html>`;
