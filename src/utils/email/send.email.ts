import nodemailer from 'nodemailer'
export const sendEmail=({
to,
subject,
html
}:{
    to:string,
    subject:string,
    html:string
})=>{
    const transportOptions={
        host:(process.env.HOST),
        port:Number(process.env.EMAIL_PORT),
        secure:true,
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    }
    const transporter=nodemailer.createTransport(transportOptions)
    const main=async()=>{
        const info=await transporter.sendMail({
            from:`Social App<${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        })
    
    }
    main().catch((err)=>{
        console.log({err});
    })
}