"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEmitter = exports.EmailEvents = exports.EMAIL_EVENTS = void 0;
const events_1 = require("events");
const send_email_1 = require("./send.email");
//const emailEmitter=new EventEmitter()
var EMAIL_EVENTS;
(function (EMAIL_EVENTS) {
    EMAIL_EVENTS["VERIFY_EMAIL"] = "verify_email";
    EMAIL_EVENTS["PESET_PASSWORD"] = "reset_password";
})(EMAIL_EVENTS || (exports.EMAIL_EVENTS = EMAIL_EVENTS = {}));
class EmailEvents {
    emitter;
    constructor(emitter) {
        this.emitter = emitter;
    }
    subscribe = (event, callBack) => {
        this.emitter.on(event, callBack);
    };
    publish = (event, payload) => {
        this.emitter.emit(event, payload);
    };
}
exports.EmailEvents = EmailEvents;
const emitter = new events_1.EventEmitter();
exports.emailEmitter = new EmailEvents(emitter);
exports.emailEmitter.subscribe(EMAIL_EVENTS.VERIFY_EMAIL, ({ to, subject, html }) => {
    (0, send_email_1.sendEmail)({ to, subject, html });
});
