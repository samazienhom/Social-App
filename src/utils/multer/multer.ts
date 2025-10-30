import multer from "multer"
export enum StoreInEnum {
    memory = "memory",
    disk = "disk"
}

export const uploadMulterFile = ({
    storeIn = StoreInEnum.memory
}: {
    storeIn?: StoreInEnum
}) => {
    const storage = storeIn == StoreInEnum.memory ? multer.memoryStorage() : multer.diskStorage({})

    return multer({ storage })
}