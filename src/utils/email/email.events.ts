import { EventEmitter } from "events";
import { sendEmail } from "./send.email";
//const emailEmitter=new EventEmitter()
export enum EMAIL_EVENTS{
    VERIFY_EMAIL="verify_email",
    RESET_PASSWORD="reset_password",
    TWO_STEP_VERIFICATION="two_step_verification",
    TAG="tag"
}
export class EmailEvents{
    constructor(private readonly emitter:EventEmitter){}
    subscribe=(event:EMAIL_EVENTS,callBack:(payload:any)=>void)=>{
        this.emitter.on(event,callBack)
    }
    publish=(event:EMAIL_EVENTS,payload:any)=>{
        this.emitter.emit(event,payload)
    }
}
const emitter=new EventEmitter()
export const emailEmitter=new EmailEvents(emitter)
emailEmitter.subscribe(EMAIL_EVENTS.VERIFY_EMAIL,({to,subject,html}:{
    to:string,
    subject:string,
    html:string
})=>{
sendEmail({to,subject,html})
})
emailEmitter.subscribe(EMAIL_EVENTS.RESET_PASSWORD,({to,subject,html}:{
    to:string,
    subject:string,
    html:string
})=>{
sendEmail({to,subject,html})
})
emailEmitter.subscribe(EMAIL_EVENTS.TWO_STEP_VERIFICATION,({to,subject,html}:{
    to:string,
    subject:string,
    html:string
})=>{
sendEmail({to,subject,html})
})
emailEmitter.subscribe(EMAIL_EVENTS.TAG,({to,subject,html}:{
    to:string,
    subject:string,
    html:string
})=>{
sendEmail({to,subject,html})
})

