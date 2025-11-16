
import { model, models, Schema } from "mongoose";
import { IUser } from "../../modules/userModule/user.types";
import { hash } from "../../utils/security/hash";
import { string } from "zod";

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },


    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    phone: {
        type: String
    },
    profileImage: {
        type: String
    },
    covserImages: {
        type: [String]
    },
    folderId: String,
    isConfirmed: {
        type: Boolean,
        default: false
    },
    changedCredentialsAt: Date,
    emailOtp: {
        otp: String,
        expiredAt: Date
    },
    passOtp: {
        otp: String,
        expiredAt: Date
    },
    twoStepVerification:{
        enabled:Boolean,
        otp:string,
        expiredAt:Date
    },
    loginConfirmation:{
        otp:string,
        expiredAt:Date
    },
    friends:{
        type:[Schema.Types.ObjectId],
        ref:'users',
        default:[]
    }
}, {
    timestamps: true
})
// //document middleware hooks save
// userSchema.pre('save', async function (this, next) {
//     console.log({ doc: this });
//     if (this.isModified('password')) {
//         this.password = await hash(this.password)
//     }
//     console.log('pre save');
// })
// //document middleware hooks update
// userSchema.pre('updateOne', { document: true, query: false }, async function (this, next) {
//     console.log(this);
// })
// //document middleware hooks delete
// userSchema.pre('deleteOne', { document: true, query: false }, async function (this, next) {
//     console.log(this);
// })




// //query middleware hooks update
// userSchema.pre('updateOne', async function (this, next) {
//     console.log(this);
// })
// //query middleware hooks delete
// userSchema.pre('deleteOne', async function (this, next) {
//     console.log(this);
// })
// //query middleware hooks findOne
// userSchema.pre('findOne', async function (this, next) {
//     this.setQuery({ ...this.getQuery(), firstName: "sama" })
// })
// //query middleware hooks findoneAndUpdate
// userSchema.pre('findOneAndUpdate', async function (this, next) {
//     this.setUpdate({
//         ...this.getUpdate(),
//         $inc: {
//             __v: 1
//         }
//     })
//     console.log(this.getUpdate(), this.getOptions());
// })

// //model middleware hooks insertMany
// userSchema.pre('insertMany', async function (next, docs) {
//     console.log(this);
//     console.log(docs);
// })

export const UserModel = models.users || model<IUser>('users', userSchema)