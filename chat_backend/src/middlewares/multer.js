import multer from "multer"

const multerUploader = multer({
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

const singleAvatar = multerUploader.single("avatar")
const attachmentsMulter = multerUploader.array("files", 5)

export { singleAvatar, attachmentsMulter }