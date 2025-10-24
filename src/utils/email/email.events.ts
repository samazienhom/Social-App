import { EventEmitter } from "events";
import { sendEmail } from "./send.email";
//const emailEmitter=new EventEmitter()
export enum EMAIL_EVENTS{
    VERIFY_EMAIL="verify_email",
    PESET_PASSWORD="reset_password"
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